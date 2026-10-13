import { z } from "zod";

export const candidateImportSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(160).or(z.literal("")),
  sector: z.string().trim().min(2).max(80),
  country_preference: z.enum(["netherlands", "germany", "both"]),
  message: z.string().trim().max(1000),
  applied_job: z.string().trim().max(120),
});
export type CandidateImportRow = z.infer<typeof candidateImportSchema>;
export const candidateFields = ["full_name", "phone", "email", "sector", "country_preference", "message", "applied_job"] as const;
export const candidateFieldLabels = { full_name: "Full name *", phone: "Phone *", email: "Email", sector: "Sector *", country_preference: "Country preference", message: "Notes", applied_job: "Job ID or slug" };
export const normalizedPhone = (value: string) => value.replace(/\D/g, "").replace(/^00/, "");