import { localizeJob, type Job } from "./jobs";

export const jobPageUrl = (slug: string) => `https://www.vreaujobs.com/jobs/${encodeURIComponent(slug)}`;
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const paragraphs = (value: string) => value.split(/\n+/).filter(line => line.trim()).map(line => `<p>${escapeHtml(line)}</p>`).join("");
const list = (label: string, values: string[]) => values.length ? `<p>${label}</p><ul>${values.map(value => `<li>${escapeHtml(value)}</li>`).join("")}</ul>` : "";

/** Uses the same Romanian content as the initial page; never estimates pay or eligibility. */
export function jobPostingSchema(source: Job) {
  const job = localizeJob(source, "ro");
  const date = source.datePosted && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(source.datePosted) && Number.isFinite(Date.parse(source.datePosted)) ? source.datePosted : undefined;
  const facts = [
    ["Salariu", job.pay], ["Contract", job.contract], ["Program", job.schedule],
    ["Data începerii", job.start], ["Cazare", job.housing], ["Transport", job.transport], ["Limbă", job.language],
  ];
  const description = paragraphs(job.summary) + paragraphs(job.companyDetails ?? "") +
    list("Ce vei face", job.tasks) + list("Ce îți trebuie", job.requirements) + list("Ce oferim", job.offer) +
    facts.map(([label, value]) => paragraphs(`${label}: ${value}`)).join("") +
    (job.sourceUrl ? paragraphs("Publicat pe baza anunțului Triangle. Disponibilitatea, eligibilitatea candidatului și toate condițiile angajatorului trebuie confirmate înainte de plecare. Cazarea și transportul internațional nu sunt incluse decât dacă sunt confirmate explicit pentru acest post.") : "");
  return {
    "@context": "https://schema.org", "@type": "JobPosting",
    title: job.title, description, inLanguage: "ro", url: jobPageUrl(job.slug),
    identifier: { "@type": "PropertyValue", name: "IONMAN Workforce", value: job.slug },
    ...(date ? { datePosted: date } : {}),
    ...(job.company?.trim() ? { hiringOrganization: { "@type": "Organization", name: job.company } } : {}),
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.city, addressCountry: job.country === "Netherlands" ? "NL" : "DE" } },
    // Unknown expiry and employment type are omitted. As a third-party recruiter,
    // do not emit employer-only baseSalary or claim Romanian-only eligibility.
  };
}

export const serializeJobSchema = (value: ReturnType<typeof jobPostingSchema>) => JSON.stringify(value).replace(/</g, "\\u003c");