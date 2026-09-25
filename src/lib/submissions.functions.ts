import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MAX_CV_BYTES = 8 * 1024 * 1024;
const ALLOWED_EXT = ["pdf", "doc", "docx"];

const cvSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(160).or(z.literal("")),
  sector: z.string().trim().min(2).max(80),
  country: z.enum(["netherlands", "germany", "both"]),
  message: z.string().trim().max(1000).optional().default(""),
  appliedJob: z.string().trim().max(120).optional().default(""),
});

export const submitCv = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Expected form data");
    const fields = cvSchema.parse({
      fullName: data.get("fullName"),
      phone: data.get("phone"),
      email: data.get("email") ?? "",
      sector: data.get("sector"),
      country: data.get("country"),
      message: data.get("message") ?? "",
      appliedJob: data.get("appliedJob") ?? "",
    });
    const file = data.get("cv");
    if (!(file instanceof File) || file.size === 0) throw new Error("Please attach your CV");
    if (file.size > MAX_CV_BYTES) throw new Error("CV must be under 8 MB");
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXT.includes(ext)) throw new Error("CV must be a PDF or Word document");
    return { fields, file, ext };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { fields, file, ext } = data;

    const safeName = fields.fullName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("cvs")
      .upload(path, await file.arrayBuffer(), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (uploadError) {
      console.error("CV upload failed", uploadError);
      throw new Error("We couldn't save your CV. Please try again.");
    }

    const { error: insertError } = await supabaseAdmin.from("cv_submissions").insert({
      full_name: fields.fullName,
      phone: fields.phone,
      email: fields.email || null,
      sector: fields.sector,
      country_preference: fields.country,
      message: fields.message || null,
      cv_path: path,
      cv_filename: file.name,
      applied_job: fields.appliedJob || null,
    });
    if (insertError) {
      console.error("CV insert failed", insertError);
      throw new Error("We couldn't save your details. Please try again.");
    }

    return { ok: true as const };
  });

const vacancySchema = z.object({
  company: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().default(""),
  country: z.enum(["netherlands", "germany", "both"]),
  message: z.string().trim().min(10).max(2000),
});

export const submitVacancy = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => vacancySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("vacancy_enquiries").insert({
      company: data.company,
      contact_name: data.contactName,
      email: data.email,
      phone: data.phone || null,
      country: data.country,
      message: data.message,
    });
    if (error) {
      console.error("Vacancy insert failed", error);
      throw new Error("We couldn't send your brief. Please try again.");
    }
    return { ok: true as const };
  });
