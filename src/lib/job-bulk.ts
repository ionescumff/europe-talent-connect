export const JOB_COLUMNS = [
  ["title", "Job Title", ["title", "titlu", "pozitie", "post", "role"]],
  ["company_name", "Company / Employer", ["company", "employer", "companie", "angajator"]],
  ["sector", "Sector", ["domeniu", "industry"]],
  ["city", "City", ["oras", "locatie", "location"]],
  ["country", "Country", ["tara", "stat"]],
  ["salary", "Salary / Hourly Rate", ["salary", "pay", "rate", "salariu", "plata"]],
  ["schedule", "Working Hours", ["schedule", "hours", "program", "ore de lucru"]],
  ["contract", "Contract Type", ["contract", "tip contract"]],
  ["description", "Description", ["summary", "descriere", "rezumat"]],
  ["tasks", "Tasks / Duties", ["tasks", "duties", "sarcini", "responsabilitati"]],
  ["requirements", "Requirements", ["cerinte", "conditii"]],
  ["benefits", "Benefits", ["offer", "beneficii", "oferta"]],
  ["housing", "Housing", ["accommodation", "cazare"]],
  ["transport", "Transport", []],
  ["language", "Language", ["limba"]],
  ["start_date", "Start Date", ["start", "data incepere"]],
  ["openings", "Openings", ["vacancies", "locuri", "numar locuri"]],
  ["company_details", "Company Details", ["despre companie"]],
  ["source_url", "Source URL", ["source", "sursa", "link"]],
  ["ro_title", "RO Title", ["titlu ro", "titlu romana"]],
  ["ro_sector", "RO Sector", ["domeniu ro"]],
  ["ro_salary", "RO Salary", ["salariu ro"]],
  ["ro_schedule", "RO Working Hours", ["program ro"]],
  ["ro_contract", "RO Contract", ["contract ro"]],
  ["ro_description", "RO Description", ["descriere ro"]],
  ["ro_tasks", "RO Tasks", ["sarcini ro"]],
  ["ro_requirements", "RO Requirements", ["cerinte ro"]],
  ["ro_benefits", "RO Benefits", ["beneficii ro"]],
  ["ro_housing", "RO Housing", ["cazare ro"]],
  ["ro_transport", "RO Transport", ["transport ro"]],
  ["ro_language", "RO Language", ["limba ro"]],
  ["ro_start_date", "RO Start Date", ["data incepere ro"]],
  ["ro_company_details", "RO Company Details", ["despre companie ro"]],
] as const;

export type JobColumn = (typeof JOB_COLUMNS)[number][0];
export type BulkJob = Record<JobColumn, string>;
export type JobIdentity = { title: string; company_name: string | null; city: string };
export const normalizeHeader = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
export const jobKey = (j: JobIdentity) => [j.title, j.company_name ?? "", j.city].map(s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ").toLowerCase()).join("\u001f");
export const splitJobLines = (s: string) => s.split(/\r?\n|;/).map(v => v.trim()).filter(Boolean);
export const emptyBulkJob = (): BulkJob => Object.fromEntries(JOB_COLUMNS.map(([key]) => [key, ""])) as BulkJob;

export function matchJobColumns(headers: string[]): Record<JobColumn, number> {
  return Object.fromEntries(JOB_COLUMNS.map(([key, label, aliases]) => [key, headers.findIndex(header => [key, label, ...aliases].some(alias => normalizeHeader(alias) === normalizeHeader(header)))])) as Record<JobColumn, number>;
}

export function mapJobRow(row: string[], mapping: Record<JobColumn, number>): BulkJob {
  return Object.fromEntries(JOB_COLUMNS.map(([key]) => [key, (row[mapping[key]] ?? "").trim()])) as BulkJob;
}

export function validateBulkJob(job: BulkJob): string[] {
  const errors: string[] = [];
  for (const key of ["title", "sector", "city", "country", "salary"] as const) {
    if (!job[key].trim()) errors.push(`${JOB_COLUMNS.find(c => c[0] === key)?.[1] ?? key} is required`);
  }
  if (job.country && !["Netherlands", "Germany"].includes(job.country)) errors.push("Country must be Netherlands or Germany");
  if (job.openings && (!/^\d+$/.test(job.openings) || Number(job.openings) < 1 || Number(job.openings) > 100000)) errors.push("Openings must be a positive whole number (up to 100,000)");
  if (job.source_url) {
    try { if (new URL(job.source_url).protocol !== "https:") errors.push("Source URL must use https"); }
    catch { errors.push("Source URL is invalid"); }
  }
  if (JOB_COLUMNS.some(([key]) => job[key].length > 20000)) errors.push("A cell exceeds 20,000 characters");
  return errors;
}

export function reviewBulkJobs(jobs: BulkJob[], existing: JobIdentity[]) {
  const known = new Set(existing.map(jobKey));
  const seen = new Set<string>();
  return jobs.map(job => {
    const key = jobKey(job);
    const errors = validateBulkJob(job);
    if (known.has(key)) errors.push("Already exists in CRM");
    if (seen.has(key)) errors.push("Duplicate row in this file");
    seen.add(key);
    return errors;
  });
}

export function bulkJobRecord(job: BulkJob, published: boolean) {
  const ro: Record<string, string | string[]> = {};
  const names: Record<string, string> = { salary: "pay", description: "summary", benefits: "offer", start_date: "start", company_details: "companyDetails" };
  for (const [key] of JOB_COLUMNS) {
    if (!key.startsWith("ro_") || !job[key]) continue;
    const base = key.slice(3);
    ro[names[base] ?? base] = ["tasks", "requirements", "benefits"].includes(base) ? splitJobLines(job[key]) : job[key];
  }
  return {
    title: job.title, company_name: job.company_name, sector: job.sector, city: job.city, country: job.country, salary: job.salary,
    schedule: job.schedule, contract: job.contract, description: job.description, tasks: splitJobLines(job.tasks),
    requirements: splitJobLines(job.requirements), benefits: splitJobLines(job.benefits), housing: job.housing, transport: job.transport,
    language: job.language, start_date: job.start_date, openings: job.openings ? Number(job.openings) : 1,
    company_details: job.company_details, source_url: job.source_url || null, translations: Object.keys(ro).length ? { ro } : {},
    status: "open", published,
  };
}