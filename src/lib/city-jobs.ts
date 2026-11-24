import type { Job } from "./jobs";

export const cityCountries = {
  netherlands: { country: "Netherlands", ro: "Olanda", region: "NL" },
  germany: { country: "Germany", ro: "Germania", region: "DE" },
} as const;
export type CityCountry = keyof typeof cityCountries;
export function isCityCountry(value: string): value is CityCountry {
  return value === "netherlands" || value === "germany";
}
export function citySlug(city: string): string {
  return city.trim().toLowerCase().replace(/ß/g, "ss").normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export function jobsInCity(jobs: Job[], country: CityCountry, city: string): Job[] {
  return jobs.filter(job => job.country === cityCountries[country].country && citySlug(job.city) === citySlug(city));
}
export function vacancyCities(jobs: Pick<Job, "city" | "country">[]) {
  const cities = new Map<string, { country: CityCountry; slug: string; name: string; count: number }>();
  for (const job of jobs) {
    const country = job.country === "Germany" ? "germany" : "netherlands";
    const slug = citySlug(job.city);
    if (!slug) continue;
    const key = `${country}/${slug}`;
    const existing = cities.get(key);
    if (existing) existing.count += 1;
    else cities.set(key, { country, slug, name: job.city.trim(), count: 1 });
  }
  return [...cities.values()].sort((a, b) => a.name.localeCompare(b.name));
}
export function cityPageUrl(country: CityCountry, slug: string) {
  return `https://www.vreaujobs.com/jobs/cities/${country}/${encodeURIComponent(citySlug(slug))}`;
}
export function cityDisplayName(slug: string) {
  return slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}