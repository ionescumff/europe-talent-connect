import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { candidateProfileSchema, portalDataSchema } from "./candidate-portal";

export const getCandidatePortal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("candidate_portal_data");
    if (error) throw new Error("We couldn't load your applications. Confirm your email and try again.");
    return portalDataSchema.parse(data);
  });

export const saveCandidateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => candidateProfileSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.rpc("update_candidate_profile", { _full_name: data.full_name, _phone: data.phone });
    if (error) throw new Error("We couldn't save your profile. Please try again.");
    return { ok: true };
  });