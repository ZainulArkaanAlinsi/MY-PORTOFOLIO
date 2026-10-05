'use client';

import { useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { Languages } from 'lucide-react';
import { languages } from '@/data/portfolio';
import { useT } from '@/i18n/provider';

const R = 34;
const CIRC = 2 * Math.PI * R;

// fan transform for a card at stack position `pos` (0 = front)
function fan(pos: number) {
  return {
    x: pos * 32,
    y: pos * 8,
    rotate: pos * 7,
    scale: 1 - pos * 0.05,
    opacity: pos > 2 ? 0 : 1 - pos * 0.12,
  };
}

/**
 * A fanned deck of language cards — like a hand of cards. Drag the front card
 * aside (or tap the deck) to send it to the back and reveal the next one.
 */
export default function LanguageDeck() {
  const t = useT();
  const [order, setOrder] = useState(languages.map((_, i) => i)); // front → back
  const cycle = () => setOrder((o) => [...o.slice(1), o[0]]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) cycle();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Narrower on phones: the cards fan 64px to the right, so at 240px wide
          the back card ran past the screen edge and got clipped. */}
      <div
        className="relative h-[290px] w-[205px] cursor-pointer select-none sm:h-[300px] sm:w-[240px]"
        style={{ perspective: '1200px' }}
        onClick={cycle}
        role="button"
        tabIndex={0}
        aria-label={`Languages — showing ${languages[order[0]].name}. Activate to see the next.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            cycle();
          }
        }}
      >
        {languages.map((l, li) => {
          const pos = order.indexOf(li);
          const front = pos === 0;
          const level = l.level;
          return (
            <motion.div
              key={l.name}
              className="absolute inset-0"
              style={{ zIndex: 100 - pos }}
              animate={fan(pos)}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              drag={front ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.5}
              onDragEnd={front ? onDragEnd : undefined}
              whileDrag={{ cursor: 'grabbing' }}
            >
              <div className="glow-card flex h-full w-full flex-col rounded-[1.6rem] border border-[var(--line)] bg-[linear-gradient(160deg,var(--surface),var(--surface-2))] p-6 shadow-[0_22px_46px_-24px_rgba(40,40,36,0.55)]">
                {/* top row */}
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#44896e,#56a587_55%,#9ad6bf)] text-white shadow-[0_8px_18px_-10px_var(--santa-fe)]">
                    <Languages className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    LANG_{String(li + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* progress ring */}
                <div className="relative mx-auto my-4 h-[104px] w-[104px]">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(40,40,36,0.1)" strokeWidth="7" />
                    <circle
                      cx="50"
                      cy="50"
                      r={R}
                      fill="none"
                      stroke="url(#lang-grad)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={CIRC}
                      strokeDashoffset={CIRC * (1 - level / 100)}
                    />
                    <defs>
                      <linearGradient id="lang-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#56a587" />
                        <stop offset="100%" stopColor="#9ad6bf" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="font-display absolute inset-0 flex items-center justify-center text-2xl font-black tabular-nums text-[color:var(--rebel)]">
                    {level}%
                  </span>
                </div>

                {/* label */}
                <div className="mt-auto text-center">
                  <p className="font-display text-lg font-bold leading-tight text-[color:var(--foreground)]">
                    {t.languageNames[li] ?? l.name}
                  </p>
                  <p className="font-body text-xs text-[color:var(--muted)]">
                    {t.proficiency[li] ?? l.proficiency}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* dots + hint */}
      <div className="mt-6 flex items-center gap-2">
        {languages.map((l, li) => (
          <span
            key={l.name}
            className={`h-1.5 rounded-full transition-all ${
              order[0] === li ? 'w-5 bg-[color:var(--santa-fe)]' : 'w-1.5 bg-[rgba(86,165,135,0.3)]'
            }`}
          />
        ))}
      </div>
      <p className="font-body mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {t.skills.dragCard} <span aria-hidden>»</span>
      </p>
    </div>
  );
}
