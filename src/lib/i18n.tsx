import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ro";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (en: string, ro: string) => string };

const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (en) => en });
const KEY = "site-lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "ro" || saved === "en") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(KEY, l);
    setLangState(l);
  }, []);
  const t = useCallback((en: string, ro: string) => (lang === "ro" ? ro : en), [lang]);
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

/** Candidate-facing text: t("English", "Română"). Employer sections stay English. */
export const useLang = () => useContext(LangContext);

export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex rounded-full border border-glass-border p-0.5 text-xs font-semibold ${className}`} role="group" aria-label="Language">
      {(["en", "ro"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${lang === l ? "bg-brand text-primary-foreground" : "hover:bg-glass"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
