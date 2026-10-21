import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { LangSwitch, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/candidate-portal")({
  head: () => ({ meta: [
    { title: "Candidate sign-in — IONMAN Workforce" },
    { name: "description", content: "Sign in to your candidate account to follow your application and access a CV template." },
    { property: "og:title", content: "Candidate sign-in — IONMAN Workforce" },
    { property: "og:description", content: "Your recruitment journey with IONMAN Workforce." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: CandidateSignIn,
});

function CandidateSignIn() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const identity = useQuery({ queryKey: ["portal-identity"], queryFn: async () => (await supabase.auth.getUser()).data.user });
  useEffect(() => { if (identity.data) void navigate({ to: "/candidate-account", replace: true }); }, [identity.data, navigate]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(""); setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password") ?? "");
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password?candidate=true` });
        if (error) throw error;
        setNotice(t("If an account exists, a password reset link is on its way.", "Dacă există un cont, vei primi un link pentru resetarea parolei."));
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: {
          emailRedirectTo: `${window.location.origin}/candidate-portal`,
          data: { account_type: "candidate", full_name: String(form.get("full_name")), phone: String(form.get("phone") ?? "") },
        } });
        if (error) throw error;
        if (data.session) await navigate({ to: "/candidate-account" });
        else setNotice(t("Check your email to confirm your account, then sign in.", "Verifică emailul pentru a confirma contul, apoi autentifică-te."));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/candidate-account" });
      }
    } catch { setError(t("We couldn't complete this request. Check your details or try again shortly.", "Nu am putut finaliza cererea. Verifică datele sau încearcă din nou în curând.")); }
    finally { setBusy(false); }
  }
  function changeMode(next: typeof mode) { setMode(next); setNotice(""); setError(""); }

  return <div className="candidate-site min-h-screen bg-background text-foreground">
    <header className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-6"><Logo /><LangSwitch /></header>
    <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-2 md:gap-16 md:py-20">
      <section className="min-w-0">
        <p className="mb-5 text-sm font-semibold text-muted-foreground">{t("YOUR NEXT CHAPTER", "URMĂTORUL TĂU CAPITOL")}</p>
        <h1 className="max-w-lg font-display text-4xl font-bold leading-tight md:text-5xl">{t("Your candidate portal", "Contul tău de candidat")}</h1>
        <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">{t("Stay in touch with your application.", "Fii la curent cu candidatura ta.")}</p>
        <div className="mt-8 flex items-center gap-3 border-t border-border pt-6"><ShieldCheck className="size-6 text-primary" /><span>{t("No recruitment fee to candidates", "Fără taxe de recrutare pentru candidați")}</span></div>
        <Button asChild variant="link" className="mt-6 h-auto p-0"><Link to="/jobs">{t("Explore available jobs", "Vezi locurile de muncă")}<ArrowRight /></Link></Button>
      </section>
      <section className="min-w-0 border-t border-border pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
        <h2 className="font-display text-2xl font-bold">{mode === "signup" ? t("Create your account", "Creează-ți contul") : mode === "reset" ? t("Reset password", "Resetează parola") : t("Welcome back", "Bine ai revenit")}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("Use the same email address you used when applying.", "Folosește aceeași adresă de email cu care ai aplicat.")}</p>
        <form onSubmit={submit} className="mt-6 space-y-5">
          {mode === "signup" && <>
            <label className="block text-sm font-medium">{t("Full name", "Nume complet")}<input name="full_name" autoComplete="name" required minLength={2} maxLength={120} className="field mt-2 w-full" /></label>
            <label className="block text-sm font-medium">{t("Phone (optional)", "Telefon (opțional)")}<input name="phone" type="tel" autoComplete="tel" maxLength={40} className="field mt-2 w-full" /></label>
          </>}
          <label className="block text-sm font-medium">Email<input name="email" type="email" autoComplete="email" required className="field mt-2 w-full" /></label>
          {mode !== "reset" && <label className="block text-sm font-medium">{t("Password", "Parolă")}<input name="password" type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="field mt-2 w-full" /></label>}
          {mode === "signup" && <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" required className="mt-1 size-4 shrink-0" /><span>{t("I have read the", "Am citit")} <Link to="/privacy" className="underline">{t("privacy notice", "nota de confidențialitate")}</Link>.</span></label>}
          {notice && <p role="status" className="border-l-2 border-accent bg-muted p-4 text-sm leading-6">{notice}</p>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={busy} className="h-12 w-full">{busy ? t("Please wait…", "Te rugăm să aștepți…") : mode === "signup" ? t("Create account", "Creează cont") : mode === "reset" ? t("Send reset link", "Trimite linkul") : t("Sign in", "Autentificare")}<ArrowRight /></Button>
        </form>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
          <Button variant="link" className="h-auto whitespace-normal p-0 text-left" onClick={() => changeMode(mode === "signup" ? "signin" : "signup")}>{mode === "signup" ? t("Already have an account?", "Ai deja un cont?") : t("Create an account", "Creează un cont")}</Button>
          <Button variant="link" className="h-auto whitespace-normal p-0 text-left" onClick={() => changeMode(mode === "reset" ? "signin" : "reset")}>{mode === "reset" ? t("Back to sign in", "Înapoi la autentificare") : t("Forgot password?", "Ai uitat parola?")}</Button>
        </div>
        <div className="mt-10 flex items-center gap-3 border-t border-border pt-6 text-sm text-muted-foreground"><FileText className="size-5 shrink-0" />{t("Your applications. Your next step.", "Candidaturile tale. Următorul tău pas.")}</div>
      </section>
    </main>
  </div>;
}