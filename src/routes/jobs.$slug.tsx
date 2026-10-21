import { useLang } from "@/lib/i18n";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

import { listPublishedJobs } from "@/lib/jobposts.functions";

export const Route = createFileRoute("/jobs/$slug")({
  loader: async ({ params }) => {
    const published = await listPublishedJobs();
    const job = published.find((j) => j.slug === params.slug);
    if (!job) throw notFound();
    return { job, published };
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
        ...(job.image?.startsWith("https://") ? [{ property: "og:image", content: job.image }, { name: "twitter:image", content: job.image }] : []),
      ],
    };
  },
  notFoundComponent: JobNotFound,
  errorComponent: JobNotFound,
  component: JobDetail,
});

function JobNotFound() {
  const { t } = useLang();
  return (
    <div className="public-site min-h-screen">
      <Nav />
      <div className="px-6 py-24 text-center md:px-8">
        <h1 className="font-display text-3xl font-extrabold">{t("This job is no longer listed", "Acest post nu mai este disponibil")}</h1>
        <p className="mt-3 text-sm text-brand/60">{t("It may have been filled. See what else is open.", "Este posibil să fi fost ocupat. Vezi ce alte posturi sunt deschise.")}</p>
        <Link
          to="/jobs"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-accent"
        >
          {t("Back to all jobs", "Înapoi la toate posturile")}
        </Link>
      </div>
      <Footer />
    </div>
  );
}

function JobDetail() {
  const { t } = useLang();
  const { job, published } = Route.useLoaderData();
  const related = published.filter((j) => j.slug !== job.slug && j.sector === job.sector).slice(0, 2);

  const facts: [string, string][] = [
    ...(job.company ? [[t("Employer", "Angajator"), job.company] as [string, string]] : []),
    [t("Location", "Locație"), `${job.city}, ${job.country}`],
    [t("Pay", "Salariu"), job.pay],
    [t("Contract", "Contract"), job.contract],
    [t("Schedule", "Program"), job.schedule],
    [t("Start date", "Data începerii"), job.start],
    [t("Housing", "Cazare"), job.housing],
    [t("Transport", "Transport"), job.transport],
    [t("Language", "Limbă"), job.language],
    [t("Openings", "Locuri libere"), String(job.openings)],
  ];

  return (
    <div className="public-site relative min-h-screen overflow-x-clip">
      <Nav />

      <div className="px-6 pt-4 md:px-8 lg:px-14">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand/60 transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" /> {t("All jobs", "Toate posturile")}
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
        {job.image && <img src={job.image} alt={job.title} className="mt-6 max-h-96 w-full max-w-3xl rounded-[1.75rem] object-cover" />}
      </header>

      <div className="grid gap-6 px-6 pb-16 md:px-8 lg:grid-cols-[1.3fr_1fr] lg:px-14">
        <div className="min-w-0 space-y-6">
          {job.company && (
            <section className="border-t border-border py-7">
              <h2 className="font-display text-xl font-bold">{t("About", "Despre")} {job.company}</h2>
              {job.companyDetails && <p className="mt-3 whitespace-pre-line text-sm text-brand/75">{job.companyDetails}</p>}
            </section>
          )}
          {job.tasks.length > 0 && <section className="border-t border-border py-7">
            <h2 className="font-display text-xl font-bold">{t("What you'll do", "Ce vei face")}</h2>
            <ul className="mt-4 space-y-3 text-sm text-brand/75">
              {job.tasks.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </section>}

          {job.requirements.length > 0 && <section className="border-t border-border py-7">
            <h2 className="font-display text-xl font-bold">{t("What you need", "Ce îți trebuie")}</h2>
            <ul className="mt-4 space-y-3 text-sm text-brand/75">
              {job.requirements.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </section>}

          {job.offer.length > 0 && <section className="border-t border-border py-7">
            <h2 className="font-display text-xl font-bold">{t("What we offer", "Ce oferim")}</h2>
            <ul className="mt-4 space-y-3 text-sm text-brand/75">
              {job.offer.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </section>}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="border-t border-border py-7">
            <h2 className="font-display text-lg font-bold">{t("Job details", "Detaliile postului")}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                  <dt className="shrink-0 text-brand/50">{k}</dt>
                  <dd className="break-words text-right font-medium text-brand/85">{v}</dd>
                </div>
              ))}
            </dl>
            <a
              href={`/?job=${job.slug}#cv`}
              className="mt-6 block rounded-xl bg-accent px-6 py-3.5 text-center text-sm font-semibold text-accent-foreground shadow-accent transition-transform hover:-translate-y-0.5"
            >
              {t("Apply — leave your CV", "Aplică — trimite CV-ul")}
            </a>
            <p className="mt-3 text-center text-xs text-brand/50">
              {t("Free for candidates. Mention this job and we'll call you back.", "Gratuit pentru candidați. Trimite CV-ul pentru acest post, iar echipa noastră te va contacta.")}
            </p>
          </div>

          {related.length > 0 && (
            <div className="border-t border-border py-7">
              <h2 className="font-display text-lg font-bold">{t("Similar jobs", "Posturi similare")}</h2>
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
