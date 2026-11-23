import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export function SeoIntro() {
  const { t } = useLang();
  return <section className="px-6 py-14 md:px-12 lg:px-16">
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
      <div>
        <h2 className="font-display text-2xl font-bold md:text-3xl">{t("Work in the Netherlands", "Muncitori în Olanda")}</h2>
        <p className="mt-3 text-sm leading-7 text-brand/70">{t("We connect Romanian and European workers with employers in the Netherlands in warehousing, logistics and production. Each vacancy shows only the conditions confirmed by the employer.", "Conectăm muncitori din România și din alte țări europene cu angajatori din Olanda, în depozite, logistică și producție. Fiecare anunț arată doar condițiile confirmate de angajator.")}</p>
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold md:text-3xl">{t("Work in Germany", "Muncitori în Germania")}</h2>
        <p className="mt-3 text-sm leading-7 text-brand/70">{t("We also recruit workers for employers in Germany in construction, production and logistics. The interview is free and candidates are hired directly by the employer.", "Recrutăm și muncitori pentru angajatori din Germania, în construcții, producție și logistică. Interviul este gratuit, iar candidații sunt angajați direct de angajator.")}</p>
      </div>
    </div>
    <p className="mx-auto mt-8 max-w-5xl text-sm"><Link to="/jobs" className="underline underline-offset-4">{t("See all jobs in the Netherlands and Germany", "Vezi toate locurile de muncă din Olanda și Germania")}</Link></p>
  </section>;
}
