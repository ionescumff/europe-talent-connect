import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CANDIDATE_STATUSES } from "@/lib/crm";
import { getJob, suggestedJobs } from "@/lib/jobs";

export const Route = createFileRoute("/_authenticated/crm/")({
  component: Candidates,
});

function Candidates() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [dueOnly, setDueOnly] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cv_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const today = new Date().toISOString().slice(0, 10);
  const rows = useMemo(
    () =>
      (data ?? []).filter((c) => {
        if (status !== "all" && c.status !== status) return false;
        if (dueOnly && !(c.next_follow_up && c.next_follow_up <= today)) return false;
        const s = q.toLowerCase();
        return !s || [c.full_name, c.email, c.phone, c.sector].some((v) => v?.toLowerCase().includes(s));
      }),
    [data, q, status, dueOnly, today],
  );

  const due = (data ?? []).filter((c) => c.next_follow_up && c.next_follow_up <= today).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Candidates</h1>
          <p className="text-sm text-muted-foreground">
            {data?.length ?? 0} total · {due} follow-up{due === 1 ? "" : "s"} due
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, sector…" className="field" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="field">
            <option value="all">All statuses</option>
            {CANDIDATE_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <label className="field flex items-center gap-2 text-sm">
            <input type="checkbox" checked={dueOnly} onChange={(e) => setDueOnly(e.target.checked)} />
            Follow-up due
          </label>
        </div>
      </div>

      {error && <p className="text-destructive">Could not load candidates.</p>}
      {isLoading && <p className="text-muted-foreground">Loading…</p>}

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Sector</th>
              <th className="p-4">Country</th>
              <th className="p-4">Applied for</th>
              <th className="p-4">Matching jobs</th>
              <th className="p-4">Status</th>
              <th className="p-4">Follow-up</th>
              <th className="p-4">Received</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t border-glass-border hover:bg-glass">
                <td className="p-4 font-semibold">
                  <Link to="/crm/candidates/$id" params={{ id: c.id }} className="hover:text-accent">
                    {c.full_name}
                  </Link>
                  <div className="text-xs font-normal text-muted-foreground">{c.phone}</div>
                </td>
                <td className="p-4">{c.sector}</td>
                <td className="p-4 capitalize">{c.country_preference}</td>
                <td className="p-4">{c.applied_job ? getJob(c.applied_job)?.title ?? "—" : "Open CV"}</td>
                <td className="p-4 font-semibold text-accent">{suggestedJobs(c).length}</td>
                <td className="p-4"><span className="rounded-full bg-glass-strong px-3 py-1 text-xs capitalize">{c.status}</span></td>
                <td className={`p-4 ${c.next_follow_up && c.next_follow_up <= today ? "font-semibold text-accent" : ""}`}>
                  {c.next_follow_up ?? "—"}
                </td>
                <td className="p-4 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No candidates match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
