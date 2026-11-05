import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/candidate-generations-hero.jpg";
import { useLang } from "@/lib/i18n";

export function Hero() {
  const { t } = useLang();
  return (
    <section className="people-hero" aria-labelledby="home-title">
      <img src={heroImage} alt={t("A younger woman and an older man standing together in a warehouse — illustrative image", "O femeie tânără și un bărbat cu experiență, într-un depozit — imagine ilustrativă")} width={1920} height={1088} fetchPriority="high" className="people-hero-image" />
      <div className="people-hero-content">
        <p className="people-eyebrow">{t("Your experience. Your next step.", "Experiența ta. Următorul tău pas.")}</p>
        <h1 id="home-title">IONMAN<br />Workforce</h1>
        <h2>{t("Work in Germany or the Netherlands.", "Lucrează în Germania sau Olanda.")}</h2>
        <p className="people-hero-description">{t("Looking for a new beginning or bringing years of experience? Tell us about yourself. We connect candidates with European employers, for roles that match their profile.", "Cauți un nou început sau ai deja ani de experiență? Spune-ne despre tine. Conectăm candidații cu angajatori europeni, pentru posturi potrivite profilului lor.")}</p>
        <div className="flex flex-wrap gap-3 mt-7">
          <Button asChild className="people-primary h-12 rounded-md px-6"><a href="#cv">{t("Leave your CV", "Trimite CV-ul")}<ArrowRight size={18} /></a></Button>
          <Button asChild variant="outline" className="people-outline h-12 rounded-md px-5"><Link to="/jobs">{t("Explore jobs", "Vezi locurile de muncă")}</Link></Button>
        </div>
        <p className="people-free"><Check size={17} />{t("Always free for candidates.", "Întotdeauna gratuit pentru candidați.")}</p>
      </div>
      <span className="people-image-caption">{t("Illustrative image", "Imagine ilustrativă")}</span>
      <a href="#candidates" className="people-scroll" aria-label={t("Candidate information", "Informații pentru candidați")}><ArrowDown size={20} /></a>
    </section>
  );
}
