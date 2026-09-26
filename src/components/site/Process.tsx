const stepsRaw = [
  {
    title: "Vacancy brief",
    text: "Role, location, conditions, headcount and start date — housing details confirmed upfront.",
  },
  {
    title: "Search & screening",
    text: "Direct Romanian outreach, eligibility checks and role-based screening.",
  },
  {
    title: "Client selection",
    text: "Profiles, interviews and approval before anyone travels.",
  },
  {
    title: "Start & review",
    text: "Joining details confirmed, then delivery reviewed before scaling.",
  },
];

export function Process() {
  return (
    <section id="process" className="relative scroll-mt-24 px-6 pb-20 md:px-8 lg:px-14">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-brand shadow-brand">
        <div className="bg-brand-lines absolute inset-0 opacity-40" />
        <div className="relative grid gap-10 p-8 md:p-10 lg:grid-cols-[1fr_1.1fr] lg:p-14">
          <div>
            <h2 className="font-display text-3xl font-extrabold leading-tight text-brand-foreground md:text-4xl">
              Four steps from vacancy brief to first shift.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-foreground/60">
              A transparent process built with Dutch and German employers and Romanian candidates
              in mind. Placement fee agreed before selection, payable once the agreed start and
              trial conditions are met.
            </p>
            <a
              href="#employers"
              className="mt-8 inline-block rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              Post a vacancy brief
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
