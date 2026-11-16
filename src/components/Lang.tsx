'use client';
// Test-only RU/EN switch. The provider remounts the tree on change so animations restart cleanly.
// shortcut: only the chrome, home page and mood chip are translated; package/blog data stays Russian. Add a data pass before shipping EN.
import { createContext, Fragment, useContext, useEffect, useState } from 'react';

type L = 'ru' | 'en';
const Ctx = createContext<{ lang: L; set: (l: L) => void }>({ lang: 'ru', set: () => {} });
export const useLang = () => useContext(Ctx);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<L>('ru');
  useEffect(() => { try { if (localStorage.getItem('lang') === 'en') setLang('en'); } catch {} }, []);
  const set = (l: L) => { setLang(l); try { localStorage.setItem('lang', l); } catch {} document.documentElement.lang = l; };
  return <Ctx.Provider value={{ lang, set }}><Fragment key={lang}>{children}</Fragment></Ctx.Provider>;
}

export function T({ ru, en }: { ru: string; en: string }) {
  return <>{useLang().lang === 'en' ? en : ru}</>;
}

export function LangToggle() {
  const { lang, set } = useLang();
  return (
    <div className="lang" role="group" aria-label="Language">
      {(['ru', 'en'] as const).map((l) => <button key={l} type="button" className={lang === l ? 'on' : ''} aria-pressed={lang === l} onClick={() => set(l)}>{l.toUpperCase()}</button>)}
    </div>
  );
}
