const sectorsRaw = [
  {
    n: "01",
    title: "Warehousing & fulfilment",
    text: "Picking, packing and order-fulfilment lines at peak and steady volume.",
  },
  {
    n: "02",
    title: "Production & food",
    text: "Packing, sorting and food-line operators ready for shift rotation.",
  },
  {
    n: "03",
    title: "Logistics & site work",
    text: "Loading, unloading and general site support crews for depots and yards.",
  },
  {
    n: "04",
    title: "Construction support",
    text: "Trades assistance and manual labour for fast-moving build phases.",
  },
];

export function Sectors() {
  return (
    <section id="sectors" className="relative scroll-mt-24 px-6 pb-16 md:px-8 lg:px-14">
      <div className="mb-5 font-display text-xs font-bold uppercase tracking-[0.2em] text-brand/50">
        Sectors we staff
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
        Skilled profiles can be sourced for specific briefs.
      </p>
    </section>
  );
}
