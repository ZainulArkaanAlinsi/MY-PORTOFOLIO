'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let current = 0;
    const tick = () => {
      // ease-out increments toward 100
      const step = Math.max(1, Math.round((100 - current) * 0.06));
      current = Math.min(100, current + step);
      setCount(current);
      if (current < 100) {
        timer = window.setTimeout(tick, 60);
      } else {
        window.setTimeout(() => setLeaving(true), 350);
      }
    };
    let timer = window.setTimeout(tick, 200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f7efe6]"
      initial={{ y: 0 }}
      animate={leaving ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (leaving) onDone();
      }}
    >
      <div className="font-display text-7xl font-black tabular-nums text-gradient sm:text-8xl">
        {count}
      </div>
      <div className="mt-8 h-px w-56 overflow-hidden bg-slate-900/10 sm:w-72">
        <div
          className="h-full bg-linear-to-r from-blue-500 to-cyan-400 transition-[width] duration-100 ease-out"
          style={{ width: `${count}%` }}
        />
      </div>
      <p className="font-body mt-5 text-[11px] uppercase tracking-[0.4em] text-slate-400">
        Loading experience
      </p>
    </motion.div>
  );
}
