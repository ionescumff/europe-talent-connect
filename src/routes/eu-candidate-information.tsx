import { createFileRoute, Link } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/site/InformationPage";
import { useLang } from "@/lib/i18n";

const title = "EU candidate information — IONMAN Workforce";
const description = "Practical information for Romanian and other EU candidates considering work in the Netherlands or Germany.";

export const Route = createFileRoute("/eu-candidate-information")({
  head: () => ({ meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: EuCandidatePage,
});

function EuCandidatePage() {
  const { lang, t } = useLang();
  return (
    <InformationPage 
      eyebrow={t("For EU candidates", "Pentru candidații UE")} 
      title={t("Know the terms before you travel", "Află condițiile înainte de a călători")} 
      intro={t("Romanian citizens are EU citizens and generally benefit from free movement for work in other EU countries. Practical registrations and job-specific requirements still apply.", "Cetățenii români sunt cetățeni UE și beneficiază, în general, de libera circulație a forței de muncă în alte țări UE. Înregistrările practice și cerințele specifice locului de muncă se aplică în continuare.")}
    >
      <InformationSection title={t("Before accepting a role", "Înainte de a accepta un rol")}>
        <ul className="list-disc space-y-2 pl-5">
          <li>{t("Confirm the employer, workplace, job title, start date and contract duration.", "Confirmă angajatorul, locul de muncă, titlul postului, data de începere și durata contractului.")}</li>
          <li>{t("Check gross pay, expected hours, shift pattern, overtime rules and payment schedule in writing.", "Verifică în scris salariul brut, orele estimate, programul de schimburi, regulile privind orele suplimentare și programul de plată.")}</li>
          <li>{t("Ask what deductions may apply for tax, insurance, transport or accommodation.", "Întreabă ce deduceri se pot aplica pentru taxe, asigurări, transport sau cazare.")}</li>
          <li>{t("If housing is offered, confirm the address or area, cost, occupancy and conditions before travelling.", "Dacă se oferă cazare, confirmă adresa sau zona, costul, gradul de ocupare și condițiile înainte de a călători.")}</li>
          <li>{t("Keep copies of your identity document, agreement and all information you receive.", "Păstrează copii ale documentului de identitate, ale acordului și ale tuturor informațiilor pe care le primești.")}</li>
        </ul>
      </InformationSection>
      <InformationSection title={t("Registration, tax and social security", "Înregistrare, taxe și securitate socială")}>
        <p>{t("You may need to register locally, obtain a tax or personal identification number, arrange health insurance, or complete other formalities after arrival. Which rules apply depends on the country, length and structure of the assignment, and whether you are hired locally or posted by an employer.", "Este posibil să fie necesar să vă înregistrați local, să obțineți un număr de identificare fiscală sau personală, să aranjați asigurarea de sănătate sau să îndepliniți alte formalități după sosire. Regulile care se aplică depind de țară, de durata și structura misiunii și de faptul dacă sunteți angajat local sau detașat de un angajator.")}</p>
        <p>{t("Ask who employs you, where social-security contributions are paid, and who supports required registrations. Do not assume that working in another EU country removes all administrative requirements.", "Întrebați cine vă angajează, unde se plătesc contribuțiile de asigurări sociale și cine sprijină înregistrările necesare. Nu presupuneți că lucrul într-o altă țară din UE elimină toate cerințele administrative.")}</p>
      </InformationSection>
      <InformationSection title={t("Fair treatment and support", "Tratament echitabil și sprijin")}>
        <p>{t("EU workers are generally entitled to equal treatment with local workers in core employment conditions, subject to the applicable law and employment arrangement. You should receive understandable information about your work and be able to raise concerns without retaliation.", "Lucrătorii din UE au, în general, dreptul la un tratament egal cu lucrătorii locali în ceea ce privește condițiile de muncă esențiale, sub rezerva legii aplicabile și a aranjamentului de muncă. Ar trebui să primiți informații inteligibile despre munca dumneavoastră și să puteți exprima preocupările fără represalii.")}</p>
        <p>{t("IONMAN Workforce never charges candidates a recruitment fee. If a role is presented through us, ask our team about anything that is unclear before you accept or travel.", "IONMAN Workforce nu percepe niciodată candidaților o taxă de recrutare. Dacă un rol este prezentat prin noi, întrebați echipa noastră despre orice este neclar înainte de a accepta sau de a călători.")}</p>
      </InformationSection>
      <InformationSection title={t("Important note", "Notă importantă")}>
        <p>{t("This page provides general practical information, not legal, tax, immigration or social-security advice. Rules can change and individual circumstances differ. Check official authorities in the destination country or obtain professional advice when necessary.", "Această pagină oferă informații practice generale, nu consultanță juridică, fiscală, de imigrare sau de securitate socială. Regulile se pot schimba, iar circumstanțele individuale diferă. Consultați autoritățile oficiale din țara de destinație sau obțineți sfaturi profesionale atunci când este necesar.")}</p>
        <p>
          {lang === "ro" ? (
            <>
              Întrebări despre un post vacant? Trimite un e-mail la <a href="mailto:recruitment@imworkforce.eu" className="font-semibold text-brand underline">recruitment@imworkforce.eu</a>, sună sau trimite un mesaj pe WhatsApp la <a href="tel:+40741699011" className="font-semibold text-brand underline">+40 741 699 011</a> (<a href="https://wa.me/40741699011" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline">deschide discuția WhatsApp</a>), sau <Link to="/jobs" className="font-semibold text-brand underline">vezi locurile de muncă actuale</Link>.
            </>
          ) : (
            <>
              Questions about a vacancy? Email <a href="mailto:recruitment@imworkforce.eu" className="font-semibold text-brand underline">recruitment@imworkforce.eu</a>, call or WhatsApp <a href="tel:+40741699011" className="font-semibold text-brand underline">+40 741 699 011</a> (<a href="https://wa.me/40741699011" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline">open WhatsApp chat</a>), or <Link to="/jobs" className="font-semibold text-brand underline">view current jobs</Link>.
            </>
          )}
        </p>
      </InformationSection>
    </InformationPage>
  );
}
