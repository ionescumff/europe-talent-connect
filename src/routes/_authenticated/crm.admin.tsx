import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyRoles, fetchTeam, isAdminRole, memberName, ROLE_LABELS, ROLES, type Role } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/crm/admin")({
  component: Admin,
});

function Admin() {
  const roles = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const [tab, setTab] = useState<"team" | "performance" | "activity">("team");
  if (roles.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!isAdminRole(roles.data)) return <p className="text-muted-foreground">Only admins and co-founders can open the admin panel.</p>;
  const cls = (t: string) => `rounded-full px-4 py-2 text-sm font-medium ${tab === t ? "bg-glass-strong" : "hover:bg-glass"}`;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Admin panel</h1>
        <div className="flex gap-2">
          <button className={cls("team")} onClick={() => setTab("team")}>Employees</button>
          <button className={cls("performance")} onClick={() => setTab("performance")}>Performance</button>
          <button className={cls("activity")} onClick={() => setTab("activity")}>Activity log</button>
        </div>
      </div>
      {tab === "team" && <TeamTab />}
      {tab === "performance" && <PerformanceTab />}
      {tab === "activity" && <ActivityTab />}
    </div>
  );
}

function TeamTab() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const team = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const managers = (team.data ?? []).filter((m) => m.role === "manager");

  async function setRole(userId: string, role: Role | "none") {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (error) { toast.error("Could not change role"); return; }
    if (role !== "none") {
      const { error: e2 } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (e2) { toast.error("Could not set role"); return; }
    }
    toast.success("Role updated");
    qc.invalidateQueries({ queryKey: ["team"] });
  }

  async function setManager(userId: string, managerId: string) {
    const { error } = await supabase.from("staff_profiles").update({ manager_id: managerId || null }).eq("user_id", userId);
    if (error) { toast.error("Could not set manager"); return; }
    qc.invalidateQueries({ queryKey: ["team"] });
  }

  async function remove(userId: string) {
    if (!confirm("Remove this employee's access and unassign all their leads?")) return;
    await supabase.from("cv_submissions").update({ assigned_to: null }).eq("assigned_to", userId);
    await supabase.from("vacancy_enquiries").update({ assigned_to: null }).eq("assigned_to", userId);
    await setRole(userId, "none");
    qc.invalidateQueries({ queryKey: ["candidates"] });
    qc.invalidateQueries({ queryKey: ["enquiries"] });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        New staff request access on the portal. Give them a role here; associates and partner agencies can report to a manager.
      </p>
      <div className="glass-card divide-y divide-glass-border">
        {team.data?.map((m) => (
          <div key={m.user_id} className="grid items-center gap-3 p-4 text-sm md:grid-cols-[1fr_220px_220px_auto]">
            <div>
              <p className="font-semibold">{m.full_name || m.email}</p>
              <p className="text-muted-foreground">{m.email}</p>
            </div>
            <select value={m.role ?? "none"} disabled={m.user_id === user.id} onChange={(e) => setRole(m.user_id, e.target.value as Role | "none")} className="field">
              <option value="none">No access</option>
              {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
            <select value={m.manager_id ?? ""} onChange={(e) => setManager(m.user_id, e.target.value)} className="field" disabled={!m.role || m.role === "admin" || m.role === "cofounder"}>
              <option value="">No manager</option>
              {managers.filter((x) => x.user_id !== m.user_id).map((x) => <option key={x.user_id} value={x.user_id}>{x.full_name || x.email}</option>)}
            </select>
            <button disabled={m.user_id === user.id || !m.role} onClick={() => remove(m.user_id)} className="rounded-full border border-glass-border px-4 py-2 font-medium text-destructive disabled:opacity-40">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformanceTab() {
  const team = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const stats = useQuery({
    queryKey: ["performance"],
    queryFn: async () => {
      const [{ data: c }, { data: n }] = await Promise.all([
        supabase.from("cv_submissions").select("assigned_to, status"),
        supabase.from("candidate_notes").select("author_id, kind"),
      ]);
      return { cands: c ?? [], notes: n ?? [] };
    },
  });
  const rows = (team.data ?? []).filter((m) => m.role).map((m) => {
    const mine = stats.data?.cands.filter((c) => c.assigned_to === m.user_id) ?? [];
    const notes = stats.data?.notes.filter((x) => x.author_id === m.user_id) ?? [];
    return {
      m,
      assigned: mine.length,
      interview: mine.filter((c) => c.status === "interview").length,
      placed: mine.filter((c) => c.status === "placed").length,
      calls: notes.filter((x) => x.kind !== "note").length,
      notes: notes.length,
    };
  });
  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-muted-foreground">
          <tr><th className="p-4">Employee</th><th className="p-4">Role</th><th className="p-4">Assigned</th><th className="p-4">In interview</th><th className="p-4">Placed</th><th className="p-4">Contacts logged</th><th className="p-4">All notes</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.m.user_id} className="border-t border-glass-border">
              <td className="p-4 font-semibold">{r.m.full_name || r.m.email}</td>
              <td className="p-4">{ROLE_LABELS[r.m.role!]}</td>
              <td className="p-4">{r.assigned}</td>
              <td className="p-4">{r.interview}</td>
              <td className="p-4 font-semibold text-accent">{r.placed}</td>
              <td className="p-4">{r.calls}</td>
              <td className="p-4">{r.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityTab() {
  const team = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const log = useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const { data, error } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data;
    },
  });
  const describe = (d: unknown) => {
    if (!d || typeof d !== "object") return "";
    return Object.entries(d as Record<string, unknown>).map(([k, v]) => {
      if (k === "assigned_to" && Array.isArray(v)) return `assigned to ${memberName(team.data, v[1] as string | null)}`;
      if (Array.isArray(v)) return `${k}: ${v[0] ?? "—"} → ${v[1] ?? "—"}`;
      return `${k}: ${String(v ?? "—")}`;
    }).join(" · ");
  };
  return (
    <div className="glass-card divide-y divide-glass-border text-sm">
      {log.data?.map((a) => (
        <div key={a.id} className="flex flex-wrap justify-between gap-3 p-4">
          <span>
            <b>{a.actor_email ?? "System"}</b> {a.action} {a.entity === "staff" ? memberName(team.data, a.entity_id) : a.entity === "cv_submissions" ? "a candidate" : "an employer lead"}
            <span className="text-muted-foreground"> {describe(a.details)}</span>
          </span>
          <span className="text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
        </div>
      ))}
      {log.data?.length === 0 && <p className="p-8 text-center text-muted-foreground">No activity yet.</p>}
    </div>
  );
}
