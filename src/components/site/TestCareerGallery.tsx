import { useState } from "react";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useLang } from "@/lib/i18n";
import conversation from "@/assets/test-career-conversation.jpg";
import warehouse from "@/assets/test-workforce-hero.jpg";
import production from "@/assets/test-workforce-production.jpg";

export function TestCareerGallery() {
  const { t } = useLang();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const categories = [
    { id: "all", label: t("All insights", "Toate ghidurile") },
    { id: "preparation", label: t("Getting ready", "Pregătire") },
    { id: "abroad", label: t("Working abroad", "Munca în străinătate") },
    { id: "skills", label: t("Skills & growth", "Abilități și dezvoltare") },
  ];
  const articles = [
    { id: 0, category: "preparation", image: conversation, title: t("What makes a candidate stand out?", "Ce te face să te remarci ca un candidat?"), intro: t("The small details that make a meaningful first impression.", "Detaliile mici care fac o primă impresie bună."), body: t("Be clear about your experience, availability and the kind of work you are looking for. Give practical examples of tasks you have done, equipment you have used and responsibilities you have held. Reliability, honest answers and a willingness to learn help a recruiter understand where you could fit.", "Prezintă clar experiența, disponibilitatea și tipul de muncă pe care îl cauți. Oferă exemple concrete de sarcini, echipamente folosite și responsabilități. Seriozitatea, răspunsurile sincere și dorința de a învăța ajută recrutorul să găsească un rol potrivit.") },
    { id: 1, category: "abroad", image: warehouse, title: t("Your next chapter in the Netherlands", "Următorul tău capitol în Olanda"), intro: t("The questions to ask before accepting a role abroad.", "Întrebările de pus înainte de a accepta un post în străinătate."), body: t("Ask for the job location, employer, contract type, working hours and salary in writing. Check whether pay is gross or net and understand any deductions. If housing or transport is offered, confirm the cost and conditions in the job brief before you travel. Keep a copy of your contract and the contact details of your recruiter.", "Cere în scris locația, angajatorul, tipul contractului, programul și salariul. Verifică dacă salariul este brut sau net și ce deduceri se aplică. Dacă se oferă cazare sau transport, confirmă costurile și condițiile înainte de plecare. Păstrează contractul și datele de contact ale recrutorului.") },
    { id: 2, category: "skills", image: production, title: t("Which skills matter on the production floor?", "Ce abilități contează în producție?"), intro: t("Accuracy, teamwork and a safety-first mindset.", "Precizie, lucru în echipă și atenție la siguranță."), body: t("Following instructions, maintaining consistent quality and communicating with your team are useful across production roles. Describe relevant experience with packing, quality checks or machinery in your CV. Never claim a qualification you do not hold, and ask what training and protective equipment the employer provides.", "Respectarea instrucțiunilor, menținerea calității și comunicarea cu echipa sunt importante în producție. Menționează în CV experiența în ambalare, controlul calității sau utilizarea utilajelor. Nu declara calificări pe care nu le ai și întreabă ce instruire și echipament de protecție oferă angajatorul.") },
    { id: 3, category: "preparation", image: conversation, title: t("A CV that tells your story clearly", "Un CV care îți prezintă clar experiența"), intro: t("Put your practical experience front and centre.", "Pune experiența practică în prim-plan."), body: t("Include a current phone number and email, your recent jobs, the dates you worked and the tasks you performed. List languages and your actual level, licences and certificates. Mention your preferred country and availability. You do not need to pay a recruitment fee to apply through ION MAN WORKFORCE.", "Include un număr de telefon și un e-mail actual, locurile de muncă recente, perioadele și sarcinile îndeplinite. Menționează limbile și nivelul real, permisele și certificatele. Adaugă țara preferată și disponibilitatea. Nu trebuie să plătești o taxă de recrutare pentru a aplica prin ION MAN WORKFORCE.") },
    { id: 4, category: "abroad", image: production, title: t("Before your first working day in Germany", "Înainte de prima zi de muncă în Germania"), intro: t("A little preparation goes a long way.", "Pregătirea din timp face diferența."), body: t("Confirm your start date, meeting point, shift and a contact person. Ask which documents and work clothing you should bring. Make sure you understand the safety induction and ask for clarification when an instruction is unclear. Housing is only included when explicitly confirmed in your job brief.", "Confirmă data începerii, punctul de întâlnire, tura și persoana de contact. Întreabă ce documente și îmbrăcăminte trebuie să aduci. Asigură-te că înțelegi instruirea de siguranță și cere explicații când o instrucțiune nu este clară. Cazarea este inclusă doar dacă este confirmată explicit în oferta de muncă.") },
    { id: 5, category: "skills", image: warehouse, title: t("Build confidence in a new team", "Prinde încredere într-o echipă nouă"), intro: t("Good communication starts with simple habits.", "Comunicarea bună începe cu obiceiuri simple."), body: t("Arrive on time, listen carefully and check that you have understood your tasks. Let your supervisor know early if you need support or cannot attend a shift. Learn the everyday terms used in your workplace and share useful information with colleagues. You can build confidence without pretending to know everything on day one.", "Ajungi la timp, ascultă cu atenție și verifică dacă ai înțeles sarcinile. Anunță din timp superiorul dacă ai nevoie de sprijin sau nu poți ajunge la tură. Învață termenii folosiți la muncă și comunică informațiile utile colegilor. Poți prinde încredere fără să pretinzi că știi totul din prima zi.") },
  ];
  const visible = articles.filter(article => (category === "all" || article.category === category) && `${article.title} ${article.intro}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const current = articles.find(article => article.id === selected);
  return <section id="career-insights" className="test-gallery px-6 py-16 md:px-12 lg:px-16">
    <div className="mx-auto max-w-7xl">
      <div className="test-gallery-heading flex flex-wrap items-end justify-between gap-6">
        <div><p className="mb-4 text-xs uppercase">{t("Inside your next chapter", "Descoperă următorul capitol")}</p><h2 className="text-3xl font-normal uppercase md:text-4xl">{t("Recruitment & career advice", "Recrutare și sfaturi de carieră")}</h2></div>
        <a href="/#cv" className="flex items-center gap-3 text-xs uppercase">{t("Leave your CV", "Depune CV-ul")}<ArrowRight size={18} /></a>
      </div>
      <div className="test-gallery-toolbar my-9 flex flex-col justify-between gap-5 border-y py-5 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2" aria-label={t("Article categories", "Categorii de articole")}>
          {categories.map(item => <Button key={item.id} variant="ghost" className="test-filter rounded-none px-4 text-xs" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</Button>)}
        </div>
        <label className="test-search flex items-center gap-3 border-b py-2"><Search size={17} /><input aria-label={t("Search career advice", "Caută sfaturi de carieră")} placeholder={t("Search insights", "Caută ghiduri")} className="w-full min-w-0 bg-transparent text-sm outline-none" value={search} onChange={event => setSearch(event.target.value)} /></label>
      </div>
      <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
        {visible.map(article => <article key={article.id} className="test-advice group">
          <Button variant="ghost" className="test-advice-image relative block h-auto w-full overflow-hidden rounded-none p-0" aria-label={article.title} onClick={() => setSelected(article.id)}>
            <img src={article.image} alt={article.title} width={1536} height={1024} loading="lazy" className="test-story-image aspect-video w-full object-cover" />
            <span className="test-read-icon absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full"><ArrowRight size={19} /></span>
          </Button>
          <p className="mt-5 flex items-center gap-2 text-[11px] uppercase"><BookOpen size={13} />{t("Guide", "Ghid")}<span aria-hidden="true">·</span>{categories.find(item => item.id === article.category)?.label}</p>
          <Button variant="link" className="test-advice-title mt-3 h-auto w-full justify-start whitespace-normal p-0 text-left text-xl font-normal leading-8" onClick={() => setSelected(article.id)}>{article.title}</Button>
          <p className="test-advice-description mt-3 text-sm leading-6">{article.intro}</p>
        </article>)}
      </div>
      {visible.length === 0 && <p className="py-14 text-center text-sm">{t("No insights match your search.", "Niciun ghid nu corespunde căutării.")}</p>}
    </div>
    <Dialog open={Boolean(current)} onOpenChange={open => { if (!open) setSelected(null); }}>
      <DialogContent className="test-article-dialog max-h-[90svh] max-w-2xl overflow-y-auto rounded-none p-0">
        {current && <><img src={current.image} alt="" width={1536} height={1024} className="aspect-video w-full object-cover" /><div className="p-7 md:p-10"><p className="mb-4 text-xs uppercase">ION MAN WORKFORCE · {t("Career guide", "Ghid de carieră")}</p><DialogTitle className="text-2xl font-normal leading-snug">{current.title}</DialogTitle><DialogDescription className="mt-5 text-base leading-8">{current.body}</DialogDescription><Button asChild variant="outline" className="test-outline mt-7 rounded-none"><a href="/#cv">{t("Leave your CV", "Depune CV-ul")}<ArrowRight /></a></Button></div></>}
      </DialogContent>
    </Dialog>
  </section>;
}