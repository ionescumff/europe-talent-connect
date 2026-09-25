import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Clock, Euro, Users, ArrowRight, Search, X } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  jobs,
  jobSectors,
  jobCountries,
  jobCities,
  shiftTypes,
  shiftType,
  minPay,
  isEntryLevel,
  hasHousing,
  startsSoon,
} from "@/lib/jobs";
import { listPublishedJobs } from "@/lib/jobposts.functions";

const title = "Jobs in the Netherlands & Germany — IONMAN Workforce";
const description =
  "Open vacancies for warehousing, production, logistics and construction in the Netherlands and Germany. Pay, shifts, housing and transport listed for every job.";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listPublishedJobs(),
  component: JobsPage,
});

const PAY_FLOOR = 13;
const PAY_CEILING = 18;

type Sort = "relevance" | "pay" | "start" | "openings";

function JobsPage() {
  const extra = Route.useLoaderData();
  const all = useMemo(() => [...extra, ...jobs], [extra]);
  const cityList = useMemo(() => [...new Set([...jobCities, ...extra.map((j) => j.city)])].sort(), [extra]);
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("all");
  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");
  const [shift, setShift] = useState("all");
  const [pay, setPay] = useState(PAY_FLOOR);
  const [entryLevel, setEntryLevel] = useState(false);
  const [housing, setHousing] = useState(false);
  const [soon, setSoon] = useState(false);
  const [sort, setSort] = useState<Sort>("relevance");

  const activeCount =
    (q.trim() ? 1 : 0) +
    (sector !== "all" ? 1 : 0) +
    (country !== "all" ? 1 : 0) +
    (city !== "all" ? 1 : 0) +
    (shift !== "all" ? 1 : 0) +
    (pay > PAY_FLOOR ? 1 : 0) +
    (entryLevel ? 1 : 0) +
    (housing ? 1 : 0) +
    (soon ? 1 : 0);

  function reset() {
    setQ("");
    setSector("all");
    setCountry("all");
    setCity("all");
    setShift("all");
    setPay(PAY_FLOOR);
    setEntryLevel(false);
    setHousing(false);
    setSoon(false);
    setSort("relevance");
  }

  const results = useMemo(() => {
    const list = all.filter((j) => {
      const text = `${j.title} ${j.city} ${j.sector} ${j.summary}`.toLowerCase();
      return (
        (sector === "all" || j.sector === sector) &&
        (country === "all" || j.country === country) &&
        (city === "all" || j.city === city) &&
        (shift === "all" || shiftType(j) === shift) &&
        minPay(j) >= pay &&
        (!entryLevel || isEntryLevel(j)) &&
        (!housing || hasHousing(j)) &&
        (!soon || startsSoon(j)) &&
        (q.trim() === "" || text.includes(q.trim().toLowerCase()))
      );
    });

    if (sort === "pay") list.sort((a, b) => minPay(b) - minPay(a));
    if (sort === "openings") list.sort((a, b) => b.openings - a.openings);
    if (sort === "start")
      list.sort((a, b) => Number(startsSoon(b)) - Number(startsSoon(a)));

    return list;
  }, [all, q, sector, country, city, shift, pay, entryLevel, housing, soon, sort]);

  return (
    <div className="bg-page-glow relative min-h-screen overflow-x-clip text-brand">
      <Nav />

      <header className="px-6 pb-8 pt-6 md:px-8 lg:px-14">
        <div className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Open vacancies
        </div>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-5xl">
          Jobs waiting in the Netherlands &amp; Germany
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-brand/60">
          Every listing shows pay, shifts, housing and transport before you apply. Open a job to see
          the full details — applying is always free for candidates.
        </p>
      </header>

      <section className="px-6 md:px-8 lg:px-14">
        <div className="glass-card space-y-5 rounded-[1.75rem] p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="relative block lg:col-span-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search role, city or keyword…"
                className="field pl-11"
                aria-label="Search jobs"
              />
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="field"
              aria-label="Filter by sector"
            >
              <option value="all">All sectors</option>
              {jobSectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setCity("all");
              }}
              className="field"
              aria-label="Filter by country"
            >
              <option value="all">All countries</option>
              {jobCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="field"
              aria-label="Filter by city"
            >
              <option value="all">All cities</option>
              {jobCities
                .filter(
                  (c) =>
                    country === "all" ||
                    all.some((j) => j.city === c && j.country === country),
                )
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="field"
              aria-label="Filter by working hours"
            >
              <option value="all">Any working hours</option>
              {shiftTypes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="field"
              aria-label="Sort jobs"
            >
              <option value="relevance">Sort: default</option>
              <option value="pay">Sort: highest pay</option>
              <option value="start">Sort: starting soonest</option>
              <option value="openings">Sort: most openings</option>
            </select>
            <label className="block">
              <span className="flex items-center justify-between text-xs font-semibold text-brand/60">
                Minimum pay
                <span className="font-bold text-accent">€{pay.toFixed(2)}/h</span>
              </span>
              <input
                type="range"
                min={PAY_FLOOR}
                max={PAY_CEILING}
                step={0.5}
                value={pay}
                onChange={(e) => setPay(Number(e.target.value))}
                className="mt-3 w-full accent-[var(--accent)]"
                aria-label="Minimum hourly pay"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Toggle active={entryLevel} onClick={() => setEntryLevel(!entryLevel)}>
              No experience needed
            </Toggle>
            <Toggle active={housing} onClick={() => setHousing(!housing)}>
              Housing arranged
            </Toggle>
            <Toggle active={soon} onClick={() => setSoon(!soon)}>
              Starts within 2 weeks
            </Toggle>
            {activeCount > 0 && (
              <button
                onClick={reset}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-brand/60 transition-colors hover:text-accent"
              >
                <X className="size-3.5" /> Clear {activeCount} filter
                {activeCount === 1 ? "" : "s"}
              </button>
            )}
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand/45">
          {results.length} {results.length === 1 ? "job" : "jobs"} available
        </p>
      </section>

      <section className="grid gap-5 px-6 py-6 md:grid-cols-2 md:px-8 lg:px-14">
        {results.map((j) => (
          <Link
            key={j.slug}
            to="/jobs/$slug"
            params={{ slug: j.slug }}
            className="glass-card group flex flex-col rounded-[1.75rem] p-6 transition-transform hover:-translate-y-1"
          >
            {j.image && <img src={j.image} alt="" className="-mx-2 -mt-2 mb-4 h-40 w-[calc(100%+1rem)] rounded-2xl object-cover" />}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {j.sector}
                </div>
                <h2 className="mt-2 font-display text-xl font-bold">{j.title}</h2>
              </div>
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                {j.country}
              </span>
            </div>
            <p className="mt-3 text-sm text-brand/60">{j.summary}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-xs text-brand/70">
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-accent" /> {j.city}
              </div>
              <div className="flex items-center gap-2">
                <Euro className="size-3.5 text-accent" /> {j.pay.split(" gross")[0]}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-accent" /> {j.start}
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-3.5 text-accent" /> {j.openings} openings
              </div>
            </dl>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
              View job details
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
        {results.length === 0 && (
          <div className="glass-card rounded-[1.75rem] p-8 text-sm text-brand/60 md:col-span-2">
            No jobs match those filters right now. Clear a few filters, or leave your CV and we'll
            contact you when a matching vacancy opens.
          </div>
        )}
      </section>

      <section className="px-6 pb-16 md:px-8 lg:px-14">
        <div className="glass-card flex flex-col items-start gap-4 rounded-[2rem] p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Don't see the right job?</h2>
            <p className="mt-2 text-sm text-brand/60">
              Leave your CV once — we'll match you to new vacancies as they open.
            </p>
          </div>
          <a
            href="/#cv"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-accent transition-transform hover:-translate-y-0.5"
          >
            Leave your CV
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
        active
          ? "border-transparent bg-accent text-accent-foreground shadow-accent"
          : "border-border bg-glass text-brand/70 hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
