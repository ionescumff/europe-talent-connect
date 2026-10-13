import { useState } from "react";
import { useLang } from "@/lib/i18n";
import imgWarehouse from "@/assets/hero-warehouse.jpg";
import imgProduction from "@/assets/test-workforce-production.jpg";
import imgLogistics from "@/assets/sector-logistics.jpg";
import imgConstruction from "@/assets/construction-editorial.jpg";

const IMAGES = [imgWarehouse, imgProduction, imgLogistics, imgConstruction];

export function Sectors() {
  const { t } = useLang();
  const [open, setOpen] = useState<string | null>(null);

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
      <div className="-mx-6 flex snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
        {sectors.map((s, i) => {
          const isOpen = open === s.n;
          return (
            <button
              type="button"
              key={s.n}
              onClick={() => setOpen(isOpen ? null : s.n)}
              aria-expanded={isOpen}
              className="group relative aspect-[3/4] w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl text-left shadow-glass focus-visible:outline-2 focus-visible:outline-accent md:w-auto"
            >
              <img
                src={IMAGES[i]}
                alt={s.title}
                loading="lazy"
                className={`absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isOpen ? "scale-105" : ""}`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-brand via-brand/40 to-transparent transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`} />
              <div className="absolute inset-x-0 bottom-0 p-5 text-brand-foreground">
                <div className="font-display text-xs font-bold tracking-[0.2em] text-accent">{s.n}</div>
                <h3 className="mt-2 font-display text-xl font-bold leading-tight">{s.title}</h3>
                <p className={`grid text-sm text-brand-foreground/80 transition-all duration-500 ${isOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 md:group-hover:mt-2 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100"}`}>
                  <span className="overflow-hidden">{s.text}</span>
                </p>
                <span className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-foreground/60 md:hidden">
                  {isOpen ? t("Tap to close", "Atinge pentru a închide") : t("Tap for details", "Atinge pentru detalii")}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-5 text-sm text-brand/60">
        {t("Skilled profiles can be sourced for specific briefs.", "Profiluri calificate pot fi recrutate pentru cerințe specifice.")}
      </p>
    </section>
  );
}
