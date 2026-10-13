import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CANDIDATE_STATUSES, fetchMyRoles, isAdminRole } from "@/lib/crm";
import { CandidateImport } from "@/components/crm/CandidateImport";
import { CandidateCvUpload } from "@/components/crm/CandidateCvUpload";

export const Route = createFileRoute("/_authenticated/crm/applicants/$jobId")({
  head: () => ({ meta: [{ title: "Job applicants — CRM" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Applicants,
});

function Applicants() {
  const roles = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  if (roles.isLoading) return <p>Loading…</p>;
  if (!isAdminRole(roles.data)) return <p>Only admins and co-founders can view job applicant lists.</p>;
  return <ApplicantList />;
}

function ApplicantList() {
  const { jobId } = Route.useParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const job = useQuery({ queryKey: ["job-post", jobId], queryFn: async () => {
    const { data, error } = await supabase.from("job_posts").select("id, title, city, country, slug").eq("id", jobId).single();
    if (error) throw error;
    return data;
  } });
  const applicants = useQuery({ queryKey: ["job-applicants", jobId], queryFn: async () => {
    const { data, error } = await supabase.from("job_post_candidates").select("candidate:cv_submissions(*)").eq("job_id", jobId);
    if (error) throw error;
    return data.flatMap((row) => row.candidate ? [row.candidate] : []).sort((a, b) => b.created_at.localeCompare(a.created_at));
  } });
  const rows = (applicants.data ?? []).filter((c) => (status === "all" || c.status === status) && [c.full_name, c.phone, c.email].some((v) => v?.toLowerCase().includes(search.toLowerCase())));
  return <div className="space-y-6">
    <Link to="/crm/jobs" className="text-sm underline">← Job posts</Link>
    <header><h1 className="font-display text-2xl font-bold">{job.data?.title ?? "Job applicants"}</h1>{job.data && <p className="text-sm text-muted-foreground">{job.data.city}, {job.data.country} · {applicants.data?.length ?? 0} applicants / linked candidates</p>}</header>
    {(job.error || applicants.error) && <p role="alert" className="text-destructive">Could not load this job’s applicants.</p>}
    {(job.isLoading || applicants.isLoading) && <p>Loading…</p>}
    {job.data && <CandidateImport jobId={jobId} />}
    <div className="flex flex-wrap gap-3"><input aria-label="Search applicants" className="field min-w-0" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone…" /><select aria-label="Applicant status" className="field" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{CANDIDATE_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
    <div className="grid gap-4 md:grid-cols-2">{rows.map((c) => <article className="glass-card min-w-0 space-y-4 p-5" key={c.id}>
      <div className="flex flex-wrap justify-between gap-2"><Link to="/crm/candidates/$id" params={{ id: c.id }} className="font-display text-lg font-bold underline">{c.full_name}</Link><span className="text-sm capitalize">{c.status}</span></div>
      <p className="text-xs text-muted-foreground">{c.applied_job === job.data?.slug || c.applied_job === jobId ? "Direct applicant" : "Linked by the team"} · {new Date(c.created_at).toLocaleDateString("en-GB")}</p>
      <div className="space-y-1 break-words text-sm"><p><a href={`tel:${c.phone}`} className="underline">{c.phone}</a></p>{c.email && <p><a href={`mailto:${c.email}`} className="underline">{c.email}</a></p>}<p>{c.sector} · {c.country_preference}</p></div>
      <p className="text-sm text-muted-foreground">{c.cv_path ? `CV attached: ${c.cv_filename ?? "document"}` : "CV not yet uploaded"}</p>
      <CandidateCvUpload id={c.id} hasCv={!!c.cv_path} />
      <Link to="/crm/candidates/$id" params={{ id: c.id }} className="inline-block text-sm font-semibold text-accent underline">View profile & CV →</Link>
    </article>)}</div>
    {applicants.isSuccess && !rows.length && <p className="glass-card p-6 text-sm text-muted-foreground">{applicants.data.length ? "No applicants match these filters." : "No applicants yet. Import a candidate list, link an existing candidate, or receive applications through the published job page."}</p>}
  </div>;
}