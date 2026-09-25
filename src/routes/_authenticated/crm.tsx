import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyRoles, isAdminRole, ROLE_LABELS, type Role } from "@/lib/crm";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/_authenticated/crm")({
  head: () => ({
    meta: [
      { title: "CRM — IONMAN Workforce" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CrmLayout,
});

function CrmLayout() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const roles = useQuery({ queryKey: ["my-roles"], queryFn: fetchMyRoles });

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/portal", replace: true });
  }

  const isAdmin = isAdminRole(roles.data);
  const link = "rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-glass";

  return (
    <div className="bg-page-glow min-h-screen text-brand">
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
        <div className="flex flex-wrap items-center gap-6">
          <Logo />
          <nav className="flex flex-wrap gap-1">
            <Link to="/crm/my" className={link} activeProps={{ className: "bg-glass-strong" }}>
              My work
            </Link>
            <Link to="/crm" activeOptions={{ exact: true }} className={link} activeProps={{ className: "bg-glass-strong" }}>
              Candidates
            </Link>
            <Link to="/crm/employers" className={link} activeProps={{ className: "bg-glass-strong" }}>
              Employer leads
            </Link>
            {isAdmin && (
              <>
                <Link to="/crm/assign" className={link} activeProps={{ className: "bg-glass-strong" }}>
                  Assign leads
                </Link>
                <Link to="/crm/admin" className={link} activeProps={{ className: "bg-glass-strong" }}>
                  Admin
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            {user.email} · {roles.data?.map((r) => ROLE_LABELS[r as Role] ?? r).join(", ") || "no access"}
          </span>
          <button onClick={handleSignOut} className="rounded-full border border-glass-border px-4 py-2 font-medium">
            Sign out
          </button>
        </div>
      </header>
      <main className="px-6 pb-16 lg:px-10">
        {roles.isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : roles.data && roles.data.length > 0 ? (
          <Outlet />
        ) : (
          <div className="glass-card mx-auto mt-10 max-w-lg p-8 text-center">
            <h1 className="font-display text-xl font-bold">Waiting for access</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account exists, but an admin still needs to give you a role in the Team page.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
