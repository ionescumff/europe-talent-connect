import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CANDIDATE_STATUSES } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/crm/applications")({
  staticData: { sitemap: false },
  head: () => ({ meta: [{ title: "Pending applications — CRM" }, { name: "robots", content: "noindex" }] }),
  component: Applications,
});

function Applications() {
  const qc = useQueryClient();
  const apps = useQuery({
    queryKey: ["pending-applications"],
    queryFn: async () => {
      const [{ data, error }, jobs] = await Promise.all([
        supabase.from("cv_submissions").select("id, full_name, phone, email, applied_job, created_at, status").not("applied_job", "is", null).eq("status", "new").order("created_at", { ascending: false }),
        supabase.from("job_posts").select("id, slug, title, city"),
      ]);
      if (error) throw error;
      const bySlug = new Map((jobs.data ?? []).flatMap((j) => [[j.slug, j], [j.id, j]] as const));
      return (data ?? []).map((a) => ({ ...a, job: bySlug.get(a.applied_job ?? "") }));
    },
  });
  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("cv_submissions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["pending-applications"] }); void qc.invalidateQueries({ queryKey: ["candidates"] }); toast.success("Status updated"); },
    onError: () => toast.error("Couldn't update status"),
  });

  return <div className="space-y-6">
    <div>
      <h1 className="font-display text-3xl font-extrabold">Pending applications</h1>
      <p className="mt-2 text-sm text-muted-foreground">Applications sent from job pages that nobody has handled yet. Change the status to move them out of this list.</p>
    </div>
    {apps.isPending && <p role="status">Loading…</p>}
    {apps.isError && <p role="alert">Couldn't load applications.</p>}
    {apps.isSuccess && (apps.data.length === 0
      ? <p className="rounded-2xl bg-glass p-8 text-center text-sm">No pending applications. 🎉</p>
      : <div className="overflow-x-auto rounded-2xl bg-glass"><table className="w-full text-sm">
        <thead><tr className="text-left text-xs uppercase text-muted-foreground"><th className="p-4">Candidate</th><th className="p-4">Job</th><th className="p-4">Received</th><th className="p-4">Status</th></tr></thead>
        <tbody>{apps.data.map((a) => <tr key={a.id} className="border-t border-border">
          <td className="p-4"><Link to="/crm/candidates/$id" params={{ id: a.id }} className="font-semibold hover:underline">{a.full_name}</Link><div className="text-xs text-muted-foreground">{a.phone}{a.email ? ` · ${a.email}` : ""}</div></td>
          <td className="p-4">{a.job ? <Link to="/crm/applicants/$jobId" params={{ jobId: a.job.id }} className="hover:underline">{a.job.title} — {a.job.city}</Link> : <span className="text-muted-foreground">{a.applied_job}</span>}</td>
          <td className="p-4 whitespace-nowrap">{new Date(a.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</td>
          <td className="p-4"><select aria-label={`Status for ${a.full_name}`} className="rounded-lg border border-border bg-background px-2 py-1" value={a.status} onChange={(e) => setStatus.mutate({ id: a.id, status: e.target.value })}>{CANDIDATE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></td>
        </tr>)}</tbody>
      </table></div>)}
  </div>;
}
