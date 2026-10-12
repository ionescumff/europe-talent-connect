import { ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import heroImage from "@/assets/test-workforce-hero.jpg";

export function Hero() {
  const { t } = useLang();
  
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden px-6 md:px-12 lg:px-16 bg-brand">
      <img 
        src={heroImage} 
        alt="Logistics professionals" 
        className="absolute inset-0 h-full w-full object-cover object-center opacity-40 mix-blend-overlay"
      />
      <div className="relative z-10 max-w-3xl">
        <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          {t("Romanian recruitment partner", "Partener de recrutare român")}
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
          {t("Bridging talent with European industry.", "Conectăm talentul cu industria europeană.")}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80">
          {t(
            "Ethical recruitment for warehousing, production, and construction in the Netherlands and Germany. We handle the screening, you handle the growth.",
            "Recrutare etică pentru depozitare, producție și construcții în Olanda și Germania. Noi ne ocupăm de selecție, voi de creștere."
          )}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#cv"
            className="flex h-14 items-center gap-3 rounded-full bg-accent px-8 text-sm font-bold uppercase tracking-widest text-accent-foreground shadow-xl transition-transform hover:-translate-y-1"
          >
            {t("Leave your CV", "Depune CV-ul")} <ArrowRight size={18} />
          </a>
          <a
            href="/jobs"
            className="flex h-14 items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white/10"
          >
            {t("View roles", "Vezi posturile")}
          </a>
        </div>
      </div>
    </section>
  );
}
