import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";
import { useLang } from "@/lib/i18n";

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/vreaujobs.eu",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/vreaujobs.eu",
    icon: Facebook,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/vreaujobs.eu",
    icon: Linkedin,
  },
];

export function Footer() {
  const { t } = useLang();
  
  return (
    <footer className="relative border-t border-brand/10 px-6 py-10 text-sm text-brand/60 md:px-8 lg:px-14">
      <div className="grid gap-8 md:grid-cols-[1.35fr_1fr_1fr]">
        <div>
          <Logo small />
          <p className="mt-4 max-w-sm leading-6">
            {t(
              "European workforce recruitment from Romania for employers and staffing partners in the Netherlands and Germany.",
              "Recrutare de forță de muncă europeană din România pentru angajatori și parteneri din Olanda și Germania."
            )}
          </p>
          <div className="mt-4 space-y-1 text-xs leading-5">
            <p>ION MAN WORKFORCE S.R.L. · Romania</p>
            <p>{t("Trade Register", "Registrul Comerțului")}: J2022021461408 · {t("Tax ID/VAT", "CUI")}: 47083118</p>
          </div>
        </div>
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-brand">{t("Contact", "Contact")}</p>
          <div className="mt-3 flex flex-col items-start gap-2">
            <a href="mailto:contact@vreaujobs.eu" className="hover:text-brand">contact@vreaujobs.eu</a>
            <a href="tel:+40741699011" className="whitespace-nowrap hover:text-brand">+40 741 699 011 · {t("Phone", "Telefon")}</a>
            <a href="https://wa.me/40741699011" target="_blank" rel="noopener noreferrer" className="hover:text-brand">WhatsApp</a>
          </div>
          <p className="mt-5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-brand/45">
            {t("Follow", "Urmărește")}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} — @vreaujobs.eu`}
                  className="grid size-11 place-items-center rounded-full border border-brand/15 text-brand/60 transition-colors hover:border-brand/40 hover:text-brand"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-brand">{t("Information", "Informații")}</p>
          <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 md:grid-cols-1">
            <Link to="/contact" className="hover:text-brand">{t("Company & contact", "Companie și contact")}</Link>
            <Link to="/privacy" className="hover:text-brand">{t("Privacy & cookies", "Confidențialitate și cookie-uri")}</Link>
            <Link to="/terms" className="hover:text-brand">{t("Terms", "Termeni și condiții")}</Link>
            <Link to="/eu-candidate-information" className="hover:text-brand">{t("EU candidate information", "Informații pentru candidații UE")}</Link>
            <Link to="/candidate-portal" className="hover:text-brand">{t("Candidate portal", "Cont de candidat")}</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3 border-t border-brand/10 pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} ION MAN WORKFORCE S.R.L. {t("All rights reserved.", "Toate drepturile rezervate.")}</p>
        <Link to="/portal" className="font-semibold text-brand/45 transition-colors hover:text-brand">
          Staff CRM
        </Link>
      </div>
    </footer>
  );
}
