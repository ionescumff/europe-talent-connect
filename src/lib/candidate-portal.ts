import { z } from "zod";

export const portalDataSchema = z.object({
  profile: z.object({ full_name: z.string(), phone: z.string() }).nullable(),
  applications: z.array(z.object({
    id: z.string(), created_at: z.string(), status: z.string(), sector: z.string(), country_preference: z.string(),
    jobs: z.array(z.object({ title: z.string(), city: z.string(), country: z.string() })),
  })),
});
export const candidateProfileSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40),
});
export const applicationStages = ["new", "contacted", "interview", "matched", "placed"] as const;
export function applicationProgress(status: string) {
  return applicationStages.findIndex((stage) => stage === status);
}
export const statusLabels: Record<string, [string, string]> = {
  new: ["Application received", "Candidatură primită"],
  contacted: ["Contacted", "Contactat"],
  interview: ["Interview", "Interviu"],
  matched: ["Matched to a vacancy", "Potrivit pentru un post"],
  placed: ["Placed", "Angajat"],
  rejected: ["Not selected", "Neselectat"],
};