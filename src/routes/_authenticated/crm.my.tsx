import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyRoles, fetchTeam, isAdminRole, memberName, ROLE_LABELS } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/crm/my")({
  component: MyWork,
});

function MyWork() {
  const { user } = Route.useRouteContext();
  const roles = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  const team = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const admin = isAdminRole(roles.data);
  const [viewAs, setViewAs] = useState(user.id);

  const person = team.data?.find((m) => m.user_id === viewAs);
  const isManager = person?.role === "manager";
  const reports = (team.data ?? []).filter((m) => m.manager_id === viewAs).map((m) => m.user_id);
  const ids = [viewAs, ...(isManager ? reports : [])];

  const cands = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cv_submissions").select("*").order("next_follow_up", { ascending: true, nullsFirst: false });
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

  const today = new Date().toISOString().slice(0, 10);
  const mine = (cands.data ?? []).filter((c) => c.assigned_to && ids.includes(c.assigned_to));
  const due = mine.filter((c) => c.next_follow_up && c.next_follow_up <= today);
  const myLeads = (leads.data ?? []).filter((e) => e.assigned_to && ids.includes(e.assigned_to));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{viewAs === user.id ? "My work" : `${memberName(team.data, viewAs)}'s work`}</h1>
          <p className="text-sm text-muted-foreground">
            {person?.role ? ROLE_LABELS[person.role] : ""}{isManager ? ` · includes ${reports.length} team member${reports.length === 1 ? "" : "s"}` : ""}
          </p>
        </div>
        {admin && (
          <select value={viewAs} onChange={(e) => setViewAs(e.target.value)} className="field">
            {(team.data ?? []).filter((m) => m.role).map((m) => (
              <option key={m.user_id} value={m.user_id}>{m.full_name || m.email} · {ROLE_LABELS[m.role!]}</option>
            ))}
          </select>
        )}
      </div>

      <section className="glass-card p-6">
        <h2 className="font-display text-lg font-bold">Follow-ups due today ({due.length})</h2>
        <ul className="mt-3 divide-y divide-glass-border text-sm">
          {due.map((c) => (
            <li key={c.id} className="flex justify-between gap-3 py-2">
              <Link to="/crm/candidates/$id" params={{ id: c.id }} className="font-semibold hover:text-accent">{c.full_name}</Link>
              <span className="text-muted-foreground">{c.phone} · {c.next_follow_up}</span>
            </li>
          ))}
          {due.length === 0 && <li className="py-2 text-muted-foreground">No follow-ups due.</li>}
        </ul>
      </section>

      <section className="glass-card p-6">
        <h2 className="font-display text-lg font-bold">Assigned candidates ({mine.length})</h2>
        <ul className="mt-3 divide-y divide-glass-border text-sm">
          {mine.map((c) => (
            <li key={c.id}>
              <Link to="/crm/candidates/$id" params={{ id: c.id }} className="flex flex-wrap justify-between gap-3 py-2 hover:text-accent">
                <span className="font-semibold">{c.full_name}</span>
                <span className="text-muted-foreground">
                  {c.sector} · {c.status}{isManager ? ` · ${memberName(team.data, c.assigned_to)}` : ""}
                </span>
              </Link>
            </li>
          ))}
          {mine.length === 0 && <li className="py-2 text-muted-foreground">No candidates assigned yet.</li>}
        </ul>
      </section>

      <section className="glass-card p-6">
        <h2 className="font-display text-lg font-bold">Assigned employer leads ({myLeads.length})</h2>
        <ul className="mt-3 divide-y divide-glass-border text-sm">
          {myLeads.map((e) => (
            <li key={e.id} className="flex flex-wrap justify-between gap-3 py-2">
              <span className="font-semibold">{e.company}</span>
              <span className="text-muted-foreground">{e.contact_name} · {e.status}</span>
            </li>
          ))}
          {myLeads.length === 0 && <li className="py-2 text-muted-foreground">No employer leads assigned yet.</li>}
        </ul>
      </section>
    </div>
  );
}
