import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

export function Process() {
  const { t } = useLang();
  const steps = [
    [t("Send your CV", "Trimite CV-ul"), t("Tell us about your experience and the kind of work you are looking for.", "Spune-ne ce experiență ai și ce fel de loc de muncă îți dorești.")],
    [t("Let's talk", "Discutăm împreună"), t("Our team reviews your profile and discusses suitable confirmed vacancies. The interview is free.", "Echipa analizează profilul tău și discută cu tine despre posturile confirmate potrivite. Interviul este gratuit.")],
    [t("Employer selection", "Selecția angajatorului"), t("The employer makes the hiring decision. You review the role and confirmed terms before accepting.", "Angajatorul decide selecția. Analizezi postul și condițiile confirmate înainte de a accepta.")],
    [t("Prepare for departure", "Pregătim plecarea"), t("After acceptance, we coordinate the agreed travel arrangements and details of starting work.", "După acceptare, coordonăm călătoria convenită și detaliile începerii activității.")],
  ];
  return <section id="process" className="people-process scroll-mt-6"><div className="people-process-heading"><div><p className="people-eyebrow">{t("How it works", "Cum funcționează")}</p><h2>{t("Four steps. Clear from the start.", "Patru pași. Claritate de la început.")}</h2></div><Button asChild className="people-primary h-12 rounded-md px-6"><a href="#cv">{t("Leave your CV", "Trimite CV-ul")}<ArrowRight size={18} /></a></Button></div><ol>{steps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>;
}
