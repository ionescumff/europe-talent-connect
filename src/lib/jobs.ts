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
  openings: string; // Changed from number to string for 'Evergreen' status
  summary: string;
  tasks: string[];
  requirements: string[];
  offer: string[];
  image?: string;
  company?: string;
  companyDetails?: string;
  isEvergreen?: boolean;
};

export const jobs: Job[] = [
  {
    slug: "warehouse-logistics-netherlands",
    title: "Warehouse & Logistics (Pool)",
    sector: "Warehousing & fulfilment",
    country: "Netherlands",
    city: "Venlo / Tilburg area",
    pay: "€13.80 – €16.00 gross / hour",
    contract: "Dutch agency contract (AUB/NBBU)",
    schedule: "Shift-based, 38–40h/week",
    start: "Ongoing recruitment",
    housing: "Agency-arranged shared housing available",
    transport: "Bicycle or shared transport provided",
    language: "Basic English",
    openings: "Regular openings",
    isEvergreen: true,
    summary: "General warehouse roles including order picking, packing, and loading for various international logistics partners.",
    tasks: [
      "Pick and pack orders using hand scanners",
      "Prepare pallets and check shipping labels",
      "Maintain a safe and clean workspace",
    ],
    requirements: [
      "EU passport or ID card (Required)",
      "Physical fitness for manual work",
      "Willingness to work in shifts",
    ],
    offer: [
      "Weekly salary payments",
      "Housing and health insurance support",
      "English-speaking coordinators on site",
    ],
  },
  {
    slug: "production-food-industry-netherlands",
    title: "Production & Food Processing",
    sector: "Production & food",
    country: "Netherlands",
    city: "Multiple locations",
    pay: "€13.60 – €15.50 gross / hour",
    contract: "Temporary with long-term perspective",
    schedule: "Morning, afternoon, and night shifts",
    start: "Weekly starts",
    housing: "Furnished accommodation available",
    transport: "Company transport from housing",
    language: "English or Dutch (Basic)",
    openings: "Ongoing recruitment",
    isEvergreen: true,
    summary: "Support roles in food production, packaging, and quality control lines across the Netherlands.",
    tasks: [
      "Operate packaging and sorting machinery",
      "Perform basic quality and hygiene checks",
      "Assist with line changeovers",
    ],
    requirements: [
      "EU citizenship",
      "Reliability and punctuality",
      "Comfortable working in temperature-controlled environments",
    ],
    offer: [
      "Shift bonuses (up to 30%)",
      "Paid safety inductions",
      "Stable hours throughout the year",
    ],
  },
  {
    slug: "construction-site-support-germany",
    title: "Construction Support (Germany)",
    sector: "Construction support",
    country: "Germany",
    city: "Southern & Western Germany",
    pay: "€14.50 – €17.50 gross / hour",
    contract: "German employment contract",
    schedule: "Day shift, Mon–Fri",
    start: "Based on project start dates",
    housing: "Organized worker accommodation",
    transport: "Crew van to site",
    language: "Basic German or English",
    openings: "Project-based",
    isEvergreen: true,
    summary: "Supporting skilled trades on commercial and residential build projects. We regularly recruit for projects in Germany.",
    tasks: [
      "Site preparation and clearing",
      "Assisting electricians, plumbers, or bricklayers",
      "Material handling and basic installations",
    ],
    requirements: [
      "Valid EU identity documents",
      "Previous site experience is a plus",
      "Safety-conscious mindset",
    ],
    offer: [
      "German social security and insurance",
      "Competitive hourly rates",
      "Long-term project stability",
    ],
  }
];

export const jobSectors = [...new Set(jobs.map((j) => j.sector))];
export const jobCountries = ["Netherlands", "Germany"] as const;
export const jobCities = [...new Set(jobs.map((j) => j.city))];
export const shiftTypes = ["Day shift", "Two shifts", "Three shifts / nights"] as const;

export function getJob(slug: string) {
  return jobs.find((j) => j.slug === slug);
}

export function shiftType(j: Job) {
  if (j.schedule.toLowerCase().includes("three") || j.schedule.toLowerCase().includes("night")) return "Three shifts / nights";
  if (j.schedule.toLowerCase().includes("two")) return "Two shifts";
  return "Day shift";
}

export function minPay(j: Job) {
  const match = j.pay.match(/€(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

export function isEntryLevel(j: Job) {
  return !j.requirements.some((r) => r.toLowerCase().includes("certified") || r.toLowerCase().includes("years experience"));
}

export function hasHousing(j: Job) {
  return j.housing.toLowerCase().includes("arranged") || j.housing.toLowerCase().includes("available") || j.housing.toLowerCase().includes("organized");
}

export function startsSoon(j: Job) {
  return j.start.toLowerCase().includes("within") || j.start.toLowerCase().includes("immediate") || j.start.toLowerCase().includes("weekly");
}
