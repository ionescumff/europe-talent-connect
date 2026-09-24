import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — IONMAN Workforce" },
      { name: "description", content: "Choose a new password for your IONMAN Workforce staff account." },
      { property: "og:title", content: "Set a new password — IONMAN Workforce" },
      { property: "og:description", content: "Choose a new password for your IONMAN Workforce staff account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setReady(Boolean(data.session));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const password = String(f.get("password"));
    if (password !== String(f.get("confirm"))) {
      toast.error("The two passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated.");
      await navigate({ to: "/crm" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-page-glow flex min-h-screen items-center justify-center px-4 text-brand">
      <div className="glass-card w-full max-w-md p-8">
        <Logo />
        <h1 className="mt-6 font-display text-2xl font-bold">Set a new password</h1>
        {ready ? (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="New password"
              className="field w-full"
              autoComplete="new-password"
            />
            <input
              name="confirm"
              type="password"
              required
              minLength={8}
              placeholder="Repeat new password"
              className="field w-full"
              autoComplete="new-password"
            />
            <button
              disabled={busy}
              className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-accent disabled:opacity-60"
            >
              {busy ? "Please wait…" : "Save new password"}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Open this page from the reset link in your email. If the link has expired, request a new
            one from the staff portal.
          </p>
        )}
      </div>
    </div>
  );
}
