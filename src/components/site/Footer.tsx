import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useLang } from "@/lib/i18n";

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
            <p>Trade Register: J2022021461408 · Tax ID/VAT: 47083118</p>
          </div>
        </div>
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-brand">{t("Contact", "Contact")}</p>
          <div className="mt-3 flex flex-col items-start gap-2">
            <a href="mailto:contact@vreaujobs.eu" className="hover:text-brand">contact@vreaujobs.eu</a>
            <a href="mailto:matei@vreaujobs.eu" className="hover:text-brand">matei@vreaujobs.eu</a>
            <a href="tel:+40741699011" className="hover:text-brand">+40 741 699 011 · Phone</a>
            <a href="https://wa.me/40741699011" target="_blank" rel="noopener noreferrer" className="hover:text-brand">WhatsApp</a>
          </div>
        </div>
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-brand">{t("Information", "Informații")}</p>
          <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 md:grid-cols-1">
            <Link to="/contact" className="hover:text-brand">{t("Company & contact", "Companie și contact")}</Link>
            <Link to="/privacy" className="hover:text-brand">{t("Privacy & cookies", "Confidențialitate și cookie-uri")}</Link>
            <Link to="/terms" className="hover:text-brand">{t("Terms", "Termeni și condiții")}</Link>
            <Link to="/eu-candidate-information" className="hover:text-brand">{t("EU candidate information", "Informații candidați UE")}</Link>
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
