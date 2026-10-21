import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, UserRound, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { LangSwitch, useLang } from "@/lib/i18n";

export function Nav() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/#sectors", label: t("Sectors", "Domenii") },
    { href: "/#process", label: t("How it works", "Cum funcționează") },
    { href: "/#employers", label: "For employers" },
  ];
  return (
    <header className="site-header relative z-20 border-b border-brand/10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-6 py-4 md:px-8 lg:px-14 xl:flex xl:justify-between">
        <Logo />
        <nav aria-label={t("Main navigation", "Navigare principală")} className="hidden min-w-0 items-center gap-6 text-sm font-medium xl:flex">
          <Link to="/jobs" className="transition-colors hover:text-accent">{t("Jobs", "Locuri de muncă")}</Link>
          {links.map(l => <a key={l.href} href={l.href} className="transition-colors hover:text-accent">{l.label}</a>)}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="hidden size-11 sm:inline-flex" title={t("My account", "Contul meu")}><Link to="/candidate-portal" aria-label={t("My account", "Contul meu")}><UserRound /></Link></Button>
          <LangSwitch />
          <Button asChild className="hidden h-11 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 sm:inline-flex"><a href="/#cv">{t("Leave your CV", "Trimite CV-ul")}<ArrowUpRight /></a></Button>
          <Button variant="ghost" size="icon" className="size-11 xl:hidden" aria-label={open ? t("Close menu", "Închide meniul") : t("Open menu", "Deschide meniul")} aria-expanded={open} aria-controls="mobile-site-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && <nav id="mobile-site-menu" aria-label={t("Mobile navigation", "Meniu mobil")} className="grid gap-1 border-t border-brand/10 px-6 py-5 xl:hidden">
        <Link to="/jobs" className="py-3 font-semibold" onClick={() => setOpen(false)}>{t("Jobs", "Locuri de muncă")}</Link>
        {links.map(l => <a key={l.href} href={l.href} className="py-3" onClick={() => setOpen(false)}>{l.label}</a>)}
        <Link to="/candidate-portal" className="py-3" onClick={() => setOpen(false)}>{t("My account", "Contul meu")}</Link>
        <Button asChild className="mt-3 h-12 bg-accent text-accent-foreground"><a href="/#cv" onClick={() => setOpen(false)}>{t("Leave your CV", "Trimite CV-ul")}<ArrowUpRight /></a></Button>
      </nav>}
    </header>
  );
}
