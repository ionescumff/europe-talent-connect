import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CitySearchForm } from "@/components/site/CitySearchForm";
import { cityCountries, vacancyCities } from "@/lib/city-jobs";
import { publicJobsQuery } from "@/lib/public-jobs-query";
import { useLang } from "@/lib/i18n";

const title = "Locuri de muncă pe orașe în Olanda și Germania | IONMAN Workforce";
const description = "Caută posturi active după oraș în Olanda și Germania. Vezi condițiile publicate și aplică gratuit prin IONMAN Workforce.";
export const Route = createFileRoute("/jobs/cities/")({
  staticData: { sitemap: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(publicJobsQuery),
  head: () => ({ links: [{ rel: "canonical", href: "https://www.vreaujobs.com/jobs/cities" }], meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: "https://www.vreaujobs.com/jobs/cities" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: CityDirectory,
});
function CityDirectory() {
  const { t } = useLang();
  const { data: jobs } = useSuspenseQuery(publicJobsQuery);
  const cities = vacancyCities(jobs);
  return <div className="public-site min-h-screen"><Nav /><main>
    <header className="public-dark-band px-6 md:px-12 lg:px-16"><Link to="/jobs" className="public-dim text-sm underline">{t("All jobs", "Toate posturile")}</Link><h1 className="mt-6 text-4xl leading-tight md:text-5xl">{t("Jobs by city", "Locuri de muncă pe orașe")}</h1><p className="public-dim mt-5 max-w-2xl text-sm leading-7">{t("Netherlands & Germany. Find active vacancies in the city where you want to work. No recruitment fees for candidates.", "Olanda și Germania. Găsește posturi active în orașul în care vrei să lucrezi. Fără taxe de recrutare pentru candidați.")}</p></header>
    <section className="px-6 py-10 md:px-12 lg:px-16"><CitySearchForm /><div className="mt-12 grid gap-12 md:grid-cols-2">{Object.entries(cityCountries).map(([country, info]) => <section key={country} className="min-w-0"><h2 className="mb-6 text-2xl">{t(info.country, info.ro)}</h2><div className="divide-y border-y">{cities.filter(city => city.country === country).map(city => <Link key={city.slug} to="/jobs/cities/$country/$city" params={{ country: city.country, city: city.slug }} className="flex min-h-16 items-center justify-between gap-4 py-4"><span>{city.name}</span><span className="public-muted flex shrink-0 items-center gap-3 text-sm">{city.count} {city.count === 1 ? t("job", "post") : t("jobs", "posturi")}<ArrowUpRight size={17} /></span></Link>)}</div>{!cities.some(city => city.country === country) && <p className="public-muted py-6 text-sm leading-7">{t("No active vacancies are currently published in this country. You can still search for a city above.", "Momentan nu sunt posturi active publicate în această țară. Poți căuta în continuare un oraș folosind formularul de mai sus.")}</p>}</section>)}</div></section>
  </main><Footer /></div>;
}