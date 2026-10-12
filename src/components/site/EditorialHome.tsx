import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import type { Job } from "@/lib/jobs";
import construction from "@/assets/construction-editorial.jpg";
import warehouse from "@/assets/test-workforce-hero.jpg";
import production from "@/assets/test-workforce-production.jpg";

export function EditorialHome({ jobs }: { jobs: Job[] }) {
  const { t } = useLang();
  const sectors = [
    { image: construction, title: t("Construction support", "Suport în construcții"), text: t("Manual roles and support for construction teams.", "Roluri manuale și sprijin pentru echipele de construcții.") },
    { image: warehouse, title: t("Warehousing & logistics", "Depozite și logistică"), text: t("Order fulfilment, loading and general site work.", "Pregătirea comenzilor, încărcare și lucru pe teren.") },
    { image: production, title: t("Production & food", "Producție și sector alimentar"), text: t("Production, packing and food industry roles.", "Roluri în producție, ambalare și industria alimentară.") },
  ];
  const steps = [
    [t("Leave your CV", "Depune CV-ul"), t("Tell us about your experience and preferred country.", "Spune-ne ce experiență ai și în ce țară preferi să lucrezi.")],
    [t("Talk with our team", "Discută cu echipa"), t("We review your profile against confirmed vacancies.", "Analizăm profilul tău în raport cu posturile confirmate.")],
    [t("Review the offer", "Analizează oferta"), t("Client selection and approval take place before travel.", "Selecția și aprobarea angajatorului au loc înainte de plecare.")],
    [t("Start & follow-up", "Începere și evaluare"), t("Our process continues with support at start and review.", "Procesul continuă cu sprijin la începerea activității și evaluare.")],
  ];
  return <>
    <section className="public-hero relative flex items-end overflow-hidden px-6 pb-16 md:px-12 lg:px-16">
      <img src={construction} alt={t("Construction workers reviewing a plan", "Lucrători în construcții analizând un plan")} width={1920} height={1024} className="absolute inset-0 h-full w-full object-cover" />
      <div className="public-hero-copy relative z-10 max-w-2xl">
        <p className="mb-5 text-xs uppercase">{t("Romanian talent. European opportunities.", "Talent românesc. Oportunități europene.")}</p>
        <h1 className="text-4xl font-normal leading-tight md:text-6xl">IONMAN<br />Workforce</h1>
        <p className="mt-6 max-w-lg text-base leading-7">{t("Dutch–Romanian roots. Recruitment from Romania for construction support, warehousing, production and logistics in Germany and the Netherlands.", "Rădăcini olandeze și românești. Recrutare din România pentru construcții, depozite, producție și logistică în Germania și Olanda.")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-5"><Button asChild className="public-cta h-12 rounded-none px-7"><a href="#cv">{t("Leave your CV", "Depune CV-ul")}<ArrowRight /></a></Button><Link to="/jobs" className="flex items-center gap-3 text-sm">{t("Explore jobs", "Vezi locurile de muncă")}<ArrowRight size={17} /></Link></div>
        <p className="mt-5 text-xs">{t("No recruitment fee is ever charged to candidates.", "Nu percepem niciodată taxe de recrutare candidaților.")}</p>
      </div>
      <a href="#sectors" aria-label={t("Explore sectors", "Explorează domeniile")} className="absolute bottom-7 right-7 z-10"><ArrowDown size={24} /></a>
    </section>
    <section id="sectors" className="public-dark-band px-6 py-14 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl"><div className="mb-9 flex flex-wrap items-end justify-between gap-5"><div><p className="public-dim mb-4 text-xs uppercase">{t("People. Skills. Possibilities.", "Oameni. Abilități. Posibilități.")}</p><h2 className="text-3xl font-normal">{t("Where your experience belongs.", "Unde experiența ta contează.")}</h2></div><Link to="/jobs" className="flex items-center gap-3 text-xs uppercase">{t("View published jobs", "Vezi posturile publicate")}<ArrowRight size={18} /></Link></div>
        <div className="grid gap-8 md:grid-cols-3">{sectors.map(sector => <article key={sector.title}><img src={sector.image} alt={sector.title} width={1536} height={1024} loading="lazy" className="aspect-[4/3] w-full object-cover" /><h3 className="mt-5 text-xl font-normal">{sector.title}</h3><p className="public-dim mt-3 text-sm leading-6">{sector.text}</p></article>)}</div>
      </div>
    </section>
    <section className="px-6 py-14 md:px-12 lg:px-16"><div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="public-muted mb-4 text-xs uppercase">{t("Published opportunities", "Oportunități publicate")}</p><h2 className="text-3xl font-normal">{t("Your next move.", "Următorul tău pas.")}</h2></div><Link to="/jobs" className="flex items-center gap-3 text-sm">{t("All jobs", "Toate posturile")}<ArrowRight size={18} /></Link></div>
      {jobs.length ? <div className="grid gap-7 md:grid-cols-3">{jobs.slice(0, 3).map(job => <Link key={job.slug} to="/jobs/$slug" params={{ slug: job.slug }} className="public-job border-b pb-6">{job.image && <img src={job.image} alt={job.title} loading="lazy" width={1200} height={675} className="mb-5 aspect-video w-full object-cover" />}<p className="public-muted text-xs uppercase">{job.sector}</p><h3 className="mt-3 text-xl font-normal">{job.title}</h3><p className="public-muted mt-3 flex items-center gap-2 text-sm"><MapPin size={15} />{job.city}, {job.country}</p><p className="mt-3 text-sm">{job.pay || t("Salary not specified", "Salariu nespecificat")}</p><span className="mt-5 flex items-center gap-3 text-sm">{t("View details", "Vezi detaliile")}<ArrowRight size={17} /></span></Link>)}</div> : <div className="public-empty border-y py-8"><p className="text-lg">{t("No published vacancies at the moment.", "Momentan nu sunt posturi publicate.")}</p><p className="public-muted mt-3 max-w-xl text-sm leading-6">{t("Leave your CV for construction, warehousing, logistics or production. Our team will contact you about suitable confirmed vacancies.", "Depune CV-ul pentru construcții, depozite, logistică sau producție. Echipa te va contacta pentru posturi confirmate potrivite.")}</p><Button asChild variant="link" className="mt-4 px-0"><a href="#cv">{t("Leave your CV", "Depune CV-ul")}<ArrowRight /></a></Button></div>}
    </div></section>
    <section id="process" className="public-process px-6 py-14 md:px-12 lg:px-16"><div className="mx-auto max-w-7xl"><p className="public-muted mb-4 text-xs uppercase">{t("From first contact to your first day", "De la primul contact la prima zi")}</p><h2 className="text-3xl font-normal">{t("A clear path forward.", "Un drum clar înainte.")}</h2><ol className="mt-9 grid gap-8 md:grid-cols-4">{steps.map(([heading, text], index) => <li key={heading} className="border-t pt-5"><div className="flex items-center justify-between"><span className="public-muted text-sm">0{index + 1}</span>{index < 3 && <ArrowRight size={18} />}</div><h3 className="mt-5 text-lg font-normal">{heading}</h3><p className="public-muted mt-3 text-sm leading-6">{text}</p></li>)}</ol></div></section>
  </>;
}