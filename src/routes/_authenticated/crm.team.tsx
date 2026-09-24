import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/crm/team")({
  component: Team,
});

type Role = "admin" | "recruiter";

function Team() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from("staff_profiles").select("*").order("created_at"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      return (profiles ?? []).map((p) => ({
        ...p,
        role: (roles ?? []).find((r) => r.user_id === p.user_id)?.role as Role | undefined,
      }));
    },
  });

  async function setRole(userId: string, role: Role | "none") {
    const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (delErr) { toast.error("Only admins can change roles"); return; }
    if (role !== "none") {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) { toast.error("Could not set role"); return; }
    }
    toast.success("Role updated");
    qc.invalidateQueries({ queryKey: ["team"] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Team</h1>
        <p className="text-sm text-muted-foreground">
          New staff request access on the portal; give them a role here. Recruiters manage candidates; admins also manage the team.
        </p>
      </div>
      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      <div className="glass-card divide-y divide-glass-border">
        {data?.map((m) => (
          <div key={m.user_id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <div>
              <p className="font-semibold">{m.full_name || m.email}</p>
              <p className="text-muted-foreground">{m.email}</p>
            </div>
            <select
              value={m.role ?? "none"}
              disabled={m.user_id === user.id}
              onChange={(e) => setRole(m.user_id, e.target.value as Role | "none")}
              className="field"
            >
              <option value="none">No access</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
