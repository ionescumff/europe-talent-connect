import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { submitCv } from "@/lib/submissions.functions";
import { useLang } from "@/lib/i18n";
import type { Job } from "@/lib/jobs";

const sectorMap: Record<string, string> = { Logistics: "logistics", Warehousing: "warehousing", Manufacturing: "production", Production: "production", Construction: "construction" };

export function JobApplyForm({ job }: { job: Pick<Job, "slug" | "title" | "sector" | "country"> }) {
  const { t } = useLang();
  const send = useServerFn(submitCv);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (done) return <div role="status" className="rounded-xl bg-accent/10 p-5 text-sm leading-6">
    <p className="font-semibold">{t("Application received.", "Aplicația a fost trimisă.")}</p>
    <p className="mt-1 text-brand/70">{t("Our team will review your details and contact you about this job. Applying is free.", "Echipa noastră îți va analiza datele și te va contacta pentru acest post. Aplicarea este gratuită.")}</p>
  </div>;

  return <form id="apply" className="space-y-3" onSubmit={async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("cv");
    if (!(file instanceof File) || file.size === 0) { toast.error(t("Please attach your CV (PDF or Word).", "Te rugăm să atașezi CV-ul (PDF sau Word).")); return; }
    fd.set("sector", sectorMap[job.sector] ?? job.sector.toLowerCase());
    fd.set("country", job.country === "Germany" ? "germany" : "netherlands");
    fd.set("appliedJob", job.slug);
    setBusy(true);
    try { await send({ data: fd }); setDone(true); }
    catch (err) { toast.error(err instanceof Error ? err.message : t("Something went wrong. Please try again.", "Ceva nu a mers bine. Te rugăm să încerci din nou.")); }
    finally { setBusy(false); }
  }}>
    <h2 className="font-display text-lg font-bold">{t("Apply for this job", "Aplică pentru acest post")}</h2>
    <label className="block text-sm">{t("Full name", "Nume complet")}<input name="fullName" required minLength={2} maxLength={120} autoComplete="name" className="field mt-1" /></label>
    <label className="block text-sm">{t("Phone / WhatsApp", "Telefon / WhatsApp")}<input name="phone" type="tel" required minLength={6} maxLength={40} autoComplete="tel" className="field mt-1" /></label>
    <label className="block text-sm">{t("Email (optional)", "Email (opțional)")}<input name="email" type="email" maxLength={160} autoComplete="email" className="field mt-1" /></label>
    <label className="block text-sm">{t("Message (optional)", "Mesaj (opțional)")}<textarea name="message" maxLength={1000} rows={3} className="field mt-1" /></label>
    <label className="block text-sm">{t("CV (PDF or Word, max 8 MB)", "CV (PDF sau Word, max. 8 MB)")}<input name="cv" type="file" required accept=".pdf,.doc,.docx" className="mt-1 block w-full text-sm" /></label>
    <label className="flex gap-3 text-xs leading-5 text-brand/70"><input name="privacyAccepted" type="checkbox" required className="mt-1 size-4 shrink-0 accent-brand" />
      <span>{t("I agree that my details are used to assess my application, as described in the ", "Sunt de acord ca datele mele să fie folosite pentru evaluarea aplicației, conform ")}<Link to="/privacy" className="underline">{t("privacy notice", "politicii de confidențialitate")}</Link>.</span></label>
    <button type="submit" disabled={busy} className="block w-full rounded-xl bg-accent px-6 py-3.5 text-center text-sm font-semibold text-accent-foreground shadow-accent disabled:opacity-60">
      {busy ? t("Sending…", "Se trimite…") : t("Send application", "Trimite aplicația")}
    </button>
    <p className="text-center text-xs text-brand/50">{t("Free for candidates. No fee is ever charged.", "Gratuit pentru candidați. Nu percepem nicio taxă.")}</p>
  </form>;
}
