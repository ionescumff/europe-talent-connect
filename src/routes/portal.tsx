import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Staff portal — IONMAN Workforce" },
      { name: "description", content: "Private staff sign-in for the IONMAN Workforce CRM." },
      { property: "og:title", content: "Staff portal — IONMAN Workforce" },
      { property: "og:description", content: "Private staff sign-in for the IONMAN Workforce CRM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Portal,
});

function Portal() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/crm" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal`,
            data: { full_name: String(f.get("fullName") ?? "") },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm, then sign in. An admin must grant you access.");
        setMode("signin");
      }
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
        <h1 className="mt-6 font-display text-2xl font-bold">Staff portal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to the IONMAN CRM." : "Request a staff account."}
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <input name="fullName" required placeholder="Full name" className="field w-full" />
          )}
          <input name="email" type="email" required placeholder="Work email" className="field w-full" autoComplete="email" />
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Password"
            className="field w-full"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />
          <button
            disabled={busy}
            className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-accent disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {mode === "signin" ? "New team member? Request access" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
