import { useEffect, useState } from "react";
import { ExternalLink, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { cityCountries, type CityCountry } from "@/lib/city-jobs";

// Managed credentials must not be used on custom or credential-bearing preview hosts.
// Switch this policy only after linking a domain-authorized, user-owned connection.
const connectionMode: "managed" | "custom" = "managed";

export function CityMap({ country, city }: { country: CityCountry; city: string }) {
  const { t, lang } = useLang();
  const [hostAllowed, setHostAllowed] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const host = window.location.hostname;
    const credentialBearing = host.includes("-devserver-");
    setHostAllowed(!credentialBearing && (String(connectionMode) === "custom" || host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com")));
    setOpen(false);
  }, [country, city]);
  const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
  const tracking = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"];
  const query = `${city}, ${cityCountries[country].country}`;
  const params = new URLSearchParams({ key: key ?? "", q: query, zoom: "11", language: lang, region: cityCountries[country].region, channel: tracking ?? "" });
  const external = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  return <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start" aria-label={t("City map", "Harta orașului")}>
    <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl">{t("City map", "Harta orașului")}</h2>{open && <Button variant="ghost" size="icon" title={t("Close map", "Închide harta")} aria-label={t("Close map", "Închide harta")} onClick={() => setOpen(false)}><X /></Button>}</div>
    <div className="city-map-frame flex items-center justify-center bg-glass">
      {open && hostAllowed && key ? <iframe className="h-full w-full border-0" src={`https://www.google.com/maps/embed/v1/place?${params}`} title={t(`Google Maps: ${city}`, `Google Maps: ${city}`)} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <div className="px-6 py-10 text-center"><MapPin className="mx-auto mb-5 size-8" /><p className="text-xl">{city}</p><p className="public-muted mt-2 text-sm">{t(cityCountries[country].country, cityCountries[country].ro)}</p>{hostAllowed && key ? <><p className="public-muted mx-auto mt-5 max-w-xs text-sm leading-6">{t("Loading the map connects to Google, which may process your IP address and browser data.", "Încărcarea hărții conectează browserul la Google, care poate prelucra adresa IP și datele browserului.")}</p><Button className="public-cta mt-5 h-12 rounded-none" onClick={() => setOpen(true)}><MapPin />{t("Load Google Maps", "Încarcă Google Maps")}</Button></> : <p className="public-muted mx-auto mt-5 max-w-xs text-sm leading-6">{t("The embedded map is unavailable on this address. View the city on Google Maps.", "Harta integrată nu este disponibilă la această adresă. Vezi orașul pe Google Maps.")}</p>}</div>}
    </div>
    <p className="public-muted mt-3 text-xs leading-5">{t("City location only, not the employer’s confirmed worksite.", "Este indicată locația orașului, nu adresa confirmată a locului de muncă.")}</p>
    <a className="mt-4 inline-flex items-center gap-2 text-sm underline" href={external} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">{t("Open in Google Maps", "Deschide în Google Maps")}<ExternalLink size={14} /></a>
    <p className="public-muted mt-3 text-xs leading-5"><a href="https://maps.google.com/help/terms_maps/" target="_blank" rel="noopener noreferrer" className="underline">{t("Google Maps terms", "Termenii Google Maps")}</a> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">{t("Google privacy", "Confidențialitate Google")}</a></p>
  </aside>;
}