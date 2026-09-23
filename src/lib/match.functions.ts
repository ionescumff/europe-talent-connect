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

    const content: Array<Record<string, unknown>> = [
      {
        type: "text",
        text: `Candidate profile:
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

Rank the 3 best-fitting jobs for this candidate based on their CV (attached if available) and profile. Be honest; low scores are fine.`,
      },
    ];

    if (c.cv_path && c.cv_filename?.toLowerCase().endsWith(".pdf")) {
      const { data: file } = await context.supabase.storage.from("cvs").download(c.cv_path);
      if (file) {
        const b64 = Buffer.from(await file.arrayBuffer()).toString("base64");
        content.push({ type: "image_url", image_url: { url: `data:application/pdf;base64,${b64}` } });
      }
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a recruiter assistant for a staffing agency placing Romanian workers in the Netherlands and Germany." },
          { role: "user", content },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_matches",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "2-sentence summary of the candidate's experience and skills" },
                  matches: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        slug: { type: "string" },
                        score: { type: "number", description: "0-100 fit" },
                        reason: { type: "string" },
                      },
                      required: ["slug", "score", "reason"],
                    },
                  },
                },
                required: ["summary", "matches"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_matches" } },
      }),
    });
    if (res.status === 429) throw new Error("Too many requests, try again in a minute.");
    if (res.status === 402) throw new Error("AI credits are used up for this workspace.");
    if (!res.ok) throw new Error("Matching failed");
    const json = await res.json();
    const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("Matching failed");
    const parsed = JSON.parse(args) as MatchResult;
    parsed.matches = parsed.matches
      .filter((m) => jobs.some((j) => j.slug === m.slug))
      .sort((a, b) => b.score - a.score);
    return parsed;
  });
