'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Playful doodle preloader — a sketchy progress bar with a snail riding the
 * fill edge, a percentage that trails it, and a bouncy "Loading……" caption.
 * When it reaches 100 the whole curtain slides up to reveal the hero.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let current = 0;
    let timer: number;
    const tick = () => {
      // ease-out increments toward 100 (kept a touch slow so the snail shows)
      const step = Math.max(1, Math.round((100 - current) * 0.045));
      current = Math.min(100, current + step);
      setCount(current);
      if (current < 100) {
        timer = window.setTimeout(tick, 62);
      } else {
        window.setTimeout(() => setLeaving(true), 500);
      }
    };
    timer = window.setTimeout(tick, 220);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[color:var(--background)]"
      initial={{ y: 0 }}
      animate={leaving ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (leaving) onDone();
      }}
    >
      <div className="relative w-[280px] -rotate-[1.5deg] sm:w-[360px]">
        {/* percentage + little arrow that trail the snail */}
        <div
          className="absolute -top-11 flex items-start gap-0.5"
          style={{ left: `${count}%`, transform: 'translateX(-8%)' }}
        >
          <span className="font-display text-lg font-black tabular-nums text-[color:var(--santa-fe)]">
            {count}%
          </span>
          <span className="mt-2 text-sm text-[color:var(--santa-fe)]">↙</span>
        </div>

        {/* snail riding the leading edge of the fill */}
        <div
          className="absolute -top-4 z-10 text-3xl leading-none transition-[left] duration-150 ease-linear"
          style={{ left: `${count}%`, transform: 'translateX(-62%) scaleX(-1)' }}
          aria-hidden="true"
        >
          🐌
        </div>

        {/* sketchy track */}
        <div className="relative h-6 w-full overflow-hidden rounded-full border-[3px] border-[color:var(--foreground)] bg-[color:var(--surface)]">
          <div
            className="h-full rounded-full bg-[color:var(--muted)] transition-[width] duration-150 ease-linear"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>

      <p className="mt-9 font-display text-2xl font-black uppercase tracking-[0.28em] text-[color:var(--foreground)]">
        Loading
        <span className="animate-pulse text-[color:var(--santa-fe)]">……</span>
      </p>
    </motion.div>
  );
}
