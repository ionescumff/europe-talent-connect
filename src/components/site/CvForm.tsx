import { useEffect, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2, Paperclip } from "lucide-react";
import { submitCv } from "@/lib/submissions.functions";
import { sectors } from "./Sectors";
import { getJob, type Job } from "@/lib/jobs";
import { Link } from "@tanstack/react-router";

export function CvForm() {
  const send = useServerFn(submitCv);
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("job");
    const j = slug ? getJob(slug) : undefined;
    if (j) setJob(j);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!fileName) {
      toast.error("Please attach your CV (PDF or Word).");
      return;
    }
    setBusy(true);
    try {
      await send({ data });
      setDone(true);
      form.reset();
      setFileName(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="cv" className="relative scroll-mt-24 px-6 pb-20 md:px-8 lg:px-14">
      <div className="glass-card grid items-center gap-10 rounded-[2rem] p-8 lg:grid-cols-[1.2fr_1fr] lg:p-12">
        <div>
          <div className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent">
            For candidates · Pentru candidați
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-4xl">
            Ready to work in the Netherlands or Germany? Leave your CV — we'll call you.
          </h2>
          <p className="mt-4 max-w-md text-sm text-brand/60">
            Free for candidates, always. Housing details are confirmed in the job brief before you
            commit. Lasă-ți CV-ul și te contactăm noi.
          </p>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-glass p-8 text-center">
            <CheckCircle2 className="size-10 text-accent" />
            <div className="font-display text-xl font-bold">CV received. Mulțumim!</div>
            <p className="text-sm text-brand/60">
              Our team will review your profile and contact you about matching vacancies.
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-2 text-sm font-semibold text-brand underline-offset-4 hover:underline"
            >
              Send another CV
            </button>
          </div>
        ) : (
          <form key={job?.slug ?? "general"} ref={formRef} onSubmit={onSubmit} className="space-y-4">
            {job && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-accent/10 px-4 py-3 text-sm">
                <span>
                  Applying for <strong>{job.title}</strong> · {job.city}
                </span>
                <button type="button" onClick={() => setJob(null)} className="text-xs font-semibold underline">
                  Remove
                </button>
                <input type="hidden" name="appliedJob" value={job.slug} />
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-brand/60">Full name</span>
                <input name="fullName" required minLength={2} className="field mt-1" placeholder="Ana Popescu" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-brand/60">Phone</span>
                <input name="phone" required type="tel" className="field mt-1" placeholder="+40 7xx xxx xxx" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-semibold text-brand/60">Email (optional)</span>
              <input name="email" type="email" className="field mt-1" placeholder="ana@email.ro" />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-brand/60">Preferred sector</span>
                <select name="sector" required className="field mt-1" defaultValue={job?.sector ?? "Warehousing & fulfilment"}>
                  {sectors.map((s) => (
                    <option key={s.n} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Other / skilled role">Other / skilled role</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-brand/60">Country</span>
                <select name="country" required className="field mt-1" defaultValue={job ? job.country.toLowerCase() : "both"}>
                  <option value="netherlands">Netherlands</option>
                  <option value="germany">Germany</option>
                  <option value="both">Both NL &amp; DE</option>
                </select>
              </label>
            </div>
            <label className="grid h-12 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-accent/50 bg-accent/5 text-xs font-semibold text-brand/60 transition-colors hover:bg-accent/10">
              <span className="flex items-center gap-2">
                <Paperclip className="size-4" />
                {fileName ?? "Attach CV (PDF / DOCX, max 8 MB)"}
              </span>
              <input
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
            <label className="flex items-start gap-3 text-xs leading-5 text-brand/60">
              <input name="privacyAccepted" type="checkbox" required className="mt-1 size-4 accent-brand" />
              <span>
                I have read the <Link to="/privacy" className="font-semibold text-brand underline underline-offset-2">privacy notice</Link> and understand how my details and CV will be used for recruitment.
              </span>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="h-12 w-full rounded-xl bg-brand font-semibold text-brand-foreground shadow-brand transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? "Sending…" : "Submit my CV"}
            </button>
            <p className="text-center text-xs text-brand/50">
              No fee, ever, for candidates. Your CV is only shared with employers for confirmed vacancies.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
