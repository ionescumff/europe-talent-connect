import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Clock, Euro, Users, ArrowRight, Search } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { jobs, jobSectors, jobCountries } from "@/lib/jobs";

const title = "Jobs in the Netherlands & Germany — IONMAN Workforce";
const description =
  "Open vacancies for warehousing, production, logistics and construction in the Netherlands and Germany. Pay, shifts, housing and transport listed for every job.";

export const Route = createFileRoute("/jobs")({
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
  component: JobsPage,
});

function JobsPage() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("all");
  const [country, setCountry] = useState("all");

  const results = useMemo(
    () =>
      jobs.filter((j) => {
        const text = `${j.title} ${j.city} ${j.sector} ${j.summary}`.toLowerCase();
        return (
          (sector === "all" || j.sector === sector) &&
          (country === "all" || j.country === country) &&
          (q.trim() === "" || text.includes(q.trim().toLowerCase()))
        );
      }),
    [q, sector, country],
  );

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
        <div className="glass-card grid gap-4 rounded-[1.75rem] p-5 md:grid-cols-[1.4fr_1fr_1fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search role or city…"
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
            onChange={(e) => setCountry(e.target.value)}
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
            No jobs match those filters right now. Leave your CV and we'll contact you when a
            matching vacancy opens.
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
