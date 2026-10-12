export type Job = {
  slug: string;
  title: string;
  sector: string;
  country: "Netherlands" | "Germany";
  city: string;
  pay: string;
  contract: string;
  schedule: string;
  start: string;
  housing: string;
  transport: string;
  language: string;
  openings: number;
  summary: string;
  tasks: string[];
  requirements: string[];
  offer: string[];
  image?: string | undefined;
  company?: string | undefined;
  companyDetails?: string | undefined;
};

// Only confirmed published vacancies are displayed publicly; no demo offers.
export const jobs: Job[] = [];

export const jobSectors = [...new Set(jobs.map((j) => j.sector))].sort();
export const jobCountries = [...new Set(jobs.map((j) => j.country))].sort();
export const jobCities = [...new Set(jobs.map((j) => j.city))].sort();

/** Lowest hourly rate in the pay range, in euros. */
export function minPay(job: Job): number {
  const match = job.pay.match(/\d+[.,]?\d*/);
  return match ? Number(match[0].replace(",", ".")) : 0;
}

export type ShiftType = "Day shift" | "Two shifts" | "Three shifts / nights";

export function shiftType(job: Job): ShiftType {
  const s = job.schedule.toLowerCase();
  if (s.includes("three shift") || s.includes("night")) return "Three shifts / nights";
  if (s.includes("two shift") || s.includes("shift (")) return "Two shifts";
  return "Day shift";
}

export const shiftTypes: ShiftType[] = ["Day shift", "Two shifts", "Three shifts / nights"];

/** True when the listing explicitly needs no prior experience. */
export function isEntryLevel(job: Job): boolean {
  return job.requirements.some((r) => /no experience/i.test(r));
}

export function hasHousing(job: Job): boolean {
  return !/no housing|not available/i.test(job.housing);
}

export function startsSoon(job: Job): boolean {
  return /immediate|1 week|2 weeks/i.test(job.start);
}

export function getJob(slug: string) {
  return jobs.find((j) => j.slug === slug);
}

export type CandidateProfile = { sector: string; country_preference: string; applied_job?: string | null };

/** Rule-based fit between a candidate's CV filters and a job (0–100). */
export function profileScore(c: CandidateProfile, job: Job): number {
  let score = 0;
  if (c.applied_job === job.slug) score += 50;
  if (c.sector === job.sector) score += 35;
  const pref = c.country_preference.toLowerCase();
  if (pref === "both" || pref === job.country.toLowerCase()) score += 15;
  return Math.min(score, 100);
}

/** Jobs that fit the candidate's filters, best first. */
export function suggestedJobs(c: CandidateProfile): { job: Job; score: number }[] {
  return jobs
    .map((job) => ({ job, score: profileScore(c, job) }))
    .filter((m) => m.score >= 35 || m.job.slug === c.applied_job)
    .sort((a, b) => b.score - a.score || b.job.openings - a.job.openings);
}
