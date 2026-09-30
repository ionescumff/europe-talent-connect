import heroImage from "@/assets/hero-warehouse.jpg";
import { useLang } from "@/lib/i18n";

export function Hero() {
  const { t } = useLang();
  
  const trust = [
    t("Free for candidates", "Gratuit pentru candidați"),
    t("Housing confirmed in brief", "Cazare confirmată în ofertă"),
    t("Start & review support", "Suport la plecare și evaluare")
  ];

  return (
    <section className="relative px-6 pt-6 pb-16 md:px-8 lg:px-14 lg:pt-8">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-brand/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand/70 animate-rise">
            <span className="size-2 rounded-full bg-accent" />
            {t("Romanian talent · EU destinations", "Talent românesc · Destinații UE")}
          </div>
          <h1
            className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl animate-rise"
            style={{ animationDelay: "80ms" }}
          >
            {t("Fill the ", "Acoperă ")}
            <span className="text-accent">{t("labour gap", "deficitul de forță de muncă")}</span>
            {t(" with vetted European crews.", " cu echipe europene verificate.")}
          </h1>
          <p
            className="mt-6 max-w-lg text-lg leading-relaxed text-brand/70 animate-rise"
            style={{ animationDelay: "160ms" }}
          >
            {t(
              "Dutch–Romanian roots, direct access in Romania and the Netherlands. We source warehousing, production, logistics and construction support talent for employers in Germany and the Netherlands — no fee ever charged to candidates.",
              "Rădăcini olandezo-române, acces direct în România și Olanda. Recrutăm personal pentru depozite, producție, logistică și construcții pentru angajatori din Germania și Olanda — fără nicio taxă pentru candidați."
            )}
          </p>
          <div
            className="mt-8 flex flex-wrap items-center gap-4 animate-rise"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#cv"
              className="rounded-full bg-brand px-8 py-4 text-base font-semibold text-brand-foreground shadow-brand transition-transform hover:-translate-y-0.5"
            >
              {t("Leave your CV", "Depune CV-ul")}
            </a>
            <a
              href="#employers"
              className="rounded-full border border-brand/20 px-6 py-4 font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              {t("Post a vacancy brief", "Publică o ofertă de muncă")}
            </a>
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
        </div>

        <div className="relative mx-auto min-h-[440px] w-full max-w-md lg:max-w-none lg:min-h-[520px]">
          <div className="absolute -top-4 -right-2 w-[78%] rotate-[7deg] overflow-hidden rounded-[2rem] border border-glass-border shadow-glass lg:-right-6 animate-float">
            <img
              src={heroImage}
              alt={t("Workers in hi-vis vests walking through a warehouse", "Muncitori în veste reflectorizante mergând printr-un depozit")}
              width={1024}
              height={1280}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 flex aspect-[4/5] w-[62%] -rotate-[6deg] flex-col justify-between rounded-[2rem] border border-brand-foreground/10 bg-brand/90 p-6 shadow-brand backdrop-blur-xl">
            <div className="font-display text-2xl font-bold leading-tight text-brand-foreground">
              {t("Direct access, no middlemen.", "Acces direct, fără intermediari.")}
            </div>
            <ul className="flex flex-col gap-2.5">
              {[
                t("Vacancy brief", "Oferta de muncă"),
                t("Search & screening", "Căutare și selecție"),
                t("Client selection", "Selecția clientului"),
                t("Start & review", "Început și evaluare")
              ].map(
                (step, i) => (
                  <li
                    key={step}
                    className="flex items-center gap-3 border-t border-brand-foreground/10 pt-2.5 text-sm text-brand-foreground/85"
                  >
                    <span className="font-display text-xs font-bold text-accent">
                      0{i + 1}
                    </span>
                    {step}
                  </li>
                ),
              )}
            </ul>
            <div className="text-sm text-brand-foreground/70">
              {t("Our Romanian team screens every CV before it reaches the client selection stage.", "Echipa noastră din România verifică fiecare CV înainte de etapa selecției finale.")}
            </div>
          </div>
          <div className="absolute top-8 left-2 z-10 -rotate-[4deg] rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-accent">
            {t("No recruitment fee to candidates", "Fără taxe de recrutare pentru candidați")}
          </div>
        </div>
      </div>
    </section>
  );
}
