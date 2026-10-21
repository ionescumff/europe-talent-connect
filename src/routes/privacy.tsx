import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/site/InformationPage";
import { useLang } from "@/lib/i18n";

const title = "Confidențialitate și cookie-uri — IONMAN Workforce";
const description = "Cum gestionează ION MAN WORKFORCE S.R.L. datele candidaților și angajatorilor, conform normelor europene de protecție a datelor.";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useLang();
  return (
    <InformationPage 
      eyebrow={t("Privacy notice", "Notă de confidențialitate")} 
      title={t("Your information, handled responsibly", "Informațiile tale, gestionate cu responsabilitate")} 
      intro={t("ION MAN WORKFORCE S.R.L. is the controller of personal information submitted through this website. This notice explains what we collect and how we use it.", "ION MAN WORKFORCE S.R.L. este operatorul informațiilor cu caracter personal transmise prin intermediul acestui site. Această notă explică ce colectăm și cum utilizăm aceste date.")}
    >
      <InformationSection title={t("Information we collect", "Informații pe care le colectăm")}>
        <p>{t("For candidates, this may include your name, contact details, CV, work history, skills, preferred sector and country, the vacancy you applied for, and later recruitment communications.", "Pentru candidați, acestea pot include numele, datele de contact, CV-ul, istoricul profesional, competențele, sectorul și țara preferate, postul pentru care ai aplicat și comunicările ulterioare privind recrutarea.")}</p>
        <p>{t("For employers and partners, this may include your name, company, business contact details, vacancy requirements and our communications with you.", "Pentru angajatori și parteneri, acestea pot include numele, compania, datele de contact profesionale, cerințele postului vacant și comunicările noastre cu tine.")}</p>
      </InformationSection>
      <InformationSection title={t("Why and how we use it", "De ce și cum le folosim")}>
        <ul className="list-disc space-y-2 pl-5">
          <li>{t("To respond to enquiries and take steps toward a possible work placement or business agreement.", "Pentru a răspunde la solicitări și a face demersuri în vederea unei posibile plasări în muncă sau a unui acord comercial.")}</li>
          <li>{t("To screen candidates, identify suitable vacancies and manage recruitment communications.", "Pentru a selecta candidații, a identifica posturile vacante potrivite și a gestiona comunicările privind recrutarea.")}</li>
          <li>{t("To present a candidate to a potential employer only for a relevant recruitment opportunity.", "Pentru a prezenta un candidat unui potențial angajator numai pentru o oportunitate relevantă de recrutare.")}</li>
          <li>{t("To operate securely, keep appropriate records and meet legal obligations.", "Pentru a opera în siguranță, a păstra evidențe corespunzătoare și a îndeplini obligațiile legale.")}</li>
        </ul>
        <p>{t("Depending on the activity, our legal basis is taking steps at your request before a contract, performing a contract, complying with law, our legitimate interests in operating a responsible recruitment service, or consent where the law requires it.", "În funcție de activitate, temeiul nostru juridic este efectuarea demersurilor la cererea ta înainte de un contract, executarea unui contract, respectarea legii, interesele noastre legitime în operarea unui serviciu de recrutare responsabil sau consimțământul acolo unde legea o cere.")}</p>
      </InformationSection>
      <InformationSection title={t("Who receives information", "Cine primește informațiile")}>
        <p>{t("Candidate information may be shared with prospective employers or staffing partners for a relevant vacancy. We may also use carefully selected service providers for hosting, secure storage and communications. We do not sell personal information.", "Informațiile despre candidați pot fi partajate cu potențialii angajatori sau partenerii de personal pentru un post vacant relevant. De asemenea, putem folosi furnizori de servicii selectați cu atenție pentru găzduire, stocare securizată și comunicare. Nu vindem informații cu caracter personal.")}</p>
        <p>{t("Where information is processed outside the European Economic Area, we use an approved legal safeguard when required.", "Atunci când informațiile sunt procesate în afara Spațiului Economic European, utilizăm o măsură de protecție legală aprobată, atunci când este necesar.")}</p>
      </InformationSection>
      <InformationSection title={t("How long we keep it", "Cât timp le păstrăm")}>
        <p>{t("We keep information only for as long as it is needed for the recruitment or business purpose described here, to maintain necessary records, resolve disputes and meet legal duties. The period depends on the relationship, whether an application remains active, and applicable limitation or record-keeping rules. Information is then deleted or anonymised.", "Păstrăm informațiile doar atât timp cât este necesar pentru scopul de recrutare sau de afaceri descris aici, pentru a menține evidențele necesare, a rezolva disputele și a îndeplini obligațiile legale. Perioada depinde de relație, de faptul dacă o candidatură rămâne activă și de regulile aplicabile privind prescripția sau păstrarea înregistrărilor. Ulterior, informațiile sunt șterse sau anonimizate.")}</p>
      </InformationSection>
      <InformationSection title={t("Your rights", "Drepturile tale")}>
        <p>{t("Subject to the conditions in data protection law, you may ask to access, correct, erase or restrict your information, object to certain processing, receive portable information, or withdraw consent without affecting earlier lawful use. You may also complain to the Romanian data protection authority or the authority where you live or work.", "În condițiile prevăzute de legislația privind protecția datelor, poți solicita accesul, corectarea, ștergerea sau restricționarea datelor tale, te poți opune anumitor prelucrări, poți primi o copie a datelor într-un format portabil sau îți poți retrage consimțământul fără a afecta utilizarea legală anterioară. De asemenea, poți depune o plângere la autoritatea română de protecție a datelor (ANSPDCP) sau la autoritatea din locul în care locuiești sau lucrezi.")}</p>
        <p>{t("Send requests to", "Trimite cererile la")} <a href="mailto:contact@vreaujobs.eu" className="font-semibold text-brand underline">contact@vreaujobs.eu</a>. {t("We may need to verify your identity before acting.", "Este posibil să fie necesar să îți verificăm identitatea înainte de a acționa.")}</p>
      </InformationSection>
      <InformationSection title={t("Cookies and staff access", "Cookie-uri și accesul personalului")}>
        <p>{t("The public website does not currently use advertising or analytics cookies. The private staff portal uses essential sign-in and security storage required to keep authorised team members signed in and protect recruitment records. These essential technologies cannot be switched off while using the portal.", "Site-ul public nu utilizează în prezent cookie-uri de publicitate sau analiză. Portalul privat al personalului utilizează stocarea esențială pentru autentificare și securitate, necesară pentru a menține membrii echipei autorizați autentificați și pentru a proteja înregistrările de recrutare. Aceste tehnologii esențiale nu pot fi dezactivate în timpul utilizării portalului.")}</p>
      </InformationSection>
      <InformationSection title={t("Contacting the controller", "Contactarea operatorului")}>
        <p>ION MAN WORKFORCE S.R.L., Strada Jimbolia 65, Romania · Trade Register J2022021461408 · Tax ID/VAT 47083118.</p>
        <p>{t("Email:", "Email:")} <a href="mailto:contact@vreaujobs.eu" className="font-semibold text-brand underline">contact@vreaujobs.eu</a> · {t("Phone/WhatsApp:", "Telefon/WhatsApp:")} <a href="tel:+40741699011" className="font-semibold text-brand underline">+40 741 699 011</a> (<a href="https://wa.me/40741699011" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline">WhatsApp</a>).</p>
      </InformationSection>
    </InformationPage>
  );
}
