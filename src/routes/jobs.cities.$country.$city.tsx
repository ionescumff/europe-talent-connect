import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CitySearchForm } from "@/components/site/CitySearchForm";
import { CityMap } from "@/components/site/CityMap";
import { cityCountries, cityDisplayName, cityPageUrl, citySlug, isCityCountry, jobsInCity } from "@/lib/city-jobs";
import { publicJobsQuery } from "@/lib/public-jobs-query";
import { localizeJob } from "@/lib/jobs";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/jobs/cities/$country/$city")({
  staticData: { sitemap: true },
  loader: async ({ params, context }) => {
    if (!isCityCountry(params.country) || !citySlug(params.city) || params.city.length > 100) throw notFound();
    const slug = citySlug(params.city);
    if (slug !== params.city) throw redirect({ to: "/jobs/cities/$country/$city", params: { country: params.country, city: slug }, statusCode: 301 });
    const jobs = await context.queryClient.ensureQueryData(publicJobsQuery);
    const matches = jobsInCity(jobs, params.country, slug);
    return { country: params.country, slug, city: matches[0]?.city.trim() || cityDisplayName(slug), count: matches.length };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `Locuri de muncă în ${loaderData.city}, ${cityCountries[loaderData.country].ro} | IONMAN Workforce` : "Oraș indisponibil | IONMAN Workforce";
    const description = loaderData ? `Vezi posturile active în ${loaderData.city}, ${cityCountries[loaderData.country].ro}, condițiile publicate și harta orașului. Aplicarea este gratuită pentru candidați.` : "Caută locuri de muncă pe orașe în Olanda și Germania.";
    const url = loaderData ? cityPageUrl(loaderData.country, loaderData.slug) : undefined;
    return { links: url ? [{ rel: "canonical", href: url }] : [], meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, ...(url ? [{ property: "og:url", content: url }] : []), ...(!loaderData?.count ? [{ name: "robots", content: "noindex,follow" }] : [])] };
  },
  notFoundComponent: CityNotFound,
  component: CityJobsPage,
});
function CityNotFound() {
  const { t } = useLang();
  return <div className="public-site min-h-screen"><Nav /><main className="px-6 py-16"><h1 className="text-3xl">{t("City page unavailable", "Pagina orașului nu este disponibilă")}</h1><Link to="/jobs/cities" className="mt-6 inline-block underline">{t("Search by city", "Caută după oraș")}</Link></main><Footer /></div>;
}
function CityJobsPage() {
  const { t, lang } = useLang();
  const { country, city, slug } = Route.useLoaderData();
  const { data: jobs } = useSuspenseQuery(publicJobsQuery);
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("all");
  const localJobs = jobsInCity(jobs, country, slug).map(job => localizeJob(job, lang));
  const sectors = [...new Set(localJobs.map(job => job.sector))].sort();
  const results = localJobs.filter(job => (sector === "all" || job.sector === sector) && `${job.title} ${job.summary} ${job.company ?? ""}`.toLowerCase().includes(q.trim().toLowerCase()));
  return <div className="public-site min-h-screen"><Nav /><main>
    <header className="public-dark-band px-6 md:px-12 lg:px-16"><Link to="/jobs/cities" className="public-dim text-sm underline">{t("All cities", "Toate orașele")}</Link><p className="public-dim mt-6 text-sm">{t(cityCountries[country].country, cityCountries[country].ro)}</p><h1 className="mt-3 text-4xl leading-tight md:text-5xl">{t(`Jobs in ${city}`, `Locuri de muncă în ${city}`)}</h1><p className="public-dim mt-5 text-sm leading-7">{t("Published active vacancies. Review the job conditions before applying; recruitment is free for candidates.", "Posturi publicate și active. Citește condițiile postului înainte de a aplica; recrutarea este gratuită pentru candidați.")}</p></header>
    <section className="px-6 py-8 md:px-12 lg:px-16"><CitySearchForm key={`${country}/${slug}`} initialCountry={country} initialCity={city} /><div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]"><div className="min-w-0">
      <div className="mb-6 grid gap-3 sm:grid-cols-2"><label className="relative"><Search className="pointer-events-none absolute left-3 top-4 size-4" /><input className="field pl-10" aria-label={t("Search jobs in this city", "Caută posturi în acest oraș")} placeholder={t("Role or company", "Post sau companie")} value={q} onChange={event => setQ(event.target.value)} /></label><select className="field" aria-label={t("Filter by sector", "Filtrează după sector")} value={sector} onChange={event => setSector(event.target.value)}><option value="all">{t("All sectors", "Toate sectoarele")}</option>{sectors.map(value => <option key={value}>{value}</option>)}</select></div>
      <p className="public-muted mb-4 text-sm" role="status">{results.length} {results.length === 1 ? t("active vacancy", "post activ") : t("active vacancies", "posturi active")}</p>
      <div className="divide-y border-t">{results.map(job => <article key={job.slug} className="py-7">{job.image && <img src={job.image} alt={job.title} loading="lazy" className="mb-5 aspect-video w-full rounded-lg object-cover" />}<p className="public-muted text-xs">{job.sector}</p><h2 className="mt-3 text-2xl leading-snug"><Link to="/jobs/$slug" params={{ slug: job.slug }}>{job.title}</Link></h2><p className="public-muted mt-3 flex items-center gap-2 text-sm"><MapPin className="size-4 shrink-0" />{job.city}, {t(cityCountries[country].country, cityCountries[country].ro)}</p><p className="mt-4 text-sm">{job.pay}</p><p className="public-muted mt-3 line-clamp-3 text-sm leading-6">{job.summary}</p><Button asChild variant="link" className="mt-4 h-12 px-0"><Link to="/jobs/$slug" params={{ slug: job.slug }}>{t("View and apply", "Vezi postul și aplică")}<ArrowRight /></Link></Button></article>)}</div>
      {!results.length && <div className="border-b py-10"><h2 className="text-2xl leading-snug">{localJobs.length ? t("No jobs match your filters.", "Niciun post nu corespunde filtrelor.") : t(`No active jobs in ${city} at the moment.`, `Momentan nu sunt posturi active în ${city}.`)}</h2><p className="public-muted mt-4 text-sm leading-7">{t("Leave your CV for suitable confirmed opportunities, or explore other cities.", "Trimite CV-ul pentru oportunități confirmate potrivite sau caută în alte orașe.")}</p><div className="mt-5 flex flex-wrap gap-3">{localJobs.length > 0 && <Button variant="outline" className="h-12" onClick={() => { setQ(""); setSector("all"); }}>{t("Clear filters", "Șterge filtrele")}</Button>}<Button asChild className="public-cta h-12 rounded-none"><a href="/#cv">{t("Leave your CV", "Trimite CV-ul")}<ArrowRight /></a></Button></div></div>}
    </div><CityMap key={`${country}/${slug}`} country={country} city={city} /></div></section>
  </main><Footer /></div>;
}