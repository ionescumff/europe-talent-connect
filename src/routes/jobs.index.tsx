import { useLang } from "@/lib/i18n";
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { JobFeed } from "@/components/site/JobFeed";
import { listPublishedJobs } from "@/lib/jobposts.functions";

const title = "Locuri de muncă în Germania și Olanda — IONMAN Workforce";
const description = "Vezi ofertele de muncă publicate în construcții, depozite, logistică și producție. Aplicarea este gratuită pentru candidați.";
export const Route = createFileRoute("/jobs/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  loader: () => listPublishedJobs(), component: JobsPage,
});
function JobsPage() {
  const { t } = useLang();
  const jobs = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("all");
  const [country, setCountry] = useState("all");
  const sectors = [...new Set(jobs.map(job => job.sector))].sort();
  const results = useMemo(() => jobs.filter(job => (sector === "all" || sector === job.sector) && (country === "all" || country === job.country) && `${job.title} ${job.city} ${job.summary} ${job.company ?? ""}`.toLowerCase().includes(q.trim().toLowerCase())), [jobs, q, sector, country]);
  return <div className="public-site min-h-screen"><Nav /><main>
    <header className="public-dark-band px-6 py-14 md:px-12 lg:px-16"><p className="public-dim mb-4 text-xs uppercase">{t("Published opportunities", "Oportunități publicate")}</p><h1 className="text-4xl font-normal leading-tight md:text-5xl">{t("Jobs in Germany & the Netherlands", "Locuri de muncă în Germania și Olanda")}</h1><p className="public-dim mt-5 max-w-2xl text-sm leading-7">{t("Browse published vacancies and review the available conditions before applying. Recruitment is always free for candidates.", "Vezi posturile publicate și analizează condițiile disponibile înainte de a aplica. Recrutarea este întotdeauna gratuită pentru candidați.")}</p></header>
    <JobFeed />
    <section className="px-6 py-10 md:px-12 lg:px-16">
      <div className="job-filters grid min-w-0 gap-4 border-y py-5 md:grid-cols-[2fr_1fr_1fr_auto]"><label className="relative"><Search className="absolute left-3 top-4 size-4" /><input aria-label={t("Search jobs", "Caută locuri de muncă")} placeholder={t("Role, city or company", "Post, oraș sau companie")} className="field pl-10" value={q} onChange={e => setQ(e.target.value)} /></label><select className="field" aria-label={t("Filter by sector", "Filtrează după sector")} value={sector} onChange={e => setSector(e.target.value)}><option value="all">{t("All sectors", "Toate sectoarele")}</option>{sectors.map(value => <option key={value}>{value}</option>)}</select><select className="field" aria-label={t("Filter by country", "Filtrează după țară")} value={country} onChange={e => setCountry(e.target.value)}><option value="all">{t("All countries", "Toate țările")}</option><option value="Germany">{t("Germany", "Germania")}</option><option value="Netherlands">{t("Netherlands", "Olanda")}</option></select><Button variant="ghost" size="icon" className="h-12" aria-label={t("Clear filters", "Șterge filtrele")} title={t("Clear filters", "Șterge filtrele")} onClick={() => { setQ(""); setSector("all"); setCountry("all"); }}><X /></Button></div>
      <p className="public-muted my-7 text-xs uppercase">{results.length} {t("published vacancies", "posturi publicate")}</p>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">{results.map(job => <Link key={job.slug} to="/jobs/$slug" params={{ slug: job.slug }} className="public-job min-w-0 border-b pb-7">{job.image && <img src={job.image} alt={job.title} width={1200} height={675} loading="lazy" className="mb-5 aspect-video w-full object-cover" />}<p className="public-muted text-xs uppercase">{job.sector}</p><h2 className="mt-3 text-2xl font-normal">{job.title}</h2><p className="public-muted mt-3 flex items-center gap-2 text-sm"><MapPin size={15} />{job.city}, {job.country}</p><p className="mt-4 text-sm">{job.pay || t("Salary not specified", "Salariul nu este precizat")}</p><p className="public-muted mt-3 text-sm leading-6">{job.summary}</p><span className="mt-6 flex items-center gap-3 text-sm">{t("View job details", "Vezi detaliile postului")}<ArrowRight size={17} /></span></Link>)}</div>
      {results.length === 0 && <div className="public-empty border-y py-12"><h2 className="text-2xl font-normal">{jobs.length ? t("No jobs match your filters.", "Niciun post nu corespunde filtrelor.") : t("No published vacancies at the moment.", "Momentan nu sunt posturi publicate.")}</h2><p className="public-muted mt-4 max-w-xl text-sm leading-7">{t("Leave your CV and our team will contact you about suitable confirmed vacancies. You can register your interest in construction, warehousing, logistics or production.", "Trimite CV-ul și echipa te va contacta pentru posturi confirmate potrivite. Ne poți spune că te interesează construcțiile, depozitele, logistica sau producția.")}</p><Button asChild className="public-cta mt-6 rounded-none"><a href="/#cv">{t("Leave your CV", "Trimite CV-ul")}<ArrowRight /></a></Button></div>}
    </section>
  </main><Footer /></div>;
}
