import { createFileRoute, Link } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/site/InformationPage";

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
  return (
    <InformationPage eyebrow="For EU candidates" title="Know the terms before you travel" intro="Romanian citizens are EU citizens and generally benefit from free movement for work in other EU countries. Practical registrations and job-specific requirements still apply.">
      <InformationSection title="Before accepting a role">
        <ul className="list-disc space-y-2 pl-5">
          <li>Confirm the employer, workplace, job title, start date and contract duration.</li>
          <li>Check gross pay, expected hours, shift pattern, overtime rules and payment schedule in writing.</li>
          <li>Ask what deductions may apply for tax, insurance, transport or accommodation.</li>
          <li>If housing is offered, confirm the address or area, cost, occupancy and conditions before travelling.</li>
          <li>Keep copies of your identity document, agreement and all information you receive.</li>
        </ul>
      </InformationSection>
      <InformationSection title="Registration, tax and social security">
        <p>You may need to register locally, obtain a tax or personal identification number, arrange health insurance, or complete other formalities after arrival. Which rules apply depends on the country, length and structure of the assignment, and whether you are hired locally or posted by an employer.</p>
        <p>Ask who employs you, where social-security contributions are paid, and who supports required registrations. Do not assume that working in another EU country removes all administrative requirements.</p>
      </InformationSection>
      <InformationSection title="Fair treatment and support">
        <p>EU workers are generally entitled to equal treatment with local workers in core employment conditions, subject to the applicable law and employment arrangement. You should receive understandable information about your work and be able to raise concerns without retaliation.</p>
        <p>IONMAN Workforce never charges candidates a recruitment fee. If a role is presented through us, ask our team about anything that is unclear before you accept or travel.</p>
      </InformationSection>
      <InformationSection title="Important note">
        <p>This page provides general practical information, not legal, tax, immigration or social-security advice. Rules can change and individual circumstances differ. Check official authorities in the destination country or obtain professional advice when necessary.</p>
        <p>Questions about a vacancy? Email <a href="mailto:recruitment@imworkforce.eu" className="font-semibold text-brand underline">recruitment@imworkforce.eu</a>, call or WhatsApp <a href="tel:+40741699011" className="font-semibold text-brand underline">+40 741 699 011</a>, or <Link to="/jobs" className="font-semibold text-brand underline">view current jobs</Link>.</p>
      </InformationSection>
    </InformationPage>
  );
}