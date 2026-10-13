import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, ShieldCheck, Info } from "lucide-react";
import type { ReactNode } from "react";
import { EmployerMessageForm } from "@/components/site/EmployerMessageForm";
import { InformationPage, InformationSection } from "@/components/site/InformationPage";
import { useLang } from "@/lib/i18n";

const title = "Contact & Candidate Info — IONMAN Workforce";
const description = "Company details for ION MAN WORKFORCE S.R.L. and essential information for EU workers.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLang();
  return (
    <InformationPage 
      eyebrow={t("Information Hub", "Centru de informații")} 
      title={t("Connect with IONMAN Workforce", "Contactează IONMAN Workforce")} 
      intro={t("Official company details and practical guidance for candidates and employers.", "Detalii oficiale despre companie și îndrumări practice pentru candidați și angajatori.")}
    >
      <section className="grid gap-4 sm:grid-cols-2">
        <ContactItem icon={<Mail className="size-5" />} label={t("General & Employers", "General și angajatori")}>
          <a href="mailto:contact@vreaujobs.eu" className="font-semibold hover:underline">contact@vreaujobs.eu</a>
        </ContactItem>
        <ContactItem icon={<Mail className="size-5" />} label={t("Recruitment", "Recrutare")}>
          <a href="mailto:contact@vreaujobs.eu" className="font-semibold hover:underline">contact@vreaujobs.eu</a>
        </ContactItem>
        <ContactItem icon={<Phone className="size-5" />} label={t("Phone & WhatsApp", "Telefon și WhatsApp")}>
          <a href="tel:+40741699011" className="font-semibold hover:underline">+40 741 699 011</a>
          <a href="https://wa.me/40741699011" target="_blank" rel="noopener noreferrer" className="ml-3 font-semibold underline">WhatsApp</a>
        </ContactItem>
        <ContactItem icon={<MapPin className="size-5" />} label={t("Registered Office", "Sediu social")}>
          <p className="font-semibold">Strada Jimbolia 65, Romania</p>
        </ContactItem>
      </section>

      <div className="my-12 h-px bg-brand/10" />

      <InformationSection title={t("EU Candidate Essentials", "Informații esențiale candidați UE")}>
        <div className="rounded-xl bg-accent/5 p-6 border border-accent/10">
          <div className="flex gap-3 mb-4">
            <ShieldCheck className="size-6 text-accent shrink-0" />
            <p className="text-sm font-semibold">{t("No fees for candidates", "Fără taxe pentru candidați")}</p>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            {t("As a Romanian citizen, you have the right to work in the EU. We never charge candidates for recruitment. Always confirm your contract terms, housing costs, and net pay before traveling.", "În calitate de cetățean român, aveți dreptul de a lucra în UE. Nu percepem niciodată taxe candidaților pentru recrutare. Confirmați întotdeauna condițiile contractuale, costurile de cazare și salariul net înainte de a călători.")}
          </p>
          <Link to="/privacy" className="text-xs font-bold text-accent uppercase tracking-wider hover:underline flex items-center gap-2">
            <Info size={14} /> {t("Read our Privacy & Data terms", "Citește termenii de confidențialitate")}
          </Link>
        </div>
      </InformationSection>

      <EmployerMessageForm />

      <InformationSection title={t("Legal Details", "Detalii legale")}>
        <div className="grid gap-y-4 text-sm text-brand/70 sm:grid-cols-2">
          <div><p className="font-bold text-brand uppercase text-[10px] tracking-widest">{t("Legal Entity", "Entitate legală")}</p><p>ION MAN WORKFORCE S.R.L.</p></div>
          <div><p className="font-bold text-brand uppercase text-[10px] tracking-widest">{t("Registration", "Înregistrare")}</p><p>J2022021461408</p></div>
          <div><p className="font-bold text-brand uppercase text-[10px] tracking-widest">{t("Tax ID", "Cod Fiscal")}</p><p>47083118</p></div>
        </div>
      </InformationSection>
      <InformationSection title={t("Leadership", "Conducere")}>
        <p>{t("Co-founders: Yuri Manteleres and Matei Ionescu.", "Co-fondatori: Yuri Manteleres și Matei Ionescu.")}</p>
        <p>Yuri Manteleres: <a href="mailto:yuri@vreaujobs.eu" className="font-semibold underline">yuri@vreaujobs.eu</a></p>
        <p>Matei Ionescu: <a href="mailto:matei@vreaujobs.eu" className="font-semibold underline">matei@vreaujobs.eu</a></p>
      </InformationSection>
    </InformationPage>
  );
}

function ContactItem({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-3 text-accent">{icon}<span className="text-xs font-bold uppercase tracking-[0.12em] text-brand/55">{label}</span></div>
      <div className="mt-3 text-sm text-brand">{children}</div>
    </div>
  );
}
