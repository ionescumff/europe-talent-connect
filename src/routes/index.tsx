import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Sectors } from "@/components/site/Sectors";
import { Process } from "@/components/site/Process";
import { CandidateBand } from "@/components/site/CandidateBand";
import { CvForm } from "@/components/site/CvForm";
import { VacancyForm } from "@/components/site/VacancyForm";
import { SeoIntro } from "@/components/site/SeoIntro";
import { Footer } from "@/components/site/Footer";
import { listPublishedJobs } from "@/lib/jobposts.functions";

const title = "Muncitori în Olanda și Germania — Locuri de muncă | IONMAN Workforce";
const description =
  "Căutăm muncitori din România pentru Olanda și Germania: depozite, producție, logistică și construcții. Trimite CV-ul gratuit, fără taxe pentru candidați.";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    links: [{ rel: "canonical", href: "https://www.vreaujobs.com/" }],
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listPublishedJobs(),
  component: Index,
});

function Index() {
  const jobs = Route.useLoaderData();
  return (
    <div id="top" className="candidate-site bg-page-glow relative min-h-screen overflow-x-clip text-brand">
      <Nav />
      <Hero />
      <Sectors />
      <Process />
      <CandidateBand />
      <SeoIntro />
      <CvForm availableJobs={jobs} />
      <VacancyForm />
      <Footer />
    </div>
  );
}
