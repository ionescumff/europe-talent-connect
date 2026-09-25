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
};

export const jobs: Job[] = [
  {
    slug: "warehouse-order-picker-venlo",
    title: "Warehouse order picker",
    sector: "Warehousing & fulfilment",
    country: "Netherlands",
    city: "Venlo",
    pay: "€13.80 – €15.20 gross / hour",
    contract: "Temporary with extension, via Dutch agency contract",
    schedule: "Two shifts (06:00–14:30 / 14:30–23:00), 40h/week",
    start: "Within 2 weeks",
    housing: "Shared housing arranged, deducted weekly",
    transport: "Bicycle or shared van to site",
    language: "Basic English",
    openings: 12,
    summary:
      "Picking and packing orders in a large fulfilment centre near Venlo, with scanner-guided routes and clear daily targets.",
    tasks: [
      "Pick orders with a hand scanner and prepare pallets",
      "Check quantities and product codes before dispatch",
      "Keep aisles and packing stations tidy and safe",
    ],
    requirements: [
      "EU passport or ID card",
      "Able to stand and walk a full shift",
      "Willing to rotate between morning and afternoon shifts",
    ],
    offer: [
      "Weekly pay with payslip in English",
      "Holiday allowance and pension per Dutch collective agreement",
      "Housing, insurance and registration support on arrival",
    ],
  },
  {
    slug: "production-operator-food-tilburg",
    title: "Food production operator",
    sector: "Production & food",
    country: "Netherlands",
    city: "Tilburg",
    pay: "€14.10 – €16.00 gross / hour",
    contract: "Temporary, long-term project",
    schedule: "Three shifts, 38–45h/week with shift bonus",
    start: "Immediate",
    housing: "Furnished shared accommodation",
    transport: "Company transport from housing",
    language: "Basic English",
    openings: 8,
    summary:
      "Operating packing and sorting lines in a temperature-controlled food plant with hygiene training provided.",
    tasks: [
      "Feed and monitor packing lines",
      "Carry out quality and weight checks",
      "Clean machines and work areas between runs",
    ],
    requirements: [
      "EU passport or ID card",
      "Comfortable working in cooled areas (4–8°C)",
      "Available for night rotation",
    ],
    offer: [
      "Shift bonuses up to 30%",
      "Paid safety and hygiene induction",
      "Steady hours across the full year",
    ],
  },
  {
    slug: "logistics-loader-duisburg",
    title: "Logistics loader / unloader",
    sector: "Logistics & site work",
    country: "Germany",
    city: "Duisburg",
    pay: "€14.50 – €16.50 gross / hour",
    contract: "Arbeitnehmerüberlassung (temporary employment)",
    schedule: "Day shift, 40h/week, occasional Saturdays",
    start: "Within 3 weeks",
    housing: "Shared apartment within 20 minutes of the depot",
    transport: "Shared van from housing",
    language: "Basic English or German",
    openings: 10,
    summary:
      "Loading and unloading containers and trailers at a busy Ruhr-area depot, working in fixed two-person teams.",
    tasks: [
      "Load and unload trailers and containers by hand and with pallet trucks",
      "Sort and label goods for onward transport",
      "Report damaged goods to the shift lead",
    ],
    requirements: [
      "EU passport or ID card",
      "Physically fit for repeated lifting",
      "Reliable attendance and punctuality",
    ],
    offer: [
      "Monthly pay under German law with full social insurance",
      "Overtime paid at premium rates",
      "Work clothing and safety shoes provided",
    ],
  },
  {
    slug: "forklift-driver-rotterdam",
    title: "Reach truck / forklift driver",
    sector: "Warehousing & fulfilment",
    country: "Netherlands",
    city: "Rotterdam",
    pay: "€15.50 – €17.80 gross / hour",
    contract: "Temporary with view to permanent",
    schedule: "Two shifts, 40h/week",
    start: "Within 2 weeks",
    housing: "Shared housing available on request",
    transport: "Public transport or bicycle",
    language: "Basic English",
    openings: 5,
    summary:
      "Moving pallets between receiving, storage and dispatch in a port-side distribution centre.",
    tasks: [
      "Operate reach truck and counterbalance forklift",
      "Store and retrieve pallets using a warehouse system",
      "Carry out daily equipment checks",
    ],
    requirements: [
      "Valid forklift or reach truck certificate",
      "At least 6 months of driving experience",
      "EU passport or ID card",
    ],
    offer: [
      "Higher rate for certified drivers",
      "Option of a direct contract after the assignment",
      "Refresher training on arrival",
    ],
  },
  {
    slug: "construction-helper-munich",
    title: "Construction site helper",
    sector: "Construction support",
    country: "Germany",
    city: "Munich area",
    pay: "€15.00 – €18.00 gross / hour",
    contract: "Project-based, 6+ months",
    schedule: "Monday–Friday, 07:00–16:00",
    start: "Within 3 weeks",
    housing: "Accommodation organised near the project",
    transport: "Crew transport to site",
    language: "Basic German is an advantage",
    openings: 6,
    summary:
      "Supporting trades crews on residential and commercial build phases in and around Munich.",
    tasks: [
      "Prepare materials and keep the site clear",
      "Assist bricklayers, carpenters and installers",
      "Handle basic demolition and finishing work",
    ],
    requirements: [
      "Previous site experience preferred",
      "EU passport or ID card",
      "Own safety shoes (other PPE provided)",
    ],
    offer: [
      "Long project with consistent hours",
      "Travel allowance for longer routes",
      "Progression to a specialised trade role",
    ],
  },
  {
    slug: "packaging-assistant-eindhoven",
    title: "Packaging assistant",
    sector: "Production & food",
    country: "Netherlands",
    city: "Eindhoven",
    pay: "€13.60 – €14.90 gross / hour",
    contract: "Temporary, seasonal peak",
    schedule: "Day shift, 36–40h/week",
    start: "Immediate",
    housing: "Shared housing arranged",
    transport: "Bicycle provided",
    language: "Basic English",
    openings: 15,
    summary:
      "Hands-on packaging work for consumer goods, ideal as a first assignment abroad — full on-the-job training.",
    tasks: [
      "Assemble boxes and pack finished products",
      "Apply labels and check packaging quality",
      "Move finished pallets to the dispatch area",
    ],
    requirements: [
      "EU passport or ID card",
      "No experience needed",
      "Team-minded and punctual",
    ],
    offer: [
      "Quick start, no experience required",
      "Weekly pay",
      "Chance to move into a longer assignment",
    ],
  },
];

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
