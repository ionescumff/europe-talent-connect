import { supabase } from "@/integrations/supabase/client";

export const CANDIDATE_STATUSES = ["new", "contacted", "interview", "matched", "placed", "rejected"] as const;

export async function fetchMyRoles(): Promise<string[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
  return (data ?? []).map((r) => r.role);
}

export async function signOut() {
  await supabase.auth.signOut();
}
