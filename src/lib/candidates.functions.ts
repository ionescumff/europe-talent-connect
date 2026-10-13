import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { candidateImportSchema, normalizedPhone } from "./candidate-import";

export const importCandidates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ rows: z.array(candidateImportSchema).min(1).max(300), jobId: z.string().uuid().optional(), authorized: z.literal(true) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: admin, error: roleError } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
    if (roleError || !admin) throw new Error("Only admins and co-founders can import candidates");
    const [{ data: existing, error }, { data: jobs, error: jobsError }] = await Promise.all([
      context.supabase.from("cv_submissions").select("phone, email"),
      context.supabase.from("job_posts").select("id, slug"),
    ]);
    if (error || jobsError) throw new Error("Could not check existing candidates and vacancies");
    const target = data.jobId ? jobs?.find((j) => j.id === data.jobId) : undefined;
    if (data.jobId && !target) throw new Error("Vacancy not found");
    const phones = new Set(existing?.map((c) => normalizedPhone(c.phone)));
    const emails = new Set(existing?.flatMap((c) => c.email ? [c.email.trim().toLowerCase()] : []));
    const rejected: { row: number; reason: string }[] = [];
    const rows = data.rows.flatMap((row, index) => {
      const phone = normalizedPhone(row.phone);
      const email = row.email.toLowerCase();
      if (phone.length < 6) { rejected.push({ row: index + 1, reason: "Invalid phone number" }); return []; }
      if (phones.has(phone) || (email && emails.has(email))) { rejected.push({ row: index + 1, reason: "Duplicate phone or email" }); return []; }
      const job = target ?? (row.applied_job ? jobs?.find((j) => j.slug === row.applied_job || j.id === row.applied_job) : undefined);
      if (row.applied_job && !job) { rejected.push({ row: index + 1, reason: "Unknown vacancy ID or slug" }); return []; }
      phones.add(phone); if (email) emails.add(email);
      return [{ ...row, email: email || null, message: row.message || null, applied_job: job ? job.slug ?? job.id : null }];
    });
    if (!rows.length) return { imported: 0, rejected };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: insertError } = await supabaseAdmin.from("cv_submissions").insert(rows);
    if (insertError) throw new Error(`Candidate import failed: ${insertError.message}`);
    return { imported: rows.length, rejected };
  });

export const attachCandidateCv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    if (!(input instanceof FormData)) throw new Error("Expected CV upload");
    const id = z.string().uuid().parse(input.get("id"));
    const file = input.get("cv");
    if (!(file instanceof File) || !file.size || file.size > 8 * 1024 * 1024) throw new Error("Choose a CV under 8 MB");
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "doc", "docx"].includes(ext)) throw new Error("Choose a PDF or Word CV");
    return { id, file, ext };
  })
  .handler(async ({ data, context }) => {
    const { data: allowed, error } = await context.supabase.rpc("can_edit_candidate", { _user_id: context.userId, _candidate: data.id });
    if (error || !allowed) throw new Error("You cannot update this candidate's CV");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const path = `${data.id}/${crypto.randomUUID()}.${data.ext}`;
    const { error: uploadError } = await supabaseAdmin.storage.from("cvs").upload(path, await data.file.arrayBuffer(), { contentType: data.file.type || "application/octet-stream" });
    if (uploadError) throw new Error(`CV upload failed: ${uploadError.message}`);
    const { data: updated, error: updateError } = await context.supabase.from("cv_submissions").update({ cv_path: path, cv_filename: data.file.name }).eq("id", data.id).select("id").single();
    if (updateError || !updated) {
      await supabaseAdmin.storage.from("cvs").remove([path]);
      throw new Error("Could not attach the CV to this candidate");
    }
    return { ok: true };
  });