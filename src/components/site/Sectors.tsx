import { useLang } from "@/lib/i18n";

export function Sectors() {
  const { t } = useLang();

  const sectors = [
    {
      n: "01",
      title: t("Warehousing & fulfilment", "Depozitare și logistică"),
      text: t("Picking, packing and order-fulfilment lines at peak and steady volume.", "Picking, ambalare și linii de procesare a comenzilor."),
    },
    {
      n: "02",
      title: t("Production & food", "Producție și sector alimentar"),
      text: t("Packing, sorting and food-line operators ready for shift rotation.", "Operatori pentru ambalare, sortare și linii alimentare, gata de lucru în schimburi."),
    },
    {
      n: "03",
      title: t("Logistics & site work", "Logistică și lucru pe teren"),
      text: t("Loading, unloading and general site support crews for depots and yards.", "Încărcare, descărcare și echipe de suport pentru depozite și curți exterioare."),
    },
    {
      n: "04",
      title: t("Construction support", "Suport construcții"),
      text: t("Trades assistance and manual labour for fast-moving build phases.", "Asistență meseriași și muncă manuală pentru faze de construcție rapide."),
    },
  ];

  return (
    <section id="sectors" className="relative scroll-mt-24 px-6 pb-16 md:px-8 lg:px-14">
      <div className="mb-5 font-display text-xs font-bold uppercase tracking-[0.2em] text-brand/50">
        {t("Sectors we staff", "Sectoare în care recrutăm")}
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {sectors.map((s) => (
          <div
            key={s.n}
            className="glass-card rounded-3xl p-6 transition-transform hover:-translate-y-1"
          >
            <div className="grid size-11 place-items-center rounded-xl bg-accent/15 font-display font-bold text-accent">
              {s.n}
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-brand/60">{s.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-brand/60">
        {t("Skilled profiles can be sourced for specific briefs.", "Profiluri calificate pot fi recrutate pentru cerințe specifice.")}
      </p>
    </section>
  );
}
