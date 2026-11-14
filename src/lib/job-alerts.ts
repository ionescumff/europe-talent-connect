export const alertSectors = ["Construction", "Logistics", "Technical", "Manufacturing", "Cleaning"] as const;
export const sectorLabelsRo: Record<string, string> = { Construction: "Construcții", Logistics: "Logistică", Technical: "Tehnic", Manufacturing: "Producție", Cleaning: "Curățenie" };

export type AlertCriteria = { sectors: string[]; city: string | null; last_sent_at: string };
export type AlertJob = { sector: string; city: string; created_at: string; company_name: string | null };

export const isTriangleJob = (j: Pick<AlertJob, "company_name">) => /^triangle/i.test(j.company_name ?? "");

/** A job matches when it is a Triangle job posted after the last alert, in a chosen sector (none = all) and city (if set). */
export function matchesAlert(alert: AlertCriteria, job: AlertJob): boolean {
  if (!isTriangleJob(job)) return false;
  if (new Date(job.created_at) <= new Date(alert.last_sent_at)) return false;
  if (alert.sectors.length && !alert.sectors.includes(job.sector)) return false;
  const city = alert.city?.trim().toLowerCase();
  if (city && !job.city.toLowerCase().includes(city)) return false;
  return true;
}
