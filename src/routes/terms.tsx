import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/site/InformationPage";
import { useLang } from "@/lib/i18n";

const title = "Website terms — IONMAN Workforce";
const description = "Terms for using the IONMAN Workforce website, vacancy information and recruitment enquiry services.";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useLang();
  return (
    <InformationPage 
      eyebrow={t("Website terms", "Termenii site-ului")} 
      title={t("Clear terms for candidates and partners", "Termeni clari pentru candidați și parteneri")} 
      intro={t("These terms govern use of this website. A specific written employment, assignment or commercial agreement—not this website—governs each placement or partnership.", "Acești termeni reglementează utilizarea acestui site. Fiecare plasare sau parteneriat este guvernat de un contract specific de muncă, de detașare sau comercial, încheiat în scris — nu de acest site.")}
    >
      <InformationSection title={t("Website information", "Informații pe site")}>
        <p>{t("We aim to keep vacancy and company information accurate, but availability, pay, schedules, start dates, accommodation and other conditions may change. The final written job brief and contract must be reviewed before a candidate accepts work or travels.", "Ne propunem să menținem acuratețea informațiilor despre posturile vacante și companie, dar disponibilitatea, plata, programul, datele de începere, cazarea și alte condiții se pot modifica. Fișa postului și contractul final, în formă scrisă, trebuie revizuite înainte ca un candidat să accepte lucrarea sau să călătorească.")}</p>
        <p>{t("Submitting a CV or enquiry does not guarantee an interview, offer, placement, candidate shortlist or commercial agreement.", "Trimiterea unui CV sau a unei solicitări nu garantează un interviu, o ofertă, o plasare, selectarea pe lista scurtă a candidaților sau un acord comercial.")}</p>
      </InformationSection>
      <InformationSection title={t("Candidates", "Candidați")}>
        <p>{t("IONMAN Workforce does not charge candidates a recruitment or placement fee. Candidates must provide complete and accurate information and genuine documents. Eligibility, experience and references may be checked for a specific role.", "IONMAN Workforce nu percepe candidaților nicio taxă de recrutare sau plasare. Candidații trebuie să furnizeze informații complete și corecte și documente autentice. Eligibilitatea, experiența și referințele pot fi verificate pentru un anumit rol.")}</p>
        <p>{t("Any employment offer should identify the employer, place of work, pay, hours, duration and applicable conditions. Housing information is confirmed in the job brief when accommodation is offered.", "Orice ofertă de angajare trebuie să identifice angajatorul, locul de muncă, plata, orele, durata și condițiile aplicabile. Informațiile despre locuință sunt confirmate în fișa postului atunci când se oferă cazare.")}</p>
      </InformationSection>
      <InformationSection title={t("Employers and staffing partners", "Angajatori și parteneri de personal")}>
        <p>{t("Vacancy briefs should accurately describe the role, headcount, location, start date, schedule, language and experience requirements, pay, employment terms and housing. Placement fees, payment timing, replacement terms and responsibilities apply only when agreed in writing.", "Descrierile posturilor vacante ar trebui să detalieze cu acuratețe rolul, numărul de persoane, locația, data de începere, programul, cerințele de limbă și experiență, plata, termenii de angajare și cazarea. Taxele de plasare, termenele de plată, termenii de înlocuire și responsabilitățile se aplică numai atunci când sunt convenite în scris.")}</p>
      </InformationSection>
      <InformationSection title={t("Acceptable use and responsibility", "Utilizare acceptabilă și responsabilitate")}>
        <p>{t("Do not misuse the website, attempt unauthorised access, upload harmful files, impersonate another person, or submit unlawful or misleading content. We may restrict access where necessary to protect candidates, partners or our systems.", "Nu utilizați site-ul în mod necorespunzător, nu încercați accesul neautorizat, nu încărcați fișiere dăunătoare, nu vă prezentați sub o identitate falsă și nu trimiteți conținut ilegal sau înșelător. Putem restricționa accesul acolo unde este necesar pentru a proteja candidații, partenerii sau sistemele noastre.")}</p>
        <p>{t("Nothing on this website is legal, tax, immigration or social-security advice. Mandatory rights under applicable consumer, employment and data protection law are not excluded or limited by these terms.", "Nimic de pe acest site nu reprezintă consultanță juridică, fiscală, de imigrare sau de securitate socială. Drepturile obligatorii conform legislației aplicabile privind protecția consumatorilor, a muncii și a datelor nu sunt excluse sau limitate de acești termeni.")}</p>
      </InformationSection>
      <InformationSection title={t("Company and contact", "Companie și contact")}>
        <p>ION MAN WORKFORCE S.R.L., registered in Romania. Trade Register J2022021461408 · Tax ID/VAT 47083118.</p>
        <p>{t("Questions:", "Întrebări:")} <a href="mailto:contact@vreaujobs.eu" className="font-semibold text-brand underline">contact@vreaujobs.eu</a> · <a href="tel:+40741699011" className="font-semibold text-brand underline">+40 741 699 011</a>.</p>
      </InformationSection>
    </InformationPage>
  );
}
