import heroImage from "@/assets/hero-warehouse.jpg";

const trust = ["Free for candidates", "Housing confirmed in brief", "Start & review support"];

export function Hero() {
  return (
    <section className="relative px-6 pt-6 pb-16 md:px-8 lg:px-14 lg:pt-8">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-brand/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand/70 animate-rise">
            <span className="size-2 rounded-full bg-accent" />
            Romanian talent · EU destinations
          </div>
          <h1
            className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl animate-rise"
            style={{ animationDelay: "80ms" }}
          >
            Fill the <span className="text-accent">labour gap</span> with vetted European crews.
          </h1>
          <p
            className="mt-6 max-w-lg text-lg leading-relaxed text-brand/70 animate-rise"
            style={{ animationDelay: "160ms" }}
          >
            Dutch–Romanian roots, direct access in Romania. We source warehousing, production,
            logistics and construction support talent for the Netherlands &amp; Germany — no fee
            ever charged to candidates.
          </p>
          <div
            className="mt-8 flex flex-wrap items-center gap-4 animate-rise"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#cv"
              className="rounded-full bg-brand px-8 py-4 text-base font-semibold text-brand-foreground shadow-brand transition-transform hover:-translate-y-0.5"
            >
              Leave your CV
            </a>
            <a
              href="#employers"
              className="rounded-full border border-brand/20 px-6 py-4 font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              Post a vacancy brief
            </a>
          </div>
          <div
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-brand/60 animate-rise"
            style={{ animationDelay: "320ms" }}
          >
            {trust.map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto min-h-[440px] w-full max-w-md lg:max-w-none lg:min-h-[520px]">
          <div className="absolute -top-4 -right-2 w-[78%] rotate-[7deg] overflow-hidden rounded-[2rem] border border-glass-border shadow-glass lg:-right-6 animate-float">
            <img
              src={heroImage}
              alt="Workers in hi-vis vests walking through a warehouse"
              width={1024}
              height={1280}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 flex aspect-[4/5] w-[62%] -rotate-[6deg] flex-col justify-between rounded-[2rem] border border-brand-foreground/10 bg-brand/90 p-6 shadow-brand backdrop-blur-xl">
            <div className="font-display text-2xl font-bold leading-tight text-brand-foreground">
              Direct access, no middlemen.
            </div>
            <div className="text-sm text-brand-foreground/70">
              Our Romanian team screens every CV before it reaches the client selection stage.
            </div>
          </div>
          <div className="absolute top-8 left-2 z-10 -rotate-[4deg] rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-accent">
            No recruitment fee to candidates
          </div>
        </div>
      </div>
    </section>
  );
}
