import { useState } from "react";
import { useLang } from "@/lib/i18n";
import warehouse from "@/assets/sector-real-warehouse.jpg.asset.json";
import production from "@/assets/sector-real-manufacturing.jpg.asset.json";
import logistics from "@/assets/sector-real-logistics.jpg.asset.json";
import construction from "@/assets/sector-real-construction.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Plus, Minus } from "lucide-react";

const IMAGES = [warehouse.url, production.url, logistics.url, construction.url];

export function Sectors() {
  const { t } = useLang();
  const [open, setOpen] = useState<string | null>(null);

  const sectors = [
    {
      n: "01",
      title: t("Warehousing & fulfilment", "Depozite și pregătirea comenzilor"),
      text: t("Picking, packing and order-fulfilment lines at peak and steady volume.", "Pregătirea, ambalarea și procesarea comenzilor în depozite."),
    },
    {
      n: "02",
      title: t("Production & food", "Producție și sector alimentar"),
      text: t("Packing, sorting and food-line operators ready for shift rotation.", "Operatori pentru ambalare, sortare și linii alimentare, gata de lucru în schimburi."),
    },
    {
      n: "03",
      title: t("Logistics & site work", "Logistică și încărcare"),
      text: t("Loading, unloading and general site support crews for depots and yards.", "Încărcarea și descărcarea mărfurilor, cu sprijin pentru activitățile din depozite și platforme logistice."),
    },
    {
      n: "04",
      title: t("Construction support", "Construcții și lucrări de sprijin"),
      text: t("Trades assistance and manual labour for fast-moving build phases.", "Sprijin pentru meseriași și muncă manuală în diferite etape ale construcției."),
    },
  ];

  return (
    <section id="sectors" className="home-sectors relative scroll-mt-24 px-6 pb-16 md:px-8 lg:px-14">
      <div className="mb-5 font-display text-xs font-bold uppercase tracking-[0.2em] text-brand/50">
        {t("Sectors we staff", "Sectoare în care recrutăm")}
      </div>
      <div className="-mx-6 flex snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
        {sectors.map((s, i) => {
          const isOpen = open === s.n;
          return (
            <Button
              variant="ghost"
              type="button"
              key={s.n}
              onClick={() => setOpen(isOpen ? null : s.n)}
              aria-expanded={isOpen}
              className="group relative block h-auto w-[82%] shrink-0 snap-start overflow-hidden rounded-none p-0 text-left whitespace-normal hover:bg-transparent md:w-auto"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-brand/5">
              <img
                src={IMAGES[i]}
                alt={s.title}
                loading="lazy"
                className={`absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none group-hover:scale-[1.04] ${isOpen ? "scale-[1.04]" : ""}`}
              />
              <span className="absolute bottom-4 right-4 flex size-10 items-center justify-center bg-background text-brand"><ArrowUpRight className="transition-transform duration-500 motion-reduce:transition-none group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </div>
              <div className="border-b border-brand/20 py-4 text-brand">
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="font-display text-xs font-bold text-brand/50">{s.n}</div>
                <h3 className="mt-2 font-display text-lg font-bold leading-tight">{s.title}</h3></div>{isOpen ? <Minus className="mt-5 shrink-0" /> : <Plus className="mt-5 shrink-0" />}</div>
                <p className={`grid text-sm font-normal text-brand/70 transition-all duration-500 motion-reduce:transition-none ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <span className="overflow-hidden leading-relaxed">{s.text}</span>
                </p>
              </div>
            </Button>
          );
        })}
      </div>
      <p className="mt-5 text-sm text-brand/60">
        {t("Skilled profiles can be sourced for specific briefs.", "Putem căuta și candidați calificați, în funcție de cerințele postului.")}
      </p>
      <p className="mt-2 text-xs text-brand/50">{t("Illustrative workplace photography — not photos of our teams or client sites.", "Fotografii ilustrative — nu reprezintă echipele noastre sau locațiile clienților.")}</p>
    </section>
  );
}
