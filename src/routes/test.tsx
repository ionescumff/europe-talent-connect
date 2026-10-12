import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Menu, X, MessageCircle, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LangSwitch, useLang } from "@/lib/i18n";
import warehouse from "@/assets/test-workforce-hero.jpg";
import production from "@/assets/test-workforce-production.jpg";
import { TestCareerGallery } from "../components/site/TestCareerGallery";

const title = "Inside IONMAN — Recruitment design test";
const description = "Explore an editorial recruitment experience for Romanian candidates and employers in Germany and the Netherlands.";

export const Route = createFileRoute("/test")({
  head: () => ({ meta: [
    { title }, { name: "description", content: description },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: TestPage,
});

function TestPage() {
  const { t } = useLang();
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const slides = [
    { image: warehouse, alt: t("Warehouse professionals working together", "Profesioniști într-un depozit"), title: t("Welcome to IONMAN Workforce", "Bine ai venit la IONMAN Workforce"), text: t("Discover opportunities across Europe. Bring your experience, explore a new direction and take your next career step in Germany or the Netherlands.", "Descoperă oportunități în Europa. Valorifică-ți experiența și fă următorul pas în carieră în Germania sau Olanda.") },
    { image: production, alt: t("Technicians inspecting a component", "Tehnicieni verificând o componentă"), title: t("Your experience. New possibilities.", "Experiența ta. Noi posibilități."), text: t("From warehousing and logistics to production and construction support, connect with roles that match your skills. Recruitment is always free for candidates.", "De la depozite și logistică la producție și construcții, găsește roluri potrivite abilităților tale. Recrutarea este întotdeauna gratuită pentru candidați.") },
  ] as const;
  const current = slides[slide] ?? slides[0];
  const stories = [
    { image: warehouse, category: t("WAREHOUSING & LOGISTICS", "DEPOZITE ȘI LOGISTICĂ"), title: t("A new direction in the Netherlands", "Un nou început în Olanda"), text: t("Explore warehouse, order fulfilment and logistics opportunities.", "Explorează oportunități în depozite, pregătirea comenzilor și logistică.") },
    { image: production, category: t("PRODUCTION & PACKING", "PRODUCȚIE ȘI AMBALARE"), title: t("Put your skills to work in Germany", "Valorifică-ți abilitățile în Germania"), text: t("Discover production, packing and food industry roles.", "Descoperă roluri în producție, ambalare și industria alimentară.") },
  ];
  return (
    <div className="editorial-test min-h-screen">
      <header className="test-header relative z-20 flex items-center justify-between gap-4 px-6 md:px-10 lg:px-16">
        <Link to="/test" aria-label="Inside IONMAN home" className="test-wordmark text-2xl">INSIDE<span>IONMAN WORKFORCE</span></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-[11px] font-medium uppercase lg:flex">
          <Link to="/jobs">{t("Jobs & careers", "Locuri de muncă")}</Link>
          <Link to="/eu-candidate-information">{t("Working in Europe", "Munca în Europa")}</Link>
          <a href="#career-insights">{t("Career advice", "Sfaturi de carieră")}</a>
          <Link to="/contact">For employers</Link>
          <a href="/#cv">{t("Leave your CV", "Depune CV-ul")}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <Link to="/portal" className="hidden items-center gap-2 border-l test-divider pl-4 text-xs sm:flex"><UserRound size={16} />Staff login</Link>
          <Button variant="ghost" size="icon" className="test-icon lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        {menuOpen && <nav aria-label="Mobile navigation" className="test-mobile-nav absolute top-full inset-x-0 flex flex-col gap-5 px-6 py-6 text-sm lg:hidden">
          <Link to="/jobs">{t("Jobs & careers", "Locuri de muncă")}</Link>
          <Link to="/eu-candidate-information">{t("Working in Europe", "Munca în Europa")}</Link>
          <a href="#career-insights" onClick={() => setMenuOpen(false)}>{t("Career advice", "Sfaturi de carieră")}</a>
          <Link to="/contact">For employers</Link>
          <a href="/#cv">{t("Leave your CV", "Depune CV-ul")}</a>
          <Link to="/portal">Staff login</Link>
        </nav>}
      </header>

      <main>
        <section className="test-hero relative flex items-center overflow-hidden px-6 md:px-12 lg:px-16" aria-roledescription="carousel" aria-label={t("Career opportunities", "Oportunități de carieră")}>
          <img src={current.image} alt={current.alt} width={1920} height={1024} className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="test-hero-copy" aria-live="polite">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.16em]">{t("LOOKING FOR EASTERN. EUROPEAN TALENT?", "Talent românesc. Oportunități europene.")}</p>
            <h1 className="text-3xl leading-snug md:text-4xl">{current.title}</h1>
            <p className="mt-5 max-w-sm text-sm leading-7">{current.text}</p>
            <Button asChild variant="outline" className="test-outline mt-8 h-12 px-6 text-xs uppercase"><a href="/#cv">{t("Leave your CV", "Depune CV-ul")}<ArrowRight /></a></Button>
          </div>
          <div className="absolute bottom-7 right-6 z-10 flex items-center gap-2 md:right-12">
            <span className="mr-4 text-xs tabular-nums">0{slide + 1} / 02</span>
            <Button size="icon" className="test-icon" aria-label="Previous slide" onClick={() => setSlide((slide + 1) % 2)}><ArrowLeft /></Button>
            <Button size="icon" className="test-icon" aria-label="Next slide" onClick={() => setSlide((slide + 1) % 2)}><ArrowRight /></Button>
          </div>
        </section>

        <section className="px-6 py-9 md:px-12 lg:px-16">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-10 text-center md:px-14">
            <h2 className="text-xl font-normal leading-relaxed md:text-2xl">{t("Your next opportunity starts with a conversation.", "Următoarea oportunitate începe cu o conversație.")}</h2>
            <p className="max-w-xl text-sm leading-6">{t("Leave your CV and our Romanian team will contact you. No recruitment fee is ever charged to candidates.", "Depune CV-ul și echipa noastră din România te va contacta. Nu percepem niciodată taxe de recrutare candidaților.")}</p>
            <Button asChild variant="outline" className="test-outline h-12 px-8 text-xs uppercase"><a href="/#cv">{t("Connect with our team", "Contactează echipa noastră")}<ArrowRight /></a></Button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:px-16">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div><p className="test-muted mb-3 text-[10px] uppercase tracking-[0.16em]">{t("Explore your next move", "Explorează următorul pas")}</p><h2 className="text-2xl font-normal uppercase md:text-3xl">{t("People. Skills. Possibilities.", "Oameni. Abilități. Posibilități.")}</h2></div>
            <Link to="/jobs" className="flex items-center gap-3 text-xs uppercase">{t("Discover all jobs", "Descoperă toate posturile")}<ArrowRight size={17} /></Link>
          </div>
          <div className="grid gap-9 md:grid-cols-2">
            {stories.map(story => <Link to="/jobs" key={story.category} className="test-story group block">
              <div className="aspect-[16/10] overflow-hidden"><img src={story.image} alt={story.title} width={1536} height={1024} loading="lazy" className="test-story-image h-full w-full object-cover" /></div>
              <p className="test-muted mt-6 text-[10px] uppercase tracking-[0.12em]">{story.category}</p>
              <h3 className="mt-3 flex items-start justify-between gap-6 text-xl font-normal leading-8">{story.title}<ArrowRight className="mt-2 shrink-0" size={19} /></h3>
              <p className="test-muted mt-3 max-w-md text-sm leading-6">{story.text}</p>
            </Link>)}
          </div>
        </section>

        <TestCareerGallery />

        <section className="test-light mt-8 px-6 py-16 md:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-[10px] uppercase tracking-[0.16em]">For employers & staffing partners</p>
            <div className="grid items-start gap-8 md:grid-cols-2"><h2 className="max-w-lg text-3xl font-normal leading-snug">Romanian talent.<br />Direct European connections.</h2><div><p className="text-sm leading-7">Share your vacancy brief for warehousing, production, logistics or construction support. Our team screens candidates before client selection, with support at start and review.</p><Button asChild variant="outline" className="test-outline mt-7 h-12 px-6 text-xs uppercase"><a href="/#employers">Share a vacancy brief<ArrowRight /></a></Button></div></div>
          </div>
        </section>
      </main>
      <footer className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:px-16">
        <div className="flex flex-col justify-between gap-7 md:flex-row"><Link to="/" className="test-wordmark text-2xl">IONMAN<span>WORKFORCE</span></Link><div className="flex flex-wrap gap-x-7 gap-y-4 text-xs"><Link to="/contact">{t("Contact", "Contact")}</Link><Link to="/privacy">{t("Privacy & cookies", "Confidențialitate")}</Link><Link to="/terms">{t("Terms", "Termeni")}</Link><Link to="/">{t("Main website", "Site principal")}</Link></div></div>
        <div className="test-divider test-muted mt-8 flex flex-wrap justify-between gap-4 border-t pt-6 text-[11px]"><span>© {new Date().getFullYear()} ION MAN WORKFORCE S.R.L.</span><a href="mailto:contact@vreaujobs.eu">contact@vreaujobs.eu</a></div>
      </footer>
      <Button asChild size="icon" className="test-contact fixed bottom-5 right-5 z-30 size-12 rounded-full" title={t("Contact our team", "Contactează echipa")}><Link to="/contact" aria-label={t("Contact our team", "Contactează echipa")}><MessageCircle /></Link></Button>
    </div>
  );
}