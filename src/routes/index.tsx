import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Sectors } from "@/components/site/Sectors";
import { Process } from "@/components/site/Process";
import { CvForm } from "@/components/site/CvForm";
import { VacancyForm } from "@/components/site/VacancyForm";
import { Footer } from "@/components/site/Footer";

const title = "IONMAN Workforce — Screened Romanian workers for the Netherlands & Germany";
const description =
  "European workforce from Romania for warehousing, production, logistics and construction. Candidates: leave your CV and we'll contact you — no fee. Employers: share your vacancies.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top" className="bg-page-glow relative min-h-screen overflow-x-clip text-brand">
      <Nav />
      <Hero />
      <Sectors />
      <Process />
      <CvForm />
      <VacancyForm />
      <Footer />
    </div>
  );
}
