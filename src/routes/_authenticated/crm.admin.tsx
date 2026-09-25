import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CANDIDATE_STATUSES, fetchMyRoles, fetchTeam, isAdminRole, memberName, ROLE_LABELS, ROLES, type Role } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/crm/admin")({
  component: Admin,
});

function Admin() {
  const roles = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const [tab, setTab] = useState<"overview" | "team" | "performance" | "activity">("overview");
  if (roles.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!isAdminRole(roles.data)) return <p className="text-muted-foreground">Only admins and co-founders can open the admin panel.</p>;
  const cls = (t: string) => `rounded-full px-4 py-2 text-sm font-medium ${tab === t ? "bg-glass-strong" : "hover:bg-glass"}`;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Admin panel</h1>
        <div className="flex flex-wrap gap-2">
          <button className={cls("overview")} onClick={() => setTab("overview")}>Overview</button>
          <button className={cls("team")} onClick={() => setTab("team")}>Employees</button>
          <button className={cls("performance")} onClick={() => setTab("performance")}>Performance</button>
          <button className={cls("activity")} onClick={() => setTab("activity")}>Activity log</button>
        </div>
      </div>
      {tab === "overview" && <OverviewTab />}
      {tab === "team" && <TeamTab />}
      {tab === "performance" && <PerformanceTab />}
      {tab === "activity" && <ActivityTab />}
    </div>
  );
}

function OverviewTab() {
  const team = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const data = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [{ data: c }, { data: e }, { data: j }, { data: l }] = await Promise.all([
        supabase.from("cv_submissions").select("id, full_name, status, assigned_to, created_at, next_follow_up, cv_path"),
        supabase.from("vacancy_enquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("job_posts").select("id, title, city, published, status"),
        supabase.from("job_post_candidates").select("job_id"),
      ]);
      return { cands: c ?? [], enqs: e ?? [], jobs: j ?? [], links: l ?? [] };
    },
  });
  if (data.isLoading || team.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  const cands = data.data?.cands ?? [];
  const enqs = data.data?.enqs ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newCands = cands.filter((c) => c.status === "new");
  const unassignedCands = newCands.filter((c) => !c.assigned_to);
  const unassignedEnqs = enqs.filter((e) => e.status === "new" && !e.assigned_to);
  const overdue = cands.filter((c) => c.next_follow_up && c.next_follow_up < today && c.status !== "placed" && c.status !== "rejected");
  const dueToday = cands.filter((c) => c.next_follow_up === today);
  const newThisWeek = cands.filter((c) => new Date(c.created_at).getTime() >= weekAgo).length;
  const enqsThisWeek = enqs.filter((e) => new Date(e.created_at).getTime() >= weekAgo).length;
  const pendingAccess = (team.data ?? []).filter((m) => !m.role);
  const jobsList = data.data?.jobs ?? [];
  const linkedJobs = new Set((data.data?.links ?? []).map((l) => l.job_id));
  const liveNoCandidates = jobsList.filter((j) => j.published && j.status === "open" && !linkedJobs.has(j.id));
  const noCv = newCands.filter((c) => !c.cv_path);
  const newEnqs = enqs.filter((e) => e.status === "new");
  const todos: { done: boolean; text: string; to?: "/crm/assign" | "/crm/employers" | "/crm/jobs" | "/crm/my" | "/crm" }[] = [
    { done: newEnqs.length === 0, text: `Reply to ${newEnqs.length} new employer ${newEnqs.length === 1 ? "message" : "messages"}`, to: "/crm/employers" },
    { done: unassignedCands.length + unassignedEnqs.length === 0, text: `Give ${unassignedCands.length + unassignedEnqs.length} unowned leads to someone`, to: "/crm/assign" },
    { done: dueToday.length === 0, text: `${dueToday.length} candidate follow-ups due today`, to: "/crm/my" },
    { done: overdue.length === 0, text: `Chase ${overdue.length} overdue follow-ups with the team`, to: "/crm/my" },
    { done: pendingAccess.length === 0, text: `Give a role to ${pendingAccess.length} new staff ${pendingAccess.length === 1 ? "account" : "accounts"} (Employees tab)` },
    { done: liveNoCandidates.length === 0, text: `Link candidates to ${liveNoCandidates.length} live job ${liveNoCandidates.length === 1 ? "post" : "posts"} with nobody linked`, to: "/crm/jobs" },
    { done: noCv.length === 0, text: `Ask ${noCv.length} new candidates to send their CV`, to: "/crm" },
  ];
  const openTodos = todos.filter((t) => !t.done).length;
  const owner = (id: string | null) => (id ? memberName(team.data ?? [], id) : "Unassigned");

  const stat = (label: string, value: number, hint?: string) => (
    <div className="glass-card p-5">
      <p className="text-3xl font-bold text-accent">{value}</p>
      <p className="mt-1 text-sm font-medium">{label}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="glass-card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold">Today's to-do</h2>
            <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</span>
          </div>
          <p className="text-xs text-muted-foreground">{openTodos === 0 ? "All clear — nothing waiting." : `${openTodos} things need doing`}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {todos.map((t) => (
              <li key={t.text} className={`flex items-center gap-3 ${t.done ? "text-muted-foreground line-through" : ""}`}>
                <span className={`grid size-5 shrink-0 place-items-center rounded-full border text-xs ${t.done ? "border-accent bg-accent text-accent-foreground" : "border-glass-border"}`}>{t.done ? "✓" : ""}</span>
                <span className="flex-1">{t.text}</span>
                {!t.done && t.to && <Link to={t.to} className="text-xs text-accent underline">Open</Link>}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold">Messages from employers</h2>
            <Link to="/crm/employers" className="text-xs text-accent underline">All employer leads</Link>
          </div>
          <ul className="mt-3 max-h-96 space-y-3 overflow-auto pr-1">
            {enqs.slice(0, 8).map((e) => (
              <li key={e.id} className="rounded-xl bg-glass p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">{e.company} <span className="font-normal text-muted-foreground">· {e.contact_name} · {e.country}</span></span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${e.status === "new" ? "bg-accent/20 text-accent" : "bg-glass-strong"}`}>{e.status}</span>
                </div>
                <p className="mt-1 line-clamp-3 whitespace-pre-line text-muted-foreground">{e.message}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <a href={`mailto:${e.email}`} className="text-accent underline">{e.email}</a>
                  {e.phone && <a href={`tel:${e.phone}`} className="underline">{e.phone}</a>}
                  <span className="text-muted-foreground">{new Date(e.created_at).toLocaleDateString("en-GB")} · {owner(e.assigned_to)}</span>
                </div>
              </li>
            ))}
            {enqs.length === 0 && <li className="text-sm text-muted-foreground">No employer messages yet.</li>}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stat("New candidates waiting", newCands.length, `${unassignedCands.length} not assigned to anyone`)}
        {stat("New employer leads", enqs.filter((e) => e.status === "new").length, `${unassignedEnqs.length} not assigned`)}
        {stat("Follow-ups overdue", overdue.length, `${dueToday.length} due today`)}
        {stat("Placed candidates", cands.filter((c) => c.status === "placed").length, "signed a work contract")}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h2 className="font-display text-lg font-semibold">Candidate pipeline</h2>
          <div className="mt-3 space-y-2 text-sm">
            {CANDIDATE_STATUSES.map((s) => {
              const n = cands.filter((c) => c.status === s).length;
              const pct = cands.length ? Math.round((n / cands.length) * 100) : 0;
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-24 capitalize text-muted-foreground">{s}</span>
                  <div className="h-2 flex-1 rounded-full bg-glass">
                    <div className="h-2 rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right font-semibold">{n}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{cands.length} candidates in total · {newThisWeek} new in the last 7 days</p>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-display text-lg font-semibold">Employer leads</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {enqs.length} in total · {enqsThisWeek} new in the last 7 days · {enqs.filter((e) => e.status === "new").length} still new
            </p>
          </div>
          <div className="glass-card p-5">
            <h2 className="font-display text-lg font-semibold">Needs your attention</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {pendingAccess.length > 0 && (
                <li>· {pendingAccess.length} staff {pendingAccess.length === 1 ? "account" : "accounts"} waiting for a role ({pendingAccess.map((m) => m.full_name || m.email).join(", ")}) — see the Employees tab</li>
              )}
              {unassignedCands.length + unassignedEnqs.length > 0 && (
                <li>· {unassignedCands.length + unassignedEnqs.length} new leads have no owner — <Link to="/crm/assign" className="text-accent underline">assign them</Link></li>
              )}
              {overdue.length > 0 && <li>· {overdue.length} follow-ups are overdue across the team</li>}
              {jobsList.filter((j) => !j.published).length > 0 && <li>· {jobsList.filter((j) => !j.published).length} job posts are hidden from the website — <Link to="/crm/jobs" className="text-accent underline">review</Link></li>}
              {pendingAccess.length === 0 && unassignedCands.length + unassignedEnqs.length === 0 && overdue.length === 0 && (
                <li className="text-muted-foreground">Nothing outstanding right now.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h2 className="font-display text-lg font-semibold">Download for your records</h2>
        <p className="text-sm text-muted-foreground">Spreadsheet files (CSV) you can open in Excel for reports, accounting or backups.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <button onClick={() => exportCsv("candidates")} className="rounded-full border border-glass-border px-4 py-2">Candidates</button>
          <button onClick={() => exportCsv("vacancy_enquiries")} className="rounded-full border border-glass-border px-4 py-2">Employer leads</button>
          <button onClick={() => exportCsv("job_posts")} className="rounded-full border border-glass-border px-4 py-2">Job posts</button>
          <button onClick={() => exportCsv("staff_profiles")} className="rounded-full border border-glass-border px-4 py-2">Employees</button>
        </div>
      </div>
    </div>
  );
}

async function exportCsv(table: "candidates" | "vacancy_enquiries" | "job_posts" | "staff_profiles") {
  const q = table === "candidates"
    ? supabase.from("cv_submissions").select("created_at, full_name, phone, email, sector, country_preference, status, applied_job, next_follow_up, message")
    : table === "job_posts"
      ? supabase.from("job_posts").select("created_at, title, company_name, sector, country, city, salary, openings, status, published")
      : supabase.from(table).select("*");
  const { data, error } = await q;
  if (error || !data) { toast.error("Download failed"); return; }
  if (!data.length) { toast.info("Nothing to download yet"); return; }
  const rows = data as Record<string, unknown>[];
  const cols = Object.keys(rows[0]!);
  const esc = (v: unknown) => `"${String(Array.isArray(v) ? v.join("; ") : (v ?? "")).replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv" }));
  a.download = `${table}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
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
