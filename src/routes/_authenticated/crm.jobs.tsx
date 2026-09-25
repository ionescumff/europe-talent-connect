import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyRoles, isAdminRole } from "@/lib/crm";
import { extractJobPosts, type JobDraft } from "@/lib/jobposts.functions";

export const Route = createFileRoute("/_authenticated/crm/jobs")({
  head: () => ({ meta: [{ title: "Job posts — CRM" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: JobsAdmin,
});

const SECTORS = ["Warehousing & fulfilment", "Production & food", "Logistics & site work", "Construction support"];

type Form = {
  id?: string; title: string; sector: string; country: string; city: string; salary: string;
  company_name: string; company_details: string; description: string; contract: string; schedule: string;
  start_date: string; housing: string; transport: string; language: string; openings: number;
  tasks: string; requirements: string; benefits: string; image_url: string; status: string; published: boolean;
};
const empty: Form = {
  title: "", sector: SECTORS[0] as string, country: "Netherlands", city: "", salary: "", company_name: "", company_details: "",
  description: "", contract: "", schedule: "", start_date: "", housing: "", transport: "", language: "", openings: 1,
  tasks: "", requirements: "", benefits: "", image_url: "", status: "open", published: true,
};
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const fromDraft = (d: JobDraft, image = ""): Form => ({
  ...empty, ...d, sector: SECTORS.includes(d.sector) ? d.sector : (SECTORS[0] as string), openings: d.openings || 1,
  tasks: d.tasks.join("\n"), requirements: d.requirements.join("\n"), benefits: d.benefits.join("\n"), image_url: image,
});
const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

function resizeImage(file: File, max = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function JobsAdmin() {
  const roles = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });
  if (!isAdminRole(roles.data)) {
    return <div className="glass-card mx-auto mt-10 max-w-lg p-8 text-center">Only co-founders and admins can manage job posts.</div>;
  }
  return <JobsManager />;
}

function JobsManager() {
  const qc = useQueryClient();
  const extract = useServerFn(extractJobPosts);
  const [form, setForm] = useState<Form>(empty);
  const [showForm, setShowForm] = useState(false);
  const [drafts, setDrafts] = useState<Form[]>([]);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const jobs = useQuery({
    queryKey: ["job-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
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
  const refresh = () => { qc.invalidateQueries({ queryKey: ["job-posts"] }); qc.invalidateQueries({ queryKey: ["job-links"] }); };

  async function saveForm(f: Form) {
    const { id, tasks, requirements, benefits, ...v } = f;
    if (!v.title || !v.city || !v.salary) throw new Error("Title, city and salary are required");
    const row = { ...v, tasks: lines(tasks), requirements: lines(requirements), benefits: lines(benefits), image_url: v.image_url || null };
    const { error } = id
      ? await supabase.from("job_posts").update(row).eq("id", id)
      : await supabase.from("job_posts").insert({ ...row, slug: `${slugify(`${v.title} ${v.city}`)}-${Math.random().toString(36).slice(2, 6)}` });
    if (error) throw error;
  }

  const save = useMutation({
    mutationFn: () => saveForm(form),
    onSuccess: () => { setForm(empty); setShowForm(false); refresh(); },
  });
  const accept = useMutation({
    mutationFn: async (i: number) => { await saveForm({ ...drafts[i]!, published: true }); return i; },
    onSuccess: (i) => { setDrafts((d) => d.filter((_, k) => k !== i)); refresh(); },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });
  const patch = useMutation({
    mutationFn: async ({ id, v }: { id: string; v: { published?: boolean; status?: string } }) => {
      const { error } = await supabase.from("job_posts").update(v).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
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

  async function handleImport(files: FileList | null) {
    if (!files?.length) return;
    setImporting(true); setImportError("");
    try {
      const images: string[] = [];
      let text = "";
      for (const f of Array.from(files)) {
        if (f.type.startsWith("image/")) images.push(await resizeImage(f));
        else if (/\.(xlsx|xls|csv)$/i.test(f.name)) {
          const wb = XLSX.read(await f.arrayBuffer());
          for (const name of wb.SheetNames) text += `\n# ${name}\n${XLSX.utils.sheet_to_csv(wb.Sheets[name]!)}`;
        }
      }
      if (!images.length && !text) throw new Error("Upload photos (JPG/PNG) or spreadsheets (XLSX/CSV)");
      const found = await extract({ data: { images: images.slice(0, 6), text: text || undefined } });
      if (!found.length) throw new Error("No job posts were found in those files");
      setDrafts((d) => [...d, ...found.map((j, i) => fromDraft(j, images.length === found.length ? images[i] : (images[0] ?? "")))]);
    } catch (e) {
      setImportError((e as Error).message);
    } finally { setImporting(false); }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Job posts</h1>
          <p className="text-sm text-muted-foreground">Import from photos or spreadsheets, check the preview, and publish it on the website.</p>
        </div>
        <button onClick={() => { setForm(empty); setShowForm(true); }} className="rounded-full border border-glass-border px-5 py-2 text-sm font-semibold">
          + Add manually
        </button>
      </div>

      {/* Import */}
      <section className="glass-card p-6">
        <h2 className="font-display text-lg font-bold">Import with AI</h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload photos of job ads (up to 6) or an Excel/CSV sheet with your vacancies. The AI reads them and prepares a preview for each job — nothing goes live until you accept it.</p>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-glass-border p-8 text-center text-sm hover:bg-glass">
          <span className="font-semibold">{importing ? "Reading your files…" : "Choose photos or spreadsheets"}</span>
          <span className="text-xs text-muted-foreground">JPG, PNG, XLSX, XLS, CSV</span>
          <input type="file" multiple accept="image/*,.xlsx,.xls,.csv" className="hidden" disabled={importing}
            onChange={(e) => { handleImport(e.target.files); e.target.value = ""; }} />
        </label>
        {importError && <p className="mt-3 text-sm text-destructive">{importError}</p>}
      </section>

      {/* AI previews */}
      {drafts.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold">Previews waiting for approval ({drafts.length})</h2>
          {drafts.map((d, i) => (
            <div key={i} className="glass-card p-5">
              <JobPreview f={d} />
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <button onClick={() => accept.mutate(i)} disabled={accept.isPending} className="rounded-full bg-accent px-5 py-2 font-semibold text-accent-foreground">Accept &amp; publish</button>
                <button onClick={() => { setForm(d); setShowForm(true); setDrafts((x) => x.filter((_, k) => k !== i)); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-full border border-glass-border px-5 py-2">Edit first</button>
                <ImagePicker onPick={(img) => setDrafts((x) => x.map((y, k) => (k === i ? { ...y, image_url: img } : y)))} label={d.image_url ? "Change image" : "Add image"} />
                <button onClick={() => setDrafts((x) => x.filter((_, k) => k !== i))} className="rounded-full border border-destructive px-5 py-2 text-destructive">Discard</button>
              </div>
              {accept.error && <p className="mt-2 text-sm text-destructive">{(accept.error as Error).message}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Manual form */}
      {showForm && (
        <section className="grid gap-6 lg:grid-cols-2">
          <JobForm form={form} setForm={setForm} onCancel={() => { setShowForm(false); setForm(empty); }}
            onSave={() => save.mutate()} pending={save.isPending} error={save.error ? (save.error as Error).message : ""} />
          <div className="glass-card h-fit p-5 lg:sticky lg:top-6">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Live preview</div>
            <JobPreview f={form} />
          </div>
        </section>
      )}

      {/* List */}
      <section className="glass-card overflow-x-auto p-2">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-3"></th><th className="p-3">Job</th><th className="p-3">Company</th><th className="p-3">Location</th><th className="p-3">Salary</th><th className="p-3">Website</th><th className="p-3">Candidates</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {jobs.data?.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No job posts yet — import some or add one manually.</td></tr>}
            {jobs.data?.map((j) => {
              const linked = new Set(links.data?.filter((l) => l.job_id === j.id).map((l) => l.candidate_id));
              const open = openId === j.id;
              return [
                <tr key={j.id} className="border-t border-glass-border align-middle">
                  <td className="p-3">{j.image_url ? <img src={j.image_url} alt="" className="size-12 rounded-lg object-cover" /> : <div className="size-12 rounded-lg bg-glass" />}</td>
                  <td className="p-3"><div className="font-semibold">{j.title}</div><div className="text-xs text-muted-foreground">{j.sector}</div></td>
                  <td className="p-3">{j.company_name || "—"}</td>
                  <td className="p-3">{j.city}, {j.country}</td>
                  <td className="p-3">{j.salary}</td>
                  <td className="p-3">
                    <button onClick={() => patch.mutate({ id: j.id, v: { published: !j.published } })}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${j.published && j.status === "open" ? "bg-accent/20 text-accent" : "bg-glass text-muted-foreground"}`}>
                      {j.published ? (j.status === "open" ? "Live" : "Closed") : "Hidden"}
                    </button>
                    {j.published && j.slug && j.status === "open" && <a href={`/jobs/${j.slug}`} target="_blank" rel="noreferrer" className="ml-2 text-xs underline">View</a>}
                  </td>
                  <td className="p-3"><button onClick={() => setOpenId(open ? null : j.id)} className="underline">{linked.size} linked</button></td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => patch.mutate({ id: j.id, v: { status: j.status === "open" ? "closed" : "open" } })} className="rounded-full border border-glass-border px-3 py-1">{j.status === "open" ? "Close" : "Reopen"}</button>
                      <button onClick={() => { setForm({ ...empty, ...j, id: j.id, company_name: j.company_name ?? "", company_details: j.company_details ?? "", description: j.description ?? "", contract: j.contract ?? "", schedule: j.schedule ?? "", start_date: j.start_date ?? "", housing: j.housing ?? "", transport: j.transport ?? "", language: j.language ?? "", image_url: j.image_url ?? "", tasks: j.tasks.join("\n"), requirements: j.requirements.join("\n"), benefits: j.benefits.join("\n") }); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-full border border-glass-border px-3 py-1">Edit</button>
                      <button onClick={() => confirm(`Delete "${j.title}"?`) && remove.mutate(j.id)} className="rounded-full border border-destructive px-3 py-1 text-destructive">Delete</button>
                    </div>
                  </td>
                </tr>,
                open && (
                  <tr key={`${j.id}-c`}><td colSpan={8} className="p-3">
                    <ul className="max-h-72 divide-y divide-glass-border overflow-auto rounded-xl bg-glass px-3">
                      {[...(candidates.data ?? [])].sort((a, b) => Number(linked.has(b.id)) - Number(linked.has(a.id)) || Number(b.sector === j.sector) - Number(a.sector === j.sector)).map((c) => (
                        <li key={c.id} className="flex items-center justify-between gap-2 py-2">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={linked.has(c.id)} onChange={() => toggleLink.mutate({ job: j.id, cand: c.id, linked: linked.has(c.id) })} />
                            <span>{c.full_name}</span><span className="text-muted-foreground">· {c.sector} · {c.status}</span>
                          </label>
                          <Link to="/crm/candidates/$id" params={{ id: c.id }} className="text-xs underline">Profile</Link>
                        </li>
                      ))}
                    </ul>
                  </td></tr>
                ),
              ];
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function ImagePicker({ onPick, label }: { onPick: (img: string) => void; label: string }) {
  return (
    <label className="cursor-pointer rounded-full border border-glass-border px-5 py-2">
      {label}
      <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) onPick(await resizeImage(f)); e.target.value = ""; }} />
    </label>
  );
}

function JobForm({ form, setForm, onSave, onCancel, pending, error }: {
  form: Form; setForm: (f: Form) => void; onSave: () => void; onCancel: () => void; pending: boolean; error: string;
}) {
  const input = "field w-full rounded-xl px-3 py-2 text-sm";
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });
  const L = ({ t, children }: { t: string; children: React.ReactNode }) => (
    <label className="block text-xs font-semibold text-muted-foreground">{t}<div className="mt-1">{children}</div></label>
  );
  return (
    <form className="glass-card space-y-3 p-6" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <h2 className="font-display text-lg font-bold">{form.id ? "Edit job post" : "New job post"}</h2>
      <L t="Job title *"><input className={input} value={form.title} onChange={set("title")} /></L>
      <div className="grid grid-cols-2 gap-3">
        <L t="Sector"><select className={input} value={form.sector} onChange={set("sector")}>{SECTORS.map((s) => <option key={s}>{s}</option>)}</select></L>
        <L t="Openings"><input type="number" min={1} className={input} value={form.openings} onChange={(e) => setForm({ ...form, openings: Math.max(1, Number(e.target.value) || 1) })} /></L>
        <L t="Country"><select className={input} value={form.country} onChange={set("country")}><option>Netherlands</option><option>Germany</option></select></L>
        <L t="City *"><input className={input} value={form.city} onChange={set("city")} /></L>
      </div>
      <L t="Salary *"><input className={input} placeholder="€14.50 gross / hour" value={form.salary} onChange={set("salary")} /></L>
      <div className="grid grid-cols-2 gap-3">
        <L t="Company name"><input className={input} value={form.company_name} onChange={set("company_name")} /></L>
        <L t="Contract type"><input className={input} placeholder="Temporary, 6 months" value={form.contract} onChange={set("contract")} /></L>
        <L t="Schedule / shifts"><input className={input} placeholder="Two shifts, 40h/week" value={form.schedule} onChange={set("schedule")} /></L>
        <L t="Start date"><input className={input} placeholder="Within 2 weeks" value={form.start_date} onChange={set("start_date")} /></L>
        <L t="Housing"><input className={input} value={form.housing} onChange={set("housing")} /></L>
        <L t="Transport"><input className={input} value={form.transport} onChange={set("transport")} /></L>
        <L t="Language"><input className={input} placeholder="Basic English" value={form.language} onChange={set("language")} /></L>
        <L t="Image"><div className="flex items-center gap-2 text-sm">
          <ImagePicker label={form.image_url ? "Change" : "Upload"} onPick={(img) => setForm({ ...form, image_url: img })} />
          {form.image_url && <button type="button" onClick={() => setForm({ ...form, image_url: "" })} className="text-xs underline">Remove</button>}
        </div></L>
      </div>
      <L t="About the company"><textarea className={input} rows={2} value={form.company_details} onChange={set("company_details")} /></L>
      <L t="Short summary"><textarea className={input} rows={2} value={form.description} onChange={set("description")} /></L>
      <L t="Tasks (one per line)"><textarea className={input} rows={3} value={form.tasks} onChange={set("tasks")} /></L>
      <L t="Requirements (one per line)"><textarea className={input} rows={3} value={form.requirements} onChange={set("requirements")} /></L>
      <L t="What we offer (one per line)"><textarea className={input} rows={3} value={form.benefits} onChange={set("benefits")} /></L>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Show on the website</label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground" disabled={pending}>{form.id ? "Save changes" : "Create job post"}</button>
        <button type="button" onClick={onCancel} className="rounded-full border border-glass-border px-5 py-2 text-sm">Cancel</button>
      </div>
    </form>
  );
}

function JobPreview({ f }: { f: Form }) {
  const facts = [["Employer", f.company_name], ["Location", f.city && `${f.city}, ${f.country}`], ["Pay", f.salary], ["Contract", f.contract], ["Schedule", f.schedule], ["Start", f.start_date], ["Housing", f.housing], ["Transport", f.transport], ["Language", f.language], ["Openings", String(f.openings)]].filter(([, v]) => v);
  const list = (t: string, s: string) => lines(s).length > 0 && (
    <div><h4 className="font-display text-sm font-bold">{t}</h4><ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">{lines(s).map((x) => <li key={x}>{x}</li>)}</ul></div>
  );
  return (
    <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
      <div className="space-y-3">
        {f.image_url && <img src={f.image_url} alt="" className="max-h-56 w-full rounded-2xl object-cover" />}
        <div className="flex gap-2 text-xs"><span className="rounded-full bg-accent/15 px-2 py-0.5 font-bold text-accent">{f.sector}</span><span className="rounded-full bg-glass px-2 py-0.5 font-bold">{f.country}</span></div>
        <h3 className="font-display text-xl font-bold">{f.title || "Job title"}{f.city && ` — ${f.city}`}</h3>
        {f.description && <p className="text-sm text-muted-foreground">{f.description}</p>}
        {f.company_details && <div><h4 className="font-display text-sm font-bold">About {f.company_name || "the company"}</h4><p className="text-sm text-muted-foreground">{f.company_details}</p></div>}
        {list("What you'll do", f.tasks)}
        {list("What you need", f.requirements)}
        {list("What we offer", f.benefits)}
      </div>
      <dl className="h-fit space-y-2 rounded-2xl bg-glass p-4 text-sm">
        {facts.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}
      </dl>
    </div>
  );
}
