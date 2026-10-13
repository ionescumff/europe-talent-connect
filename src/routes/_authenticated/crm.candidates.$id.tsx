import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CANDIDATE_STATUSES, fetchTeam, memberName } from "@/lib/crm";
import { matchCandidate, type MatchResult } from "@/lib/match.functions";
import { getJob, suggestedJobs } from "@/lib/jobs";
import { CandidateCvUpload } from "@/components/crm/CandidateCvUpload";

export const Route = createFileRoute("/_authenticated/crm/candidates/$id")({
  component: CandidateDetail,
});

function CandidateDetail() {
  const { id } = Route.useParams();
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const match = useServerFn(matchCandidate);
  const [note, setNote] = useState("");
  const [kind, setKind] = useState("note");
  const [result, setResult] = useState<MatchResult | null>(null);
  const team = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const editable = useQuery({ queryKey: ["candidate-editable", id], queryFn: async () => {
    const { data, error } = await supabase.rpc("can_edit_candidate", { _user_id: user.id, _candidate: id });
    if (error) throw error;
    return data;
  } });

  const cand = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("cv_submissions").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });
  const notes = useQuery({
    queryKey: ["notes", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_notes").select("*").eq("candidate_id", id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async (patch: { status?: string; next_follow_up?: string | null }) => {
      const { error } = await supabase.from("cv_submissions").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["candidate", id] });
      qc.invalidateQueries({ queryKey: ["candidates"] });
      toast.success("Saved");
    },
    onError: () => toast.error("You can only edit candidates assigned to you"),
  });

  const addNote = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("candidate_notes").insert({
        candidate_id: id, body: note.trim(), kind, author_id: user.id, author_email: user.email ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNote("");
      qc.invalidateQueries({ queryKey: ["notes", id] });
    },
    onError: () => toast.error("Could not add note"),
  });

  const runMatch = useMutation({
    mutationFn: () => match({ data: { id } }),
    onSuccess: setResult,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Matching failed"),
  });

  async function openCv() {
    if (!cand.data?.cv_path) return;
    const { data, error } = await supabase.storage.from("cvs").createSignedUrl(cand.data.cv_path, 300);
    if (error || !data) { toast.error("Could not open CV"); return; }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  if (cand.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!cand.data) return <p>Candidate not found. <Link to="/crm" className="underline">Back</Link></p>;
  const c = cand.data;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6">
        <Link to="/crm" className="text-sm text-muted-foreground hover:text-accent">← All candidates</Link>
        <section className="glass-card space-y-4 p-6">
          <h1 className="font-display text-2xl font-bold">{c.full_name}</h1>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Item k="Phone" v={<a href={`tel:${c.phone}`} className="underline">{c.phone}</a>} />
            <Item k="Email" v={c.email ? <a href={`mailto:${c.email}`} className="underline">{c.email}</a> : "—"} />
            <Item k="Sector" v={c.sector} />
            <Item k="Country" v={<span className="capitalize">{c.country_preference}</span>} />
            <Item k="Applied for" v={c.applied_job ? (getJob(c.applied_job) ? <Link to="/jobs/$slug" params={{ slug: c.applied_job }} target="_blank" className="underline">{getJob(c.applied_job)!.title}</Link> : c.applied_job) : "Open CV (no specific job)"} />
            <Item k="Received" v={new Date(c.created_at).toLocaleString("en-GB")} />
            <Item k="Assigned to" v={memberName(team.data, c.assigned_to)} />
            <Item k="CV" v={c.cv_path ? <button onClick={openCv} className="font-semibold text-accent underline">{c.cv_filename ?? "Open"}</button> : "—"} />
          </dl>
          {editable.data && <CandidateCvUpload id={id} hasCv={!!c.cv_path} />}
          {c.message && <p className="rounded-xl bg-glass p-3 text-sm">{c.message}</p>}
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Status
              <select value={c.status} onChange={(e) => update.mutate({ status: e.target.value })} className="field mt-1 w-full normal-case">
                {CANDIDATE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Next follow-up
              <input
                type="date"
                value={c.next_follow_up ?? ""}
                onChange={(e) => update.mutate({ next_follow_up: e.target.value || null })}
                className="field mt-1 w-full"
              />
            </label>
          </div>
        </section>

        <section className="glass-card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold">Notes & contact history</h2>
          <form
            onSubmit={(e) => { e.preventDefault(); if (note.trim()) addNote.mutate(); }}
            className="space-y-2"
          >
            <div className="flex gap-2">
              <select value={kind} onChange={(e) => setKind(e.target.value)} className="field">
                <option value="note">Note</option>
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="meeting">Meeting</option>
              </select>
              <button disabled={addNote.isPending} className="rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground">Add</button>
            </div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="What happened? Next steps?" className="field w-full" />
          </form>
          <ul className="space-y-3">
            {notes.data?.map((n) => (
              <li key={n.id} className="rounded-xl bg-glass p-3 text-sm">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span className="font-semibold uppercase">{n.kind}</span>
                  <span>{n.author_email} · {new Date(n.created_at).toLocaleString("en-GB")}</span>
                </div>
                <p className="whitespace-pre-wrap">{n.body}</p>
              </li>
            ))}
            {notes.data?.length === 0 && <li className="text-sm text-muted-foreground">No notes yet.</li>}
          </ul>
        </section>
      </div>

      <div className="space-y-6 lg:mt-9">
      <section className="glass-card space-y-4 p-6">
        <div>
          <h2 className="font-display text-lg font-bold">Suggested vacancies</h2>
          <p className="text-sm text-muted-foreground">Based on the sector, country and job chosen in their CV form.</p>
        </div>
        <ul className="space-y-2">
          {suggestedJobs(c).map(({ job, score }) => (
            <li key={job.slug} className="flex items-center justify-between gap-3 rounded-xl border border-glass-border p-3 text-sm">
              <div>
                <Link to="/jobs/$slug" params={{ slug: job.slug }} target="_blank" className="font-semibold hover:text-accent">
                  {job.title} · {job.city}, {job.country}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {job.pay} · {job.openings} openings{job.slug === c.applied_job ? " · Applied for this" : ""}
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-glass-strong px-3 py-1 text-xs font-bold">{score}%</span>
            </li>
          ))}
          {suggestedJobs(c).length === 0 && <li className="text-sm text-muted-foreground">No open jobs match this profile yet — try "Find best jobs" below.</li>}
        </ul>
      </section>
      <section className="glass-card h-fit space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold">Best job matches</h2>
            <p className="text-sm text-muted-foreground">AI reads the CV (PDF) and profile and ranks the open jobs.</p>
          </div>
          <button
            onClick={() => runMatch.mutate()}
            disabled={runMatch.isPending}
            className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-accent disabled:opacity-60"
          >
            {runMatch.isPending ? "Analysing…" : result ? "Re-run" : "Find best jobs"}
          </button>
        </div>
        {result && (
          <>
            <p className="rounded-xl bg-glass p-3 text-sm">{result.summary}</p>
            <ol className="space-y-3">
              {result.matches.map((m) => {
                const job = getJob(m.slug);
                if (!job) return null;
                return (
                  <li key={m.slug} className="rounded-xl border border-glass-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Link to="/jobs/$slug" params={{ slug: m.slug }} target="_blank" className="font-semibold hover:text-accent">
                        {job.title} · {job.city}, {job.country}
                      </Link>
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">{Math.round(m.score)}%</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{m.reason}</p>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </section>
      </div>
    </div>
  );
}

function Item({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-muted-foreground">{k}</dt>
      <dd className="mt-0.5 break-words">{v}</dd>
    </div>
  );
}
