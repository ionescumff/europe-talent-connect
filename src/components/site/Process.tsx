import { useLang } from "@/lib/i18n";

export function Process() {
  const { t } = useLang();

  const steps = [
    {
      title: t("Vacancy brief", "Oferta de muncă"),
      text: t("Role, location, conditions, headcount and start date — housing details confirmed upfront.", "Rol, locație, condiții, număr de persoane și data de start — detaliile despre cazare sunt confirmate anticipat."),
    },
    {
      title: t("Search & screening", "Căutare și selecție"),
      text: t("Direct Romanian outreach, eligibility checks and role-based screening.", "Contact direct în România, verificarea eligibilității și selecție pe baza rolului."),
    },
    {
      title: t("Client selection", "Selecția clientului"),
      text: t("Profiles, interviews and approval before anyone travels.", "Profiluri, interviuri și aprobare înainte de orice deplasare."),
    },
    {
      title: t("Start & review", "Început și evaluare"),
      text: t("Joining details confirmed, then delivery reviewed before scaling.", "Confirmarea detaliilor de început, apoi evaluarea performanței înainte de extindere."),
    },
  ];

  return (
    <section id="process" className="relative scroll-mt-24 px-6 pb-20 md:px-8 lg:px-14">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-brand shadow-brand">
        <div className="bg-brand-lines absolute inset-0 opacity-40" />
        <div className="relative grid gap-10 p-8 md:p-10 lg:grid-cols-[1fr_1.1fr] lg:p-14">
          <div>
            <h2 className="font-display text-3xl font-extrabold leading-tight text-brand-foreground md:text-4xl">
              {t("Four steps from vacancy brief to first shift.", "Patru pași de la oferta de muncă la prima zi de lucru.")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-foreground/60">
              {t(
                "A transparent process built with Dutch and German employers and Romanian candidates in mind. Placement fee agreed before selection, payable once the agreed start and trial conditions are met.",
                "Un proces transparent construit pentru angajatorii din Olanda și Germania și candidații români. Comisionul de plasare este agreat înainte de selecție și se plătește la îndeplinirea condițiilor de start și probă."
              )}
            </p>
            <a
              href="#employers"
              className="mt-8 inline-block rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("Post a vacancy brief", "Publică o ofertă de muncă")}
            </a>
          </div>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="flex items-start gap-5 rounded-2xl border border-brand-foreground/10 bg-brand-foreground/5 p-5 backdrop-blur-md"
              >
                <span className="w-8 font-display text-2xl font-extrabold text-accent">{i + 1}</span>
                <div>
                  <div className="font-display font-bold text-brand-foreground">{s.title}</div>
                  <div className="text-sm text-brand-foreground/60">{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
