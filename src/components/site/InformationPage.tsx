import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { useLang } from "@/lib/i18n";

export function InformationPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  const { t } = useLang();
  return (
    <div id="top" className="public-site min-h-screen">
      <Nav />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-12 md:px-8 lg:pt-20">
        <Link to="/" className="text-sm font-semibold text-brand/60 transition-colors hover:text-brand">
          {t("← Back to home", "← Înapoi la pagina principală")}
        </Link>
        <header className="max-w-3xl py-10">
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-6xl">{title}</h1>
          <p className="mt-5 text-base leading-7 text-brand/70 md:text-lg">{intro}</p>
        </header>
        <div className="space-y-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export function InformationSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-brand/10 pt-7">
      <h2 className="font-display text-xl font-bold md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-brand/70 md:text-base">{children}</div>
    </section>
  );
}
