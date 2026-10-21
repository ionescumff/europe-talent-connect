import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

/**
 * Candidate-facing invitation shown immediately before the CV form.
 */
export function CandidateBand() {
  const { t } = useLang();

  const pre = t("Want to work abroad — ", "Vrei să lucrezi în ");
  const destOne = t("Germany", "Germania");
  const between = t(", the ", " sau în ");
  const destTwo = t("Netherlands", "Olanda");
  const post = t(", anywhere in Europe?", " sau în altă țară din Europa?");

  return (
    <section
      id="candidates"
      className="relative scroll-mt-24 px-6 pb-6 md:px-8 lg:px-14"
      aria-labelledby="candidate-band-title"
    >
      <div className="relative border-t border-brand/15 px-0 py-10 md:py-12">
        <div className="relative max-w-4xl">
          <div className="h-px w-12 bg-accent" aria-hidden="true" />
          <h2
            id="candidate-band-title"
            className="mt-6 font-display text-3xl font-extrabold leading-[1.12] tracking-tight md:text-4xl lg:text-[2.75rem]"
          >
            {pre}
            <span className="text-accent">{destOne}</span>
            {between}
            <span className="text-accent">{destTwo}</span>
            {post}
          </h2>
          <div className="mt-8">
            <Button asChild className="h-auto rounded-full p-0"><a
              href="#cv"
              className="inline-block rounded-full bg-accent px-8 py-4 text-base font-semibold text-accent-foreground shadow-accent transition-transform hover:-translate-y-0.5"
            >
              {t("Apply with us!", "Aplică cu noi!")}
            </a></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
