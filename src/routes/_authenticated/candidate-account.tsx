import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, ArrowUpRight, Check, FileText, LogOut, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { LangSwitch, useLang } from "@/lib/i18n";
import { getCandidatePortal, saveCandidateProfile } from "@/lib/candidate-portal.functions";
import { applicationProgress, applicationStages, statusLabels } from "@/lib/candidate-portal";

export const Route = createFileRoute("/_authenticated/candidate-account")({
  head: () => ({ meta: [
    { title: "My applications — IONMAN Workforce" },
    { name: "description", content: "Your private candidate profile, application status and editable CV templates." },
    { property: "og:title", content: "My applications — IONMAN Workforce" },
    { property: "og:description", content: "Follow your next opportunity with IONMAN Workforce." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }), component: CandidateAccount,
});

function CandidateAccount() {
  const { user } = Route.useRouteContext();
  const { t, lang } = useLang();
  const qc = useQueryClient(); const navigate = useNavigate();
  const fetchPortal = useServerFn(getCandidatePortal); const saveProfile = useServerFn(saveCandidateProfile);
  const portal = useQuery({ queryKey: ["candidate-portal", user.id], queryFn: () => fetchPortal(), refetchInterval: 30000 });
  const save = useMutation({ mutationFn: (data: { full_name: string; phone: string }) => saveProfile({ data }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ["candidate-portal"] }); toast.success(t("Profile saved", "Profil salvat")); },
    onError: () => toast.error(t("Couldn't save your profile. Try again.", "Profilul nu a putut fi salvat. Încearcă din nou.")),
  });
  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    const { error } = await supabase.auth.signOut();
    if (error) { toast.error(t("Couldn't sign out. Try again.", "Nu te-ai putut deconecta. Încearcă din nou.")); return; }
    await navigate({ to: "/candidate-portal", replace: true });
  }
  const data = portal.data;
  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6"><Logo /><div className="flex items-center gap-3"><LangSwitch /><Button variant="outline" onClick={signOut}><LogOut />{t("Sign out", "Deconectare")}</Button></div></div></header>
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-8">
        <div><p className="text-sm text-muted-foreground">{t("CANDIDATE ACCOUNT", "CONT DE CANDIDAT")}</p><h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{t("Your next opportunity", "Următoarea ta oportunitate")}</h1><p className="mt-3 break-all text-sm text-muted-foreground">{user.email}</p></div>
        <Button asChild variant="outline"><Link to="/jobs">{t("Browse jobs", "Vezi posturile")}<ArrowUpRight /></Link></Button>
      </div>
      <div className="grid min-w-0 gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0"><div className="mb-6 flex items-center gap-3"><FileText className="size-5" /><h2 className="font-display text-xl font-bold">{t("My applications", "Candidaturile mele")}</h2>{data && <span className="text-sm text-muted-foreground">({data.applications.length})</span>}</div>
          {portal.isPending && <p role="status">{t("Loading your applications…", "Se încarcă candidaturile…")}</p>}
          {portal.isError && <div role="alert"><p>{t("Couldn't load your applications. Make sure your email is confirmed.", "Candidaturile nu au putut fi încărcate. Asigură-te că emailul este confirmat.")}</p><Button variant="outline" onClick={() => portal.refetch()} className="mt-4">{t("Try again", "Încearcă din nou")}</Button></div>}
          {data?.applications.length === 0 && <div className="border-y border-border py-10"><h3 className="font-display text-lg font-semibold">{t("No applications yet", "Nicio candidatură încă")}</h3><p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{t("Applications submitted with your confirmed email appear here. If you applied with a different address, contact our team.", "Candidaturile trimise cu emailul tău confirmat apar aici. Dacă ai aplicat cu altă adresă, contactează echipa noastră.")}</p><Button asChild className="mt-6"><a href="/#cv">{t("Leave your CV", "Lasă-ți CV-ul")}<ArrowUpRight /></a></Button></div>}
          <div className="space-y-5">{data?.applications.map((app) => {
            const labels = statusLabels[app.status]; const stage = applicationProgress(app.status);
            return <article key={app.id} className="min-w-0 rounded-lg border border-border bg-card p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs text-muted-foreground">{new Date(app.created_at).toLocaleDateString(lang === "ro" ? "ro-RO" : "en-GB")}</p><h3 className="mt-2 break-words font-display text-lg font-semibold">{app.jobs.length ? app.jobs.map(j => j.title).join(" · ") : t("General application", "Candidatură generală")}</h3><p className="mt-2 break-words text-sm text-muted-foreground">{app.jobs.length ? app.jobs.map(j => `${j.city}, ${j.country}`).join(" · ") : `${app.sector} · ${app.country_preference === "both" ? t("Netherlands & Germany", "Olanda și Germania") : app.country_preference === "germany" ? t("Germany", "Germania") : t("Netherlands", "Olanda")}`}</p></div><span className="rounded-md bg-muted px-3 py-2 text-sm font-semibold">{labels ? t(...labels) : t("Under review", "În curs de evaluare")}</span></div>
              {app.status !== "rejected" && <ol className="mt-6 grid grid-cols-5 gap-1 border-t border-border pt-5" aria-label={t("Application progress", "Progresul candidaturii")}>{applicationStages.map((value, index) => <li key={value} className="min-w-0 text-center"><span className={`mx-auto grid size-7 place-items-center rounded-full ${index <= stage ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{index < stage ? <Check className="size-4" /> : index + 1}</span><span className="mt-2 block break-words text-[10px] leading-4 sm:text-xs">{t(statusLabels[value]?.[0] ?? value, statusLabels[value]?.[1] ?? value)}</span></li>)}</ol>}
            </article>;
          })}</div>
          <p className="mt-7 text-sm text-muted-foreground"><a href="mailto:contact@vreaujobs.eu" className="underline">{t("Questions? Contact our team", "Ai întrebări? Contactează echipa")}</a></p>
        </section>
        <aside className="min-w-0 space-y-10 lg:border-l lg:border-border lg:pl-8">
          <section><div className="flex items-center gap-3"><UserRound className="size-5" /><h2 className="font-display text-xl font-bold">{t("My profile", "Profilul meu")}</h2></div>{data && <form key={`${data.profile?.full_name}-${data.profile?.phone}`} className="mt-5 space-y-4" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); save.mutate({ full_name: String(f.get("full_name")), phone: String(f.get("phone")) }); }}>
            <label className="block text-sm">{t("Full name", "Nume complet")}<input name="full_name" autoComplete="name" required minLength={2} maxLength={120} defaultValue={data.profile?.full_name ?? ""} className="field mt-2 w-full" /></label>
            <label className="block text-sm">{t("Phone", "Telefon")}<input name="phone" type="tel" autoComplete="tel" maxLength={40} defaultValue={data.profile?.phone ?? ""} className="field mt-2 w-full" /></label>
            <Button type="submit" variant="outline" disabled={save.isPending}><Save />{save.isPending ? t("Saving…", "Se salvează…") : t("Save profile", "Salvează profilul")}</Button>
          </form>}</section>
          <section className="border-t border-border pt-8"><FileText className="mb-4 size-8 text-primary" /><h2 className="font-display text-xl font-bold">{t("CV template", "Model de CV")}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{t("A fresh start, on paper.", "Un nou început, pe hârtie.")}</p><div className="mt-5 flex flex-col gap-3">{(["en", "ro"] as const).map(l => <Button key={l} asChild variant={l === lang ? "default" : "outline"} className="h-11 justify-start"><a href={`/downloads/cv-template-${l}.docx`} download={`IONMAN-CV-${l}.docx`}><Download />{l === "en" ? "English · Word" : "Română · Word"}</a></Button>)}</div></section>
        </aside>
      </div>
    </main>
  </div>;
}