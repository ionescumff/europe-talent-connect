import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchTeam, ROLE_LABELS } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/crm/assign")({
  component: Assign,
});

function Assign() {
  const roles = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const r = roles.data ?? [];
  const canAssign = isAdminRole(r) || r.includes("manager");
  if (roles.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  return (
    <div className="space-y-10">
      <NewLeads canAssign={canAssign} />
      {isAdminRole(r) && <AllLeads />}
    </div>
  );
}

function NewLeads({ canAssign }: { canAssign: boolean }) {
  const qc = useQueryClient();
  const team = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const cands = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cv_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const leads = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vacancy_enquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const associates = (team.data ?? []).filter((m) => m.role === "recruiter" || m.role === "agency");
  const newC = (cands.data ?? []).filter((c) => !c.assigned_to && c.status === "new");
  const newE = (leads.data ?? []).filter((e) => !e.assigned_to && e.status === "new");

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["candidates"] });
    qc.invalidateQueries({ queryKey: ["enquiries"] });
  };
  async function claim(table: "cv_submissions" | "vacancy_enquiries", id: string) {
    const { data, error } = await supabase.rpc("claim_lead", { _table: table, _id: id });
    if (error || !data) toast.error("Someone already took this lead");
    else toast.success("Lead is now yours");
    refresh();
  }
  async function give(table: "cv_submissions" | "vacancy_enquiries", id: string, userId: string) {
    if (!userId) return;
    const { error } = await supabase.from(table).update({ assigned_to: userId }).eq("id", id);
    if (error) toast.error("Could not assign");
    else toast.success("Assigned");
    refresh();
  }
  const action = (table: "cv_submissions" | "vacancy_enquiries", id: string) =>
    canAssign ? (
      <select defaultValue="" onChange={(e) => give(table, id, e.target.value)} className="field w-full">
        <option value="">Give to associate…</option>
        {associates.map((m) => (
          <option key={m.user_id} value={m.user_id}>{m.full_name || m.email} · {ROLE_LABELS[m.role!]}</option>
        ))}
      </select>
    ) : (
      <button onClick={() => claim(table, id)} className="rounded-full bg-accent px-4 py-2 font-semibold text-accent-foreground">
        Take this lead
      </button>
    );

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-bold">New leads</h1>
        <p className="text-sm text-muted-foreground">
          {canAssign ? "Fresh, unassigned leads — give each one to an associate / recruiter." : "Fresh, unassigned leads — take one and it moves to My work."}
        </p>
      </div>
      <div className="glass-card divide-y divide-glass-border">
        {newC.map((c) => (
          <div key={c.id} className="grid items-center gap-3 p-4 text-sm md:grid-cols-[1fr_1fr_240px]">
            <Link to="/crm/candidates/$id" params={{ id: c.id }} className="font-semibold hover:text-accent">{c.full_name} <span className="text-xs text-muted-foreground">· candidate</span></Link>
            <span className="text-muted-foreground">{c.sector} · <span className="capitalize">{c.country_preference}</span> · {new Date(c.created_at).toLocaleDateString()}</span>
            {action("cv_submissions", c.id)}
          </div>
        ))}
        {newE.map((e) => (
          <div key={e.id} className="grid items-center gap-3 p-4 text-sm md:grid-cols-[1fr_1fr_240px]">
            <span className="font-semibold">{e.company} <span className="text-xs text-muted-foreground">· employer</span></span>
            <span className="text-muted-foreground">{e.contact_name} · {e.country} · {new Date(e.created_at).toLocaleDateString()}</span>
            {action("vacancy_enquiries", e.id)}
          </div>
        ))}
        {newC.length + newE.length === 0 && <p className="p-8 text-center text-muted-foreground">No new leads right now.</p>}
      </div>
    </section>
  );
}

function AllLeads() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"candidates" | "employers">("candidates");
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);
  const team = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const cands = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cv_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const leads = useQuery({
    queryKey: ["enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vacancy_enquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const staff = (team.data ?? []).filter((m) => m.role);

  async function assign(table: "cv_submissions" | "vacancy_enquiries", id: string, userId: string) {
    const { error } = await supabase.from(table).update({ assigned_to: userId || null }).eq("id", id);
    if (error) { toast.error("Could not assign"); return; }
    toast.success("Assigned");
    qc.invalidateQueries({ queryKey: [table === "cv_submissions" ? "candidates" : "enquiries"] });
  }

  const picker = (table: "cv_submissions" | "vacancy_enquiries", id: string, value: string | null) => (
    <select value={value ?? ""} onChange={(e) => assign(table, id, e.target.value)} className="field w-full">
      <option value="">Unassigned</option>
      {staff.map((m) => (
        <option key={m.user_id} value={m.user_id}>
          {m.full_name || m.email} · {ROLE_LABELS[m.role!]}
        </option>
      ))}
    </select>
  );

  const rows = tab === "candidates"
    ? (cands.data ?? []).filter((c) => !onlyUnassigned || !c.assigned_to)
    : (leads.data ?? []).filter((c) => !onlyUnassigned || !c.assigned_to);

  const tabCls = (t: string) => `rounded-full px-4 py-2 text-sm font-medium ${tab === t ? "bg-glass-strong" : "hover:bg-glass"}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Assign leads</h1>
          <p className="text-sm text-muted-foreground">Give each candidate or employer lead to a team member or partner agency.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setTab("candidates")} className={tabCls("candidates")}>Candidates</button>
          <button onClick={() => setTab("employers")} className={tabCls("employers")}>Employer leads</button>
          <label className="field flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyUnassigned} onChange={(e) => setOnlyUnassigned(e.target.checked)} />
            Unassigned only
          </label>
        </div>
      </div>
      <div className="glass-card divide-y divide-glass-border">
        {tab === "candidates" && (cands.data ?? []).filter((c) => !onlyUnassigned || !c.assigned_to).map((c) => (
          <div key={c.id} className="grid items-center gap-3 p-4 text-sm md:grid-cols-[1fr_1fr_280px]">
            <Link to="/crm/candidates/$id" params={{ id: c.id }} className="font-semibold hover:text-accent">{c.full_name}</Link>
            <span className="text-muted-foreground">{c.sector} · <span className="capitalize">{c.country_preference}</span> · {c.status}</span>
            {picker("cv_submissions", c.id, c.assigned_to)}
          </div>
        ))}
        {tab === "employers" && (leads.data ?? []).filter((c) => !onlyUnassigned || !c.assigned_to).map((e) => (
          <div key={e.id} className="grid items-center gap-3 p-4 text-sm md:grid-cols-[1fr_1fr_280px]">
            <span className="font-semibold">{e.company}</span>
            <span className="text-muted-foreground">{e.contact_name} · {e.country} · {e.status}</span>
            {picker("vacancy_enquiries", e.id, e.assigned_to)}
          </div>
        ))}
        {rows.length === 0 && <p className="p-8 text-center text-muted-foreground">Nothing to assign.</p>}
      </div>
    </div>
  );
}
