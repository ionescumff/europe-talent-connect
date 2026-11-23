import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { JOB_COLUMNS, emptyBulkJob, reviewBulkJobs, bulkJobRecord, type BulkJob, type JobIdentity } from "./job-bulk";

const rowSchema = z.object(Object.fromEntries(JOB_COLUMNS.map(([key]) => [key, z.string().max(20000)])));

export const importBulkJobs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ jobs: z.array(rowSchema).min(1).max(500), published: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: admin, error: roleError } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
    if (roleError || !admin) throw new Error("Only co-founders and admins can import jobs");
    const existing: JobIdentity[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data: page, error } = await context.supabase.from("job_posts").select("title,company_name,city").order("id").range(offset, offset + 999);
      if (error) throw new Error("Could not check existing jobs. Nothing was imported.");
      existing.push(...(page ?? []));
      if (!page || page.length < 1000) break;
    }
    const jobs: BulkJob[] = data.jobs.map(row => ({ ...emptyBulkJob(), ...row }));
    const errors = reviewBulkJobs(jobs, existing);
    const invalid = errors.flatMap((issues, i) => issues.length ? [`Row ${i + 1}: ${issues.join("; ")}`] : []);
    if (invalid.length) throw new Error(`${invalid.slice(0, 5).join("\n")}\nNothing was imported. Correct or deselect these rows.`);
    const rows = jobs.map(job => ({
      ...bulkJobRecord(job, data.published), created_by: context.userId,
      slug: `${`${job.title} ${job.city}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "job"}-${crypto.randomUUID()}`,
    }));
    const { data: inserted, error } = await context.supabase.from("job_posts").insert(rows).select("id,slug");
    if (error) throw new Error("The batch could not be saved. Refresh and check the jobs list before retrying.");
    return { count: inserted.length, published: data.published, slugs: inserted.map(row => row.slug) };
  });