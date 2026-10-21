export type SiteLanguage = "en" | "ro";
export function resolveSiteLanguage(saved: string | null): SiteLanguage {
  return saved === "en" ? "en" : "ro";
}
