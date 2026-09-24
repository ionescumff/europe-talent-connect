import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { jobs } from "./jobs";

export type JobMatch = { slug: string; score: number; reason: string };
export type MatchResult = { summary: string; matches: JobMatch[] };

export const matchCandidate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<MatchResult> => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) throw new Error("Not allowed");

    const { data: c, error } = await context.supabase
      .from("cv_submissions")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !c) throw new Error("Candidate not found");

    const prompt = `You are a recruiter assistant for a staffing agency placing Romanian workers in the Netherlands and Germany.
Candidate profile:
Name: ${c.full_name}
Preferred sector: ${c.sector}
Preferred country: ${c.country_preference}
Message: ${c.message ?? "-"}

Open jobs (JSON):
${JSON.stringify(
  jobs.map((j) => ({
    slug: j.slug, title: j.title, sector: j.sector, country: j.country, city: j.city,
    language: j.language, schedule: j.schedule, requirements: j.requirements, tasks: j.tasks,
  })),
)}

Using the attached CV (if any) and the profile, write a 2-sentence summary of the candidate and rank the 3 best-fitting jobs with a 0-100 score and a short reason. Be honest; low scores are fine.`;

    const content: Array<Record<string, unknown>> = [{ type: "input_text", text: prompt }];
    if (c.cv_path && c.cv_filename?.toLowerCase().endsWith(".pdf")) {
      const { data: file } = await context.supabase.storage.from("cvs").download(c.cv_path);
      if (file) {
        const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
        content.push({ type: "input_file", filename: c.cv_filename, file_data: `data:application/pdf;base64,${b64}` });
      }
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": process.env["LOVABLE_API_KEY"] ?? "",
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        input: [{ role: "user", content }],
        stream: true,
        reasoning: { effort: "low" },
        text: {
          format: {
            type: "json_schema",
            name: "matches",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["summary", "matches"],
              properties: {
                summary: { type: "string" },
                matches: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["slug", "score", "reason"],
                    properties: { slug: { type: "string" }, score: { type: "number" }, reason: { type: "string" } },
                  },
                },
              },
            },
          },
        },
      }),
    });
    if (res.status === 429) throw new Error("Too many requests, try again in a minute.");
    if (res.status === 402) throw new Error("AI credits are used up for this workspace.");
    if (!res.ok || !res.body) throw new Error(`Matching failed (${res.status})`);

    let text = "";
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const ev = JSON.parse(payload);
          if (ev.type === "response.output_text.delta") text += ev.delta;
        } catch { /* ignore */ }
      }
    }
    if (!text) throw new Error("Matching returned no result");
    const parsed = JSON.parse(text) as MatchResult;
    parsed.matches = parsed.matches
      .filter((m) => jobs.some((j) => j.slug === m.slug))
      .sort((a, b) => b.score - a.score);
    return parsed;
  });
