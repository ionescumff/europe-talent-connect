import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { EditorialHome } from "@/components/site/EditorialHome";
import { listPublishedJobs } from "@/lib/jobposts.functions";
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
  loader: () => listPublishedJobs(),
  component: Index,
});

function Index() {
  const jobs = Route.useLoaderData();
  return (
    <div id="top" className="public-site relative min-h-screen overflow-x-clip">
      <Nav />
      <main>
      <EditorialHome jobs={jobs} />
      <CvForm availableJobs={jobs} />
      <VacancyForm />
      </main>
      <Footer />
    </div>
  );
}
