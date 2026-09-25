import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { getJob, jobs } from "@/lib/jobs";

export const Route = createFileRoute("/jobs/$slug")({
  loader: ({ params }) => {
    const job = getJob(params.slug);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Job not found — IONMAN Workforce" }, { name: "robots", content: "noindex" }],
      };
    }
    const { job } = loaderData;
    const title = `${job.title} in ${job.city}, ${job.country} — IONMAN Workforce`;
    return {
      meta: [
        { title },
        { name: "description", content: job.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: job.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: JobNotFound,
  errorComponent: JobNotFound,
  component: JobDetail,
});

function JobNotFound() {
  return (
    <div className="bg-page-glow min-h-screen text-brand">
      <Nav />
      <div className="px-6 py-24 text-center md:px-8">
        <h1 className="font-display text-3xl font-extrabold">This job is no longer listed</h1>
        <p className="mt-3 text-sm text-brand/60">It may have been filled. See what else is open.</p>
        <Link
          to="/jobs"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-accent"
        >
          Back to all jobs
        </Link>
      </div>
      <Footer />
    </div>
  );
}

function JobDetail() {
  const { job } = Route.useLoaderData();
  const related = jobs.filter((j) => j.slug !== job.slug && j.sector === job.sector).slice(0, 2);

  const facts: [string, string][] = [
    ["Location", `${job.city}, ${job.country}`],
    ["Pay", job.pay],
    ["Contract", job.contract],
    ["Schedule", job.schedule],
    ["Start date", job.start],
    ["Housing", job.housing],
    ["Transport", job.transport],
    ["Language", job.language],
    ["Openings", String(job.openings)],
  ];

  return (
    <div className="bg-page-glow relative min-h-screen overflow-x-clip text-brand">
      <Nav />

      <div className="px-6 pt-4 md:px-8 lg:px-14">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand/60 transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" /> All jobs
        </Link>
      </div>

      <header className="px-6 pb-8 pt-5 md:px-8 lg:px-14">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
            {job.sector}
          </span>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand/70">
            {job.country}
          </span>
        </div>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-5xl">
          {job.title} — {job.city}
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-brand/60">{job.summary}</p>
      </header>

      <div className="grid gap-6 px-6 pb-16 md:px-8 lg:grid-cols-[1.3fr_1fr] lg:px-14">
        <div className="space-y-6">
          <section className="glass-card rounded-[1.75rem] p-7">
            <h2 className="font-display text-xl font-bold">What you'll do</h2>
            <ul className="mt-4 space-y-3 text-sm text-brand/75">
              {job.tasks.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card rounded-[1.75rem] p-7">
            <h2 className="font-display text-xl font-bold">What you need</h2>
            <ul className="mt-4 space-y-3 text-sm text-brand/75">
              {job.requirements.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card rounded-[1.75rem] p-7">
            <h2 className="font-display text-xl font-bold">What we offer</h2>
            <ul className="mt-4 space-y-3 text-sm text-brand/75">
              {job.offer.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="glass-card rounded-[1.75rem] p-7">
            <h2 className="font-display text-lg font-bold">Job details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-border pb-3 last:border-0 last:pb-0">
                  <dt className="shrink-0 text-brand/50">{k}</dt>
                  <dd className="text-right font-medium text-brand/85">{v}</dd>
                </div>
              ))}
            </dl>
            <a
              href={`/?job=${job.slug}#cv`}
              className="mt-6 block rounded-xl bg-accent px-6 py-3.5 text-center text-sm font-semibold text-accent-foreground shadow-accent transition-transform hover:-translate-y-0.5"
            >
              Apply — leave your CV
            </a>
            <p className="mt-3 text-center text-xs text-brand/50">
              Free for candidates. Mention this job and we'll call you back.
            </p>
          </div>

          {related.length > 0 && (
            <div className="glass-card rounded-[1.75rem] p-7">
              <h2 className="font-display text-lg font-bold">Similar jobs</h2>
              <div className="mt-4 space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to="/jobs/$slug"
                    params={{ slug: r.slug }}
                    className="block rounded-xl bg-glass p-4 transition-colors hover:bg-accent/10"
                  >
                    <div className="font-display text-sm font-bold">{r.title}</div>
                    <div className="mt-1 text-xs text-brand/60">
                      {r.city}, {r.country} · {r.pay.split(" gross")[0]}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <Footer />
    </div>
  );
}
