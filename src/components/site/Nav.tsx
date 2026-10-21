import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { LangSwitch, useLang } from "@/lib/i18n";

export function Nav() {
  const { t } = useLang();
  const links = [
    { href: "/#sectors", label: t("Sectors", "Domenii") },
    { href: "/#process", label: t("How it works", "Cum funcționează") },
    { href: "/#employers", label: "For employers" },
  ];
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-8 lg:px-14 lg:py-6">
      <Logo />
      <div className="hidden items-center gap-8 text-sm font-medium md:flex">
        <Link to="/jobs" className="transition-colors hover:text-accent">
          {t("Jobs", "Locuri de muncă")}
        </Link>
        {links.map((l) => (
          <a key={l.href} href={l.href} className="transition-colors hover:text-accent">
            {l.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3">
      <Link to="/candidate-portal" className="text-sm font-semibold">{t("My account", "Contul meu")}</Link>
      <LangSwitch />
      <a
        href="/#cv"
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-accent transition-transform hover:-translate-y-0.5"
      >
        {t("Leave your CV", "Lasă-ți CV-ul")}
      </a>
      </div>
    </nav>
  );
}
