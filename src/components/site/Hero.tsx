import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-warehouse.jpg";
import { useLang } from "@/lib/i18n";

export function Hero() {
  const { t } = useLang();
  
  const trust = [
    t("Free for candidates", "Gratuit pentru candidați"),
    t("Conditions confirmed before travel", "Condiții confirmate înainte de plecare"),
    t("Support from our team", "Sprijin din partea echipei")
  ];

  return (
    <section className="home-hero relative px-6 pt-6 pb-16 md:px-8 lg:px-14 lg:pt-8">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-brand/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand/70 animate-rise">
            <span className="size-2 rounded-full bg-accent" />
            {t("Romanian talent · EU destinations", "Candidați din România · Oportunități în Europa")}
          </div>
          <h1
            className="mt-6 font-display text-4xl font-extrabold leading-[1.12] md:text-5xl lg:text-6xl animate-rise"
            style={{ animationDelay: "80ms" }}
          >
            {t("Work in ", "Lucrează în ")}
            <span className="text-accent">{t("Germany or the Netherlands", "Germania sau Olanda")}</span>
            {t(" with IONMAN Workforce.", " cu IONMAN Workforce.")}
          </h1>
          <p
            className="mt-6 max-w-lg text-lg leading-relaxed text-brand/70 animate-rise"
            style={{ animationDelay: "160ms" }}
          >
            {t(
              "Looking for work in warehousing, production, logistics or construction? Send your CV and our Romanian–Dutch team will contact you about suitable confirmed vacancies. Recruitment is free for candidates.",
              "Cauți un loc de muncă în depozite, producție, logistică sau construcții? Trimite CV-ul, iar echipa noastră româno-olandeză te va contacta pentru oportunități confirmate, potrivite experienței tale. Recrutarea este gratuită pentru candidați."
            )}
          </p>
          <div
            className="mt-8 flex flex-wrap items-center gap-4 animate-rise"
            style={{ animationDelay: "240ms" }}
          >
            <Button asChild className="h-auto rounded-full p-0"><a
              href="#cv"
              className="rounded-full bg-brand px-8 py-4 text-base font-semibold text-brand-foreground shadow-brand transition-transform hover:-translate-y-0.5"
            >
              {t("Leave your CV", "Trimite CV-ul")}
            </a></Button>
            <Button asChild variant="ghost" className="h-auto rounded-full p-0"><a
              href="/jobs"
              className="rounded-full border border-brand/20 px-6 py-4 font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              {t("View available jobs", "Vezi locurile de muncă")}
            </a></Button>
          </div>
          <div
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-brand/60 animate-rise"
            style={{ animationDelay: "320ms" }}
          >
            {trust.map((tStr) => (
              <span key={tStr} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" />
                {tStr}
              </span>
            ))}
          </div>
          <div
            className="mt-7 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-accent animate-rise"
            style={{ animationDelay: "400ms" }}
          >
            {t("No recruitment fee to candidates", "Fără taxe de recrutare pentru candidați")}
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md flex-col gap-4 lg:block lg:max-w-none lg:min-h-[520px]">
          <div className="group relative w-full overflow-hidden rounded-[1.5rem] border border-glass-border shadow-glass lg:absolute lg:-top-4 lg:-right-6 lg:w-[78%] lg:rounded-[2rem]">
            <img
              src={heroImage}
              alt={t("Workers in hi-vis vests walking through a warehouse", "Muncitori în veste reflectorizante mergând printr-un depozit")}
              width={1024}
              height={1280}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 lg:aspect-[3/4]"
            />
          </div>
          <div className="relative flex w-full flex-col justify-between gap-6 overflow-hidden rounded-[1.5rem] lg:absolute lg:bottom-0 lg:left-0 lg:aspect-[4/5] lg:w-[62%]  lg:gap-0 lg:rounded-[2rem] border border-brand-foreground/10 bg-brand p-6 shadow-brand backdrop-blur-xl">
            <div className="relative">
              <div className="font-display text-2xl font-bold leading-tight text-brand-foreground">
                {t("Direct access, no middlemen.", "Acces direct, fără intermediari.")}
              </div>
            </div>
            <ul className="relative flex flex-col">
              {[
                t("Vacancy brief", "Oferta de muncă"),
                t("Search & screening", "Căutare și selecție"),
                t("Client selection", "Selecția angajatorului"),
                t("Start & review", "Începerea activității și evaluare")
              ].map(
                (step, i) => (
                  <li key={step} className="relative flex gap-3.5 pb-3 last:pb-0">
                    {i < 3 && (
                      <span
                        className="absolute left-[13px] top-7 bottom-0 w-px bg-gradient-to-b from-accent/60 to-accent/10"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-accent/15 font-display text-[11px] font-bold text-accent">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-sm font-medium text-brand-foreground/90">
                      {step}
                    </span>
                  </li>
                ),
              )}
            </ul>
            <div className="relative rounded-xl border border-brand-foreground/10 bg-brand-foreground/5 p-3.5 text-[13px] leading-relaxed text-brand-foreground/75">
              {t("Our Romanian team screens every CV before it reaches the client selection stage.", "Echipa noastră din România verifică fiecare CV înainte de etapa selecției finale.")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
