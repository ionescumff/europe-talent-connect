import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/site/InformationPage";

const title = "Privacy & cookies — IONMAN Workforce";
const description = "How ION MAN WORKFORCE S.R.L. handles candidate, employer and website information under European data protection rules.";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InformationPage eyebrow="Privacy notice" title="Your information, handled responsibly" intro="ION MAN WORKFORCE S.R.L. is the controller of personal information submitted through this website. This notice explains what we collect and how we use it.">
      <InformationSection title="Information we collect">
        <p>For candidates, this may include your name, contact details, CV, work history, skills, preferred sector and country, the vacancy you applied for, and later recruitment communications.</p>
        <p>For employers and partners, this may include your name, company, business contact details, vacancy requirements and our communications with you.</p>
      </InformationSection>
      <InformationSection title="Why and how we use it">
        <ul className="list-disc space-y-2 pl-5">
          <li>To respond to enquiries and take steps toward a possible work placement or business agreement.</li>
          <li>To screen candidates, identify suitable vacancies and manage recruitment communications.</li>
          <li>To present a candidate to a potential employer only for a relevant recruitment opportunity.</li>
          <li>To operate securely, keep appropriate records and meet legal obligations.</li>
        </ul>
        <p>Depending on the activity, our legal basis is taking steps at your request before a contract, performing a contract, complying with law, our legitimate interests in operating a responsible recruitment service, or consent where the law requires it.</p>
      </InformationSection>
      <InformationSection title="Who receives information">
        <p>Candidate information may be shared with prospective employers or staffing partners for a relevant vacancy. We may also use carefully selected service providers for hosting, secure storage and communications. We do not sell personal information.</p>
        <p>Where information is processed outside the European Economic Area, we use an approved legal safeguard when required.</p>
      </InformationSection>
      <InformationSection title="How long we keep it">
        <p>We keep information only for as long as it is needed for the recruitment or business purpose described here, to maintain necessary records, resolve disputes and meet legal duties. The period depends on the relationship, whether an application remains active, and applicable limitation or record-keeping rules. Information is then deleted or anonymised.</p>
      </InformationSection>
      <InformationSection title="Your rights">
        <p>Subject to the conditions in data protection law, you may ask to access, correct, erase or restrict your information, object to certain processing, receive portable information, or withdraw consent without affecting earlier lawful use. You may also complain to the Romanian data protection authority or the authority where you live or work.</p>
        <p>Send requests to <a href="mailto:contact@imworkforce.eu" className="font-semibold text-brand underline">contact@imworkforce.eu</a>. We may need to verify your identity before acting.</p>
      </InformationSection>
      <InformationSection title="Cookies and staff access">
        <p>The public website does not currently use advertising or analytics cookies. The private staff portal uses essential sign-in and security storage required to keep authorised team members signed in and protect recruitment records. These essential technologies cannot be switched off while using the portal.</p>
      </InformationSection>
      <InformationSection title="Contacting the controller">
        <p>ION MAN WORKFORCE S.R.L., Strada Jimbolia 65, Romania · Trade Register J2022021461408 · Tax ID/VAT 47083118.</p>
        <p>Email: <a href="mailto:contact@imworkforce.eu" className="font-semibold text-brand underline">contact@imworkforce.eu</a> · Phone/WhatsApp: <a href="tel:+40741699011" className="font-semibold text-brand underline">+40 741 699 011</a>.</p>
      </InformationSection>
    </InformationPage>
  );
}