import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LangSwitch, useLang } from "@/lib/i18n";

export function Nav() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return <header className="public-nav relative z-20 flex items-center justify-between gap-4 px-6 py-5 md:px-12 lg:px-16">
    <Link to="/" aria-label="IONMAN Workforce home" className="public-wordmark shrink-0">IONMAN<span>WORKFORCE</span></Link>
    <nav aria-label="Main navigation" className="hidden items-center gap-8 text-xs uppercase lg:flex">
      <Link to="/">{t("Home", "Acasă")}</Link><Link to="/jobs">{t("Jobs", "Locuri de muncă")}</Link><Link to="/contact">{t("Contact", "Contact")}</Link><a href="/#employers">For employers</a>
    </nav>
    <div className="flex items-center gap-3"><LangSwitch /><Button asChild className="public-cta hidden h-10 rounded-none px-5 text-xs sm:inline-flex"><a href="/#cv">{t("Leave your CV", "Depune CV-ul")}<ArrowRight size={15} /></a></Button><Button variant="ghost" size="icon" className="public-menu lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div>
    {open && <nav aria-label="Mobile navigation" className="public-mobile-nav absolute inset-x-0 top-full flex flex-col gap-5 border-t px-6 py-6 text-sm lg:hidden"><Link to="/" onClick={() => setOpen(false)}>{t("Home", "Acasă")}</Link><Link to="/jobs" onClick={() => setOpen(false)}>{t("Jobs", "Locuri de muncă")}</Link><Link to="/contact" onClick={() => setOpen(false)}>{t("Contact", "Contact")}</Link><a href="/#employers" onClick={() => setOpen(false)}>For employers</a><a href="/#cv" onClick={() => setOpen(false)}>{t("Leave your CV", "Depune CV-ul")}</a></nav>}
  </header>;
}
