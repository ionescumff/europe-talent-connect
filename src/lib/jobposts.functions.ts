import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { Job } from "./jobs";

export type JobDraft = {
  title: string; sector: string; country: string; city: string; salary: string;
  company_name: string; company_details: string; description: string;
  contract: string; schedule: string; start_date: string; housing: string;
  transport: string; language: string; openings: number;
  tasks: string[]; requirements: string[]; benefits: string[];
};

const str = { type: "string" };
const arr = { type: "array", items: str };
const draftSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "sector", "country", "city", "salary", "company_name", "company_details", "description", "contract", "schedule", "start_date", "housing", "transport", "language", "openings", "tasks", "requirements", "benefits"],
  properties: {
    title: str, sector: { type: "string", enum: ["Warehousing & fulfilment", "Production & food", "Logistics & site work", "Construction support"] },
    country: { type: "string", enum: ["Netherlands", "Germany"] }, city: str, salary: str,
    company_name: str, company_details: str, description: str, contract: str, schedule: str,
    start_date: str, housing: str, transport: str, language: str, openings: { type: "number" },
    tasks: arr, requirements: arr, benefits: arr,
  },
};

export const extractJobPosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ images: z.array(z.string().max(6_000_000)).max(6), text: z.string().max(200_000).optional() }).parse(d),
  )
  .handler(async ({ data, context }): Promise<JobDraft[]> => {
    const { data: admin } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
    if (!admin) throw new Error("Only co-founders and admins can import job posts");

    const content: Array<Record<string, unknown>> = [{
      type: "input_text",
      text: `Extract every job posting from the attached material (photos of job ads or spreadsheet rows) for a staffing agency placing EU workers in the Netherlands and Germany. Return one entry per distinct job. Only use information present in the material; use an empty string or empty list when something is missing — never invent pay, company names or facts. Write in clear English. "description" = 1-2 sentence summary.${data.text ? `\n\nSpreadsheet content (CSV):\n${data.text}` : ""}`,
    }];
    for (const img of data.images) content.push({ type: "input_image", image_url: img });

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": process.env["LOVABLE_API_KEY"] ?? "", "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        input: [{ role: "user", content }],
        reasoning: { effort: "low" },
        text: { format: { type: "json_schema", name: "jobs", strict: true, schema: {
          type: "object", additionalProperties: false, required: ["jobs"],
          properties: { jobs: { type: "array", items: draftSchema } },
        } } },
      }),
    });
    if (res.status === 429) throw new Error("Too many requests, try again in a minute.");
    if (res.status === 402) throw new Error("AI credits are used up for this workspace.");
    if (!res.ok) throw new Error(`Import failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
    const json = await res.json();
    const text: string = json.output_text
      ?? json.output?.flatMap((o: { content?: { text?: string }[] }) => o.content ?? []).map((c: { text?: string }) => c.text ?? "").join("") ?? "";
    if (!text) throw new Error("The AI found nothing to import");
    return (JSON.parse(text) as { jobs: JobDraft[] }).jobs;
  });

type Row = Database["public"]["Tables"]["job_posts"]["Row"];

export function rowToJob(r: Row): Job {
  return {
    slug: r.slug ?? r.id, title: r.title, sector: r.sector,
    country: (r.country === "Germany" ? "Germany" : "Netherlands"), city: r.city, pay: r.salary,
    contract: r.contract || "Discussed with your recruiter", schedule: r.schedule || "Discussed with your recruiter",
    start: r.start_date || "To be confirmed", housing: r.housing || "Not specified",
    transport: r.transport || "Not specified", language: r.language || "Not specified",
    openings: r.openings, summary: r.description || "", tasks: r.tasks, requirements: r.requirements, offer: r.benefits,
    image: r.image_url ?? undefined, company: r.company_name ?? undefined, companyDetails: r.company_details ?? undefined,
  };
}

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    } },
  });
}

export const listPublishedJobs = createServerFn({ method: "GET" }).handler(async (): Promise<Job[]> => {
  const { data, error } = await publicClient().from("job_posts").select("*").eq("published", true).eq("status", "open").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return (data ?? []).map(rowToJob);
});
