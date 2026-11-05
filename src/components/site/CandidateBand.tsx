import { Link } from "@tanstack/react-router";
import { ArrowRight, Wallet, Plane, FileCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import supportImage from "@/assets/candidate-generations-support.jpg";
import { useLang } from "@/lib/i18n";

export function CandidateBand() {
  const { t } = useLang();
  const support = [
    { icon: Wallet, title: t("No candidate fees", "Fără taxe pentru candidați"), text: t("Interviews and recruitment are free. We never charge recruitment, placement or referral fees.", "Interviurile și recrutarea sunt gratuite. Nu percepem taxe de recrutare, plasare sau recomandare.") },
    { icon: MessageCircle, title: t("Someone to talk to", "Ai cu cine să vorbești"), text: t("We discuss your experience, explain the selection steps and keep you informed before departure.", "Discutăm despre experiența ta, îți explicăm etapele selecției și te ținem la curent înainte de plecare.") },
    { icon: FileCheck, title: t("Know the terms before you travel", "Cunoști condițiile înainte de plecare"), text: t("You are employed directly by the hiring employer. Pay, hours, contract and any accommodation arrangements must be confirmed for your role.", "Ești angajat direct de angajatorul care te selectează. Salariul, programul, contractul și eventualele condiții de cazare trebuie confirmate pentru postul tău.") },
    { icon: Plane, title: t("Agreed travel support", "Sprijin pentru călătoria convenită"), text: t("After acceptance, we arrange and cover the agreed flight and transport from the arrival airport to the employer, according to the confirmed arrangements for your role.", "După acceptare, organizăm și acoperim zborul convenit și transportul de la aeroportul de sosire la angajator, conform aranjamentelor confirmate pentru postul tău.") },
  ];
  const questions = [
    [t("Can I apply without experience?", "Pot aplica dacă nu am experiență?"), t("Requirements vary by vacancy. Send your CV or tell us about your skills; our team reviews your profile against confirmed roles. Submitting a CV does not guarantee a job.", "Cerințele diferă de la un post la altul. Trimite CV-ul sau spune-ne ce abilități ai; echipa analizează profilul tău pentru posturile confirmate. Trimiterea CV-ului nu garantează angajarea.")],
    [t("Who will employ me?", "Cine mă angajează?"), t("The hiring employer, not ION MAN WORKFORCE SRL. We coordinate with the employer so the contract can be prepared and signed before departure, where legally and operationally possible.", "Angajatorul care te selectează, nu ION MAN WORKFORCE SRL. Ne coordonăm cu acesta pentru pregătirea și semnarea contractului înainte de plecare, acolo unde este posibil din punct de vedere legal și operațional.")],
    [t("Are accommodation and benefits included?", "Cazarea și beneficiile sunt incluse?"), t("Only when confirmed for the specific vacancy. Check pay, working hours, accommodation costs and transport arrangements with our team before accepting or travelling.", "Doar dacă sunt confirmate pentru postul respectiv. Verifică salariul, programul, costurile cazării și condițiile de transport împreună cu echipa noastră înainte de acceptare sau plecare.")],
  ];
  return (
    <section id="candidates" className="people-candidates scroll-mt-6" aria-labelledby="candidate-band-title">
      <div className="people-support-intro">
        <div>
          <p className="people-eyebrow">{t("For candidates", "Pentru candidați")}</p>
          <h2 id="candidate-band-title">{t("A new beginning.\nWith people by your side.", "Un nou început.\nCu oameni alături.")}</h2>
        </div>
        <p>{t("From your first conversation to preparing for departure, you deserve clear answers. Whether you are starting out or building on your experience, the requirements of each role guide the selection.", "De la prima discuție până la pregătirea plecării, meriți răspunsuri clare. Fie că ești la început sau ai experiență, selecția se face în funcție de cerințele fiecărui post.")}</p>
      </div>
      <div className="people-support-layout">
        <figure className="people-support-photo"><img src={supportImage} alt={t("An older man and a younger woman reviewing a folder together", "Un bărbat cu experiență și o femeie tânără discută pe baza unui dosar")} width={1024} height={1280} loading="lazy" /><figcaption>{t("Illustrative image · not agency staff", "Imagine ilustrativă · nu reprezintă echipa agenției")}</figcaption></figure>
        <div className="people-support-list">{support.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={25} strokeWidth={1.5} /><div><h3>{title}</h3><p>{text}</p></div></article>)}
          <Button asChild variant="link" className="justify-start px-0 h-auto"><Link to="/eu-candidate-information">{t("Practical information before departure", "Informații practice înainte de plecare")}<ArrowRight size={18} /></Link></Button>
        </div>
      </div>
      <div className="people-faq"><h2>{t("Your questions, answered.", "Răspunsuri la întrebările tale.")}</h2><div>{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div>
    </section>
  );
}
