import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/site/InformationPage";

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
  return (
    <InformationPage eyebrow="Website terms" title="Clear terms for candidates and partners" intro="These terms govern use of this website. A specific written employment, assignment or commercial agreement—not this website—governs each placement or partnership.">
      <InformationSection title="Website information">
        <p>We aim to keep vacancy and company information accurate, but availability, pay, schedules, start dates, accommodation and other conditions may change. The final written job brief and contract must be reviewed before a candidate accepts work or travels.</p>
        <p>Submitting a CV or enquiry does not guarantee an interview, offer, placement, candidate shortlist or commercial agreement.</p>
      </InformationSection>
      <InformationSection title="Candidates">
        <p>IONMAN Workforce does not charge candidates a recruitment or placement fee. Candidates must provide complete and accurate information and genuine documents. Eligibility, experience and references may be checked for a specific role.</p>
        <p>Any employment offer should identify the employer, place of work, pay, hours, duration and applicable conditions. Housing information is confirmed in the job brief when accommodation is offered.</p>
      </InformationSection>
      <InformationSection title="Employers and staffing partners">
        <p>Vacancy briefs should accurately describe the role, headcount, location, start date, schedule, language and experience requirements, pay, employment terms and housing. Placement fees, payment timing, replacement terms and responsibilities apply only when agreed in writing.</p>
      </InformationSection>
      <InformationSection title="Acceptable use and responsibility">
        <p>Do not misuse the website, attempt unauthorised access, upload harmful files, impersonate another person, or submit unlawful or misleading content. We may restrict access where necessary to protect candidates, partners or our systems.</p>
        <p>Nothing on this website is legal, tax, immigration or social-security advice. Mandatory rights under applicable consumer, employment and data protection law are not excluded or limited by these terms.</p>
      </InformationSection>
      <InformationSection title="Company and contact">
        <p>ION MAN WORKFORCE S.R.L., registered in Romania at Strada Jimbolia 65. Trade Register J2022021461408 · CUI/VAT 47083118.</p>
        <p>Questions: <a href="mailto:contact@imworkforce.eu" className="font-semibold text-brand underline">contact@imworkforce.eu</a> · <a href="tel:+40741699011" className="font-semibold text-brand underline">+40 741 699 011</a>.</p>
      </InformationSection>
    </InformationPage>
  );
}