import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyRoles, isAdminRole } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/crm/jobs")({
  head: () => ({ meta: [{ title: "Job posts — CRM" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: JobsAdmin,
});

type JobPost = {
  id: string; title: string; sector: string; country: string; city: string;
  salary: string; description: string | null; status: string;
};
const SECTORS = ["Warehousing & fulfilment", "Production & food", "Logistics & site work", "Construction support"];
const empty = { title: "", sector: SECTORS[0], country: "Netherlands", city: "", salary: "", description: "", status: "open" };

function JobsAdmin() {
  const roles = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  if (!isAdminRole(roles.data)) {
    return <div className="glass-card mx-auto mt-10 max-w-lg p-8 text-center">Only co-founders and admins can manage job posts.</div>;
  }
  return <JobsManager />;
}

function JobsManager() {
  const qc = useQueryClient();
  const [form, setForm] = useState<typeof empty & { id?: string }>(empty);
  const [openId, setOpenId] = useState<string | null>(null);

  const jobs = useQuery({
    queryKey: ["job-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as JobPost[];
    },
  });
  const links = useQuery({
    queryKey: ["job-links"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_post_candidates").select("job_id, candidate_id");
      if (error) throw error;
      return data;
    },
  });
  const candidates = useQuery({
    queryKey: ["candidates-lite"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cv_submissions").select("id, full_name, sector, status").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const { id, ...v } = form;
      if (!v.title || !v.city || !v.salary) throw new Error("Title, city and salary are required");
      const { error } = id
        ? await supabase.from("job_posts").update(v).eq("id", id)
        : await supabase.from("job_posts").insert(v);
      if (error) throw error;
    },
    onSuccess: () => { setForm(empty); qc.invalidateQueries({ queryKey: ["job-posts"] }); },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["job-posts"] }); qc.invalidateQueries({ queryKey: ["job-links"] }); },
  });
  const toggleLink = useMutation({
    mutationFn: async ({ job, cand, linked }: { job: string; cand: string; linked: boolean }) => {
      const { error } = linked
        ? await supabase.from("job_post_candidates").delete().eq("job_id", job).eq("candidate_id", cand)
        : await supabase.from("job_post_candidates").insert({ job_id: job, candidate_id: cand });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-links"] }),
  });

  const input = "field w-full rounded-xl px-3 py-2 text-sm";
  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form className="glass-card h-fit space-y-3 p-6" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
        <h2 className="font-display text-lg font-bold">{form.id ? "Edit job post" : "New job post"}</h2>
        <input className={input} placeholder="Job title" value={form.title} onChange={set("title")} />
        <select className={input} value={form.sector} onChange={set("sector")}>
          {SECTORS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <select className={input} value={form.country} onChange={set("country")}>
            <option>Netherlands</option><option>Germany</option>
          </select>
          <input className={input} placeholder="City" value={form.city} onChange={set("city")} />
        </div>
        <input className={input} placeholder="Salary, e.g. €14.50 gross / hour" value={form.salary} onChange={set("salary")} />
        <textarea className={input} rows={4} placeholder="Description (optional)" value={form.description} onChange={set("description")} />
        <select className={input} value={form.status} onChange={set("status")}>
          <option value="open">Open</option><option value="closed">Closed</option>
        </select>
        {save.error && <p className="text-sm text-destructive">{(save.error as Error).message}</p>}
        <div className="flex gap-2">
          <button className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground" disabled={save.isPending}>
            {form.id ? "Save changes" : "Create"}
          </button>
          {form.id && <button type="button" onClick={() => setForm(empty)} className="rounded-full border border-glass-border px-5 py-2 text-sm">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        {jobs.data?.length === 0 && <p className="text-muted-foreground">No job posts yet.</p>}
        {jobs.data?.map((j) => {
          const linked = new Set(links.data?.filter((l) => l.job_id === j.id).map((l) => l.candidate_id));
          const open = openId === j.id;
          return (
            <div key={j.id} className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold">{j.title} <span className="ml-2 rounded-full bg-glass px-2 py-0.5 text-xs font-medium">{j.status}</span></h3>
                  <p className="text-sm text-muted-foreground">{j.sector} · {j.city}, {j.country} · {j.salary}</p>
                  <p className="mt-1 text-sm">{linked.size} linked candidate{linked.size === 1 ? "" : "s"}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => setOpenId(open ? null : j.id)} className="rounded-full border border-glass-border px-3 py-1">{open ? "Hide" : "Link candidates"}</button>
                  <button onClick={() => setForm({ ...j, description: j.description ?? "" })} className="rounded-full border border-glass-border px-3 py-1">Edit</button>
                  <button onClick={() => confirm(`Delete "${j.title}"?`) && remove.mutate(j.id)} className="rounded-full border border-destructive px-3 py-1 text-destructive">Delete</button>
                </div>
              </div>
              {open && (
                <ul className="mt-4 max-h-80 divide-y divide-glass-border overflow-auto text-sm">
                  {[...(candidates.data ?? [])].sort((a, b) => Number(linked.has(b.id)) - Number(linked.has(a.id)) || Number(b.sector === j.sector) - Number(a.sector === j.sector)).map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-2 py-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={linked.has(c.id)} onChange={() => toggleLink.mutate({ job: j.id, cand: c.id, linked: linked.has(c.id) })} />
                        <span>{c.full_name}</span>
                        <span className="text-muted-foreground">· {c.sector} · {c.status}</span>
                      </label>
                      <Link to="/crm/candidates/$id" params={{ id: c.id }} className="text-xs underline">Profile</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
