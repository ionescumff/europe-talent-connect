import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { submitVacancy } from "@/lib/submissions.functions";
import { Link } from "@tanstack/react-router";

const points = [
  "Placement fee agreed before candidate selection",
  "Fee payable after the agreed start and trial conditions are met",
  "Each shortlist reflects role, headcount, timing and working conditions",
];

export function VacancyForm() {
  const send = useServerFn(submitVacancy);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    try {
      await send({
        data: {
          company: String(fd.get("company") ?? ""),
          contactName: String(fd.get("contactName") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          country: String(fd.get("country") ?? "both") as "netherlands" | "germany" | "both",
          message: String(fd.get("message") ?? ""),
          privacyAccepted: fd.get("privacyAccepted") === "on",
        },
      });
      setDone(true);
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="employers" className="relative scroll-mt-24 px-6 pb-20 md:px-8 lg:px-14">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="glass-card rounded-[2rem] p-8 lg:p-10">
          <div className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent">
            For employers &amp; staffing agencies
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-4xl">
            Hiring in NL or DE? Share your vacancies.
          </h2>
          <p className="mt-4 text-sm text-brand/60">
            Tell us the role, headcount, start date, location, schedule, language and experience
            needs, pay, employment terms and housing. We confirm suitable profiles and availability.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-brand/80">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-[2rem] p-8 lg:p-10">
          {done ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <CheckCircle2 className="size-10 text-accent" />
              <div className="font-display text-xl font-bold">Brief received.</div>
              <p className="text-sm text-brand/60">
                We'll come back with suitable profiles and availability.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-brand/60">Company</span>
                  <input name="company" required className="field mt-1" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-brand/60">Contact name</span>
                  <input name="contactName" required className="field mt-1" />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-brand/60">Work email</span>
                  <input name="email" type="email" required className="field mt-1" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-brand/60">Phone (optional)</span>
                  <input name="phone" type="tel" className="field mt-1" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-semibold text-brand/60">Work location</span>
                <select name="country" className="field mt-1" defaultValue="netherlands">
                  <option value="netherlands">Netherlands</option>
                  <option value="germany">Germany</option>
                  <option value="both">Both</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-brand/60">Vacancy brief</span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  rows={4}
                  className="field mt-1 h-auto py-3"
                  placeholder="Role, headcount, start date, schedule, pay, housing…"
                />
              </label>
              <label className="flex items-start gap-3 text-xs leading-5 text-brand/60">
                <input name="privacyAccepted" type="checkbox" required className="mt-1 size-4 accent-brand" />
                <span>
                  I have read the <Link to="/privacy" className="font-semibold text-brand underline underline-offset-2">privacy notice</Link> and agree to be contacted about this enquiry.
                </span>
              </label>
              <button
                type="submit"
                disabled={busy}
                className="h-12 w-full rounded-xl bg-accent font-semibold text-accent-foreground shadow-accent transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send vacancy brief"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
