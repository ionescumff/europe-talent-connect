import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { EmployerMessageForm } from "@/components/site/EmployerMessageForm";
import { InformationPage, InformationSection } from "@/components/site/InformationPage";
import { useLang } from "@/lib/i18n";

const title = "Company & contact details — IONMAN Workforce";
const description = "Registered company and contact details for ION MAN WORKFORCE S.R.L. in Romania.";

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
      eyebrow={t("Company information", "Informații despre companie")} 
      title={t("Contact IONMAN Workforce", "Contactează IONMAN Workforce")} 
      intro={t("Candidates, employers and staffing partners can reach the right member of our team using the details below.", "Candidații, angajatorii și partenerii de personal pot contacta membrul potrivit al echipei noastre folosind detaliile de mai jos.")}
    >
      <section className="grid gap-4 sm:grid-cols-2">
        <ContactItem icon={<Mail className="size-5" />} label={t("General & employer enquiries", "Solicitări generale și angajatori")}>
          <a href="mailto:contact@imworkforce.eu" className="font-semibold hover:underline">contact@imworkforce.eu</a>
        </ContactItem>
        <ContactItem icon={<Mail className="size-5" />} label={t("CVs & recruitment", "CV-uri și recrutare")}>
          <a href="mailto:recruitment@imworkforce.eu" className="font-semibold hover:underline">recruitment@imworkforce.eu</a>
        </ContactItem>
        <ContactItem icon={<Phone className="size-5" />} label={t("Phone & WhatsApp", "Telefon și WhatsApp")}>
          <a href="tel:+40741699011" className="font-semibold hover:underline">+40 741 699 011</a> ·{" "}
          <a href="https://wa.me/40741699011" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{t("WhatsApp", "WhatsApp")}</a>
        </ContactItem>
        <ContactItem icon={<MapPin className="size-5" />} label={t("Registered office", "Sediu social")}>
          <p className="font-semibold">Strada Jimbolia 65, Romania</p>
        </ContactItem>
      </section>
      <EmployerMessageForm />
      <InformationSection title={t("Registered business", "Afacere înregistrată")}>
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <p><strong className="text-brand">{t("Legal name:", "Nume legal:")}</strong><br />ION MAN WORKFORCE S.R.L.</p>
          <p><strong className="text-brand">{t("Country of registration:", "Țara de înregistrare:")}</strong><br />Romania</p>
          <p><strong className="text-brand">{t("Trade Register number:", "Număr de înregistrare la Registrul Comerțului:")}</strong><br />J2022021461408</p>
          <p><strong className="text-brand">{t("Tax ID / VAT number:", "Cod de identificare fiscală / TVA:")}</strong><br />47083118</p>
        </div>
      </InformationSection>
      <InformationSection title={t("Leadership", "Conducere")}>
        <p>{t("Co-founders: Yuri Manteleres and Matei Ionescu.", "Co-fondatori: Yuri Manteleres și Matei Ionescu.")}</p>
        <p>{t("For partnerships and employer enquiries, write to", "Pentru parteneriate și solicitări din partea angajatorilor, scrieți la")} <a href="mailto:contact@imworkforce.eu" className="font-semibold text-brand underline">contact@imworkforce.eu</a>.</p>
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
