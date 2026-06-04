'use client';

import { Sun, Moon } from 'lucide-react';
import { LANGS } from '@/i18n/dict';
import { useApp } from '@/i18n/provider';

export default function LangThemeControls() {
  const { lang, setLang, theme, toggleTheme } = useApp();

  return (
    <div className="flex items-center gap-2">
      {/* language switch */}
      <div className="flex items-center rounded-full border border-[rgba(69,29,7,0.12)] bg-[var(--surface)]/60 p-0.5">
        {LANGS.map((l) => {
          const on = l.code === lang;
          return (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              data-cursor="hover"
              aria-label={l.name}
              aria-pressed={on}
              className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                on
                  ? 'bg-[color:var(--santa-fe)] text-white'
                  : 'text-slate-500 hover:text-[color:var(--santa-fe)]'
              }`}
            >
              {l.label}
            </button>
          );
        })}
      </div>

      {/* theme toggle */}
      <button
        onClick={toggleTheme}
        data-cursor="hover"
        aria-label="Toggle dark mode"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(69,29,7,0.12)] bg-[var(--surface)]/60 text-slate-600 transition-colors hover:text-[color:var(--santa-fe)]"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}
