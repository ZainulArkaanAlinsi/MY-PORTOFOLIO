'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DICT, type AppDict, type Lang } from './dict';

type Theme = 'light' | 'dark';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: AppDict;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  const [theme, setThemeState] = useState<Theme>('light');

  // hydrate from storage / system (deferred so we never setState in the effect body)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const sl = localStorage.getItem('lang') as Lang | null;
        const st = localStorage.getItem('theme') as Theme | null;
        if (sl === 'id' || sl === 'en' || sl === 'ar') setLangState(sl);
        if (st === 'dark' || st === 'light') setThemeState(st);
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setThemeState('dark');
      } catch {
        /* ignore */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // reflect theme on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // reflect language + direction on <html>
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((tm: Theme) => {
    setThemeState(tm);
    try {
      localStorage.setItem('theme', tm);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <AppCtx.Provider value={{ lang, setLang, t: DICT[lang], theme, setTheme, toggleTheme }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp must be used within AppProviders');
  return c;
}

export function useT(): AppDict {
  return useApp().t;
}
