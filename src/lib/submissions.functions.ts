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
  privacyAccepted: z.literal("on", { message: "Please acknowledge the privacy notice" }),
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
      privacyAccepted: data.get("privacyAccepted"),
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

    const { data: submission, error: insertError } = await supabaseAdmin.from("cv_submissions").insert({
      full_name: fields.fullName,
      phone: fields.phone,
      email: fields.email || null,
      sector: fields.sector,
      country_preference: fields.country,
      message: fields.message || null,
      cv_path: path,
      cv_filename: file.name,
      applied_job: fields.appliedJob || null,
    }).select("id").single();
    if (insertError) {
      console.error("CV insert failed", insertError);
      throw new Error("We couldn't save your details. Please try again.");
    }

    // Create a candidate account with a generated password and email the
    // credentials. Never let account/email problems fail the CV submission.
    let accountCreated = false;
    if (fields.email) {
      try {
        accountCreated = await createCandidateAccount(supabaseAdmin, {
          email: fields.email,
          fullName: fields.fullName,
          phone: fields.phone,
          submissionId: submission?.id ?? crypto.randomUUID(),
        });
      } catch (err) {
        console.error("Candidate account creation failed", err);
      }
    }

    return { ok: true as const, accountCreated };
  });

const SITE_URL = "https://europe-talent-connect.lovable.app";

function generatePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const all = upper + lower + digits;
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const pick = (set: string, i: number) => set[bytes[i]! % set.length]!;
  // Guarantee one of each class, then fill randomly.
  const chars = [pick(upper, 0), pick(lower, 1), pick(digits, 2)];
  for (let i = 3; i < 12; i++) chars.push(pick(all, i));
  // Shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = bytes[i]! % (i + 1);
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  return chars.join("");
}

async function createCandidateAccount(
  supabaseAdmin: any,
  { email, fullName, phone, submissionId }: { email: string; fullName: string; phone: string; submissionId: string },
): Promise<boolean> {
  const password = generatePassword();
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { account_type: "candidate", full_name: fullName, phone },
  });
  if (error) {
    // Already registered (or invalid): keep the CV, skip the credentials email.
    console.error("createUser skipped/failed", error.message);
    return false;
  }
  const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
  await sendTemplateEmail("candidate-account", email, {
    templateData: {
      name: fullName,
      email,
      password,
      loginUrl: `${SITE_URL}/candidate-portal`,
    },
    idempotencyKey: `candidate-account-${submissionId}`,
  });
  return true;
}

const vacancySchema = z.object({
  company: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().default(""),
  country: z.enum(["netherlands", "germany", "both"]),
  message: z.string().trim().min(10).max(2000),
  privacyAccepted: z.literal(true, { message: "Please acknowledge the privacy notice" }),
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

const employerMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(2).max(160),
  body: z.string().trim().min(5).max(4000),
  privacyAccepted: z.literal(true),
});

export const submitEmployerMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => employerMessageSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("employer_messages").insert({
      name: data.name, company: data.company, email: data.email,
      phone: data.phone || null, subject: data.subject, body: data.body,
    });
    if (error) {
      console.error("Employer message insert failed", error);
      throw new Error("We couldn't send your message. Please try again.");
    }
    return { ok: true as const };
  });
