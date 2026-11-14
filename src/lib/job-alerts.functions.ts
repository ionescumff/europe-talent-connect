import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { alertSectors } from "./job-alerts";

const alertInput = z.object({
  sectors: z.array(z.enum(alertSectors)).max(alertSectors.length),
  city: z.string().trim().max(80).nullable(),
  lang: z.enum(["ro", "en"]),
  active: z.boolean(),
});

export const getJobAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("job_alerts").select("sectors, city, lang, active").eq("user_id", context.userId).maybeSingle();
    if (error) throw new Error("Couldn't load your job alert.");
    return data;
  });

export const saveJobAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => alertInput.parse(d))
  .handler(async ({ context, data }) => {
    const email = context.claims.email as string | undefined;
    if (!email) throw new Error("Your account has no email address.");
    const { data: existing } = await context.supabase.from("job_alerts").select("id").eq("user_id", context.userId).maybeSingle();
    const row = { sectors: data.sectors, city: data.city || null, lang: data.lang, active: data.active, email };
    const { error } = existing
      ? await context.supabase.from("job_alerts").update(row).eq("user_id", context.userId)
      : await context.supabase.from("job_alerts").insert({ ...row, user_id: context.userId });
    if (error) throw new Error("Couldn't save your job alert.");
    return { ok: true };
  });
