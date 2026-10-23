import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export function Process() {
  const { t } = useLang();

  const steps = [
    {
      title: t("Vacancy brief", "Oferta de muncă"),
      text: t("Role, location, conditions, headcount and start date — housing details confirmed when accommodation is offered.", "Rol, locație, condiții, număr de persoane și data începerii — detaliile cazării, dacă este oferită, sunt confirmate de la început."),
    },
    {
      title: t("Search & screening", "Căutare și selecție"),
      text: t("Direct Romanian outreach, eligibility checks and role-based screening.", "Contact direct în România, verificarea eligibilității și selecție în funcție de cerințele postului."),
    },
    {
      title: t("Client selection", "Selecția angajatorului"),
      text: t("Profiles, interviews and approval before anyone travels.", "Profiluri, interviuri și confirmarea angajatorului înainte de plecare."),
    },
    {
      title: t("Start & review", "Începerea activității și evaluare"),
      text: t("Joining details confirmed, then delivery reviewed before scaling.", "Confirmăm detaliile începerii activității și evaluăm colaborarea înainte de extindere."),
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
            <p className="mt-4 text-sm leading-relaxed text-brand-foreground/75">
              {t(
                "A transparent process for Romanian candidates and employers in the Netherlands and Germany. We confirm the role and conditions before travel. Recruitment is always free for candidates.",
                "Un proces transparent pentru candidații români și angajatorii din Olanda și Germania. Confirmăm postul și condițiile înainte de plecare. Recrutarea este întotdeauna gratuită pentru candidați."
              )}
            </p>
            <Button asChild className="mt-8 h-auto rounded-full bg-accent p-0 text-accent-foreground hover:bg-accent/90"><a
              href="#cv"
              className="inline-block rounded-full px-7 py-3.5 font-semibold shadow-accent transition-transform hover:-translate-y-0.5"
            >
              {t("Leave your CV", "Trimite CV-ul")}
            </a></Button>
          </div>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="flex items-start gap-4 border-b border-brand-foreground/15 py-5 last:border-0"
              >
                <span className="w-8 shrink-0 font-display text-2xl font-extrabold text-accent">{i + 1}</span>
                <div>
                  <div className="font-display font-bold text-brand-foreground">{s.title}</div>
                  <div className="mt-2 text-sm leading-6 text-brand-foreground/75">{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
