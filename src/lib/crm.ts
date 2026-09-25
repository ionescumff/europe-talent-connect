import { supabase } from "@/integrations/supabase/client";

export const CANDIDATE_STATUSES = ["new", "contacted", "interview", "matched", "placed", "rejected"] as const;

export const ROLES = ["admin", "cofounder", "manager", "recruiter", "agency"] as const;
export type Role = (typeof ROLES)[number];
export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  cofounder: "Co-founder",
  manager: "Manager",
  recruiter: "Associate / Recruiter",
  agency: "Partner agency",
};

export const isAdminRole = (roles?: string[]) => !!roles?.some((r) => r === "admin" || r === "cofounder");

export async function fetchMyRoles(): Promise<string[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
  return (data ?? []).map((r) => r.role);
}

export type TeamMember = {
  user_id: string;
  email: string;
  full_name: string | null;
  manager_id: string | null;
  created_at: string;
  role?: Role | undefined;
};

export async function fetchTeam(): Promise<TeamMember[]> {
  const [{ data: profiles }, { data: roles }] = await Promise.all([
    supabase.from("staff_profiles").select("*").order("created_at"),
    supabase.from("user_roles").select("user_id, role"),
  ]);
  return (profiles ?? []).map((p) => ({
    ...p,
    role: (roles ?? []).find((r) => r.user_id === p.user_id)?.role as Role | undefined,
  }));
}

export const memberName = (team: TeamMember[] | undefined, id: string | null) => {
  if (!id) return "Unassigned";
  const m = team?.find((t) => t.user_id === id);
  return m ? m.full_name || m.email : "Unknown";
};

export async function signOut() {
  await supabase.auth.signOut();
}
