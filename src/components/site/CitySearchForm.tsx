import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { citySlug, isCityCountry, type CityCountry } from "@/lib/city-jobs";

export function CitySearchForm({ initialCountry = "netherlands", initialCity = "" }: { initialCountry?: CityCountry; initialCity?: string }) {
  const { t } = useLang();
  const navigate = useNavigate();
  const [country, setCountry] = useState<CityCountry>(initialCountry);
  const [city, setCity] = useState(initialCity);
  const [error, setError] = useState(false);
  return <form className="grid gap-4 border-y py-6 md:grid-cols-[1fr_2fr_auto]" onSubmit={event => {
    event.preventDefault();
    const slug = citySlug(city);
    if (!slug) { setError(true); return; }
    setError(false);
    void navigate({ to: "/jobs/cities/$country/$city", params: { country, city: slug } });
  }}>
    <label className="min-w-0 text-sm">{t("Country", "Țară")}<select aria-label={t("Country", "Țară")} className="field mt-2" value={country} onChange={event => { if (isCityCountry(event.target.value)) setCountry(event.target.value); }}><option value="netherlands">{t("Netherlands", "Olanda")}</option><option value="germany">{t("Germany", "Germania")}</option></select></label>
    <label className="min-w-0 text-sm">{t("City", "Oraș")}<span className="relative mt-2 block"><MapPin className="pointer-events-none absolute left-3 top-4 size-4" /><input aria-label={t("City", "Oraș")} className="field pl-10" required maxLength={100} value={city} onChange={event => setCity(event.target.value)} placeholder={t("Enter a city name", "Introdu numele orașului")} aria-invalid={error} aria-describedby={error ? "city-search-error" : undefined} /></span></label>
    <Button type="submit" className="public-cta h-12 self-end rounded-none">{t("Search", "Caută")}<ArrowRight /></Button>
    {error && <p id="city-search-error" role="alert" className="text-sm md:col-span-3">{t("Enter a valid city name.", "Introdu un nume de oraș valid.")}</p>}
  </form>;
}