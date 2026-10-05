'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion';

/**
 * A draggable ID card hanging from a lanyard. The whole strap + clasp + card
 * assembly is a pendulum that pivots from a fixed pin at the top: drag the card
 * and it follows the pointer by angle, release and it springs back with a few
 * natural swings. Only transforms animate (rotate/scale), so it stays cheap on
 * phones — no physics engine, no WebGL.
 */
export default function LanyardCard({
  photo,
  name,
  lastName,
  role,
  brand,
  dragHint,
}: {
  photo: string;
  name: string;
  lastName: string;
  role: string;
  brand: string;
  dragHint: string;
}) {
  const pivotRef = useRef<HTMLSpanElement>(null);
  const rot = useMotionValue(0);
  const scale = useMotionValue(1);
  const dragging = useRef(false);
  const swayRef = useRef<ReturnType<typeof animate> | null>(null);
  const settleRef = useRef<ReturnType<typeof animate> | null>(null);
  const vel = useRef({ deg: 0, t: 0, v: 0 });
  const reduce = useReducedMotion();

  // Gentle idle sway so the card feels physically "hung", not pinned rigid.
  const startSway = useCallback(() => {
    if (reduce) return;
    swayRef.current?.stop();
    swayRef.current = animate(rot, [0, 2.4, -2, 1.4, 0], {
      duration: 7,
      ease: 'easeInOut',
      repeat: Infinity,
    });
  }, [reduce, rot]);

  useEffect(() => {
    startSway();
    return () => {
      swayRef.current?.stop();
      settleRef.current?.stop();
    };
  }, [startSway]);

  const onMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current || !pivotRef.current) return;
      const r = pivotRef.current.getBoundingClientRect();
      const px = r.left + r.width / 2;
      const py = r.top + r.height / 2;
      const dx = e.clientX - px;
      const dy = Math.max(e.clientY - py, 1);
      let deg = (Math.atan2(dx, dy) * 180) / Math.PI;
      deg = Math.max(-58, Math.min(58, deg));
      rot.set(deg);
      // track angular velocity (deg/s) for a natural release throw
      const now = performance.now();
      const dt = now - vel.current.t;
      if (dt > 0) vel.current.v = ((deg - vel.current.deg) / dt) * 1000;
      vel.current.deg = deg;
      vel.current.t = now;
    },
    [rot]
  );

  const onUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    window.removeEventListener('pointermove', onMove);
    animate(scale, 1, { type: 'spring', stiffness: 300, damping: 20 });
    if (reduce) {
      rot.set(0);
      return;
    }
    // swing back to rest with a springy overshoot, carrying release velocity
    settleRef.current = animate(rot, 0, {
      type: 'spring',
      stiffness: 120,
      damping: 6.5,
      velocity: vel.current.v,
      restDelta: 0.1,
      onComplete: startSway,
    });
  }, [onMove, reduce, rot, scale, startSway]);

  const onDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      swayRef.current?.stop();
      settleRef.current?.stop();
      dragging.current = true;
      vel.current = { deg: rot.get(), t: performance.now(), v: 0 };
      animate(scale, 1.05, { type: 'spring', stiffness: 300, damping: 20 });
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp, { once: true });
    },
    [onMove, onUp, rot, scale]
  );

  return (
    <div className="relative flex select-none flex-col items-center pt-2">
      {/* fixed pivot marker (pendulum origin) + the pin the strap loops over */}
      <span ref={pivotRef} aria-hidden className="pointer-events-none absolute left-1/2 top-2 h-0 w-0" />
      <span
        aria-hidden
        className="absolute left-1/2 top-0 z-20 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-[rgba(40,40,36,0.35)] bg-[linear-gradient(180deg,#dadad6,#9f9f98)] shadow-[0_2px_4px_rgba(40,40,36,0.35)]"
      />

      {/* swinging assembly — pivots from the pin (transform-origin top-center) */}
      <motion.div
        style={{ rotate: rot, scale, transformOrigin: '50% 0%' }}
        className="relative flex flex-col items-center"
      >
        {/* ===== LANYARD STRAP ===== */}
        <div
          className="relative -mb-1 h-[116px] w-[42px] overflow-hidden rounded-b-[3px] rounded-t-[10px]"
          style={{
            backgroundImage:
              'linear-gradient(100deg,#44896e,#56a587 45%,#356955 100%)',
            boxShadow:
              'inset 2px 0 3px rgba(255,255,255,0.18), inset -2px 0 4px rgba(0,0,0,0.28), 0 2px 6px rgba(40,40,36,0.3)',
          }}
        >
          {/* woven texture */}
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.09) 0 2px, transparent 2px 5px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.10) 0 2px, transparent 2px 5px)',
            }}
          />
          {/* repeated brand text running down the strap */}
          <span
            aria-hidden
            className="font-display absolute inset-0 flex items-center justify-center whitespace-nowrap text-[13px] font-black uppercase tracking-[0.35em] text-[color:var(--merino)]/70"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {brand} · {brand} ·
          </span>
        </div>

        {/* ===== METAL CLASP (swivel hook) ===== */}
        <svg width="40" height="52" viewBox="0 0 40 52" className="relative z-10 -mb-3 drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)]" aria-hidden>
          <defs>
            <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4b4b4f" />
              <stop offset="35%" stopColor="#9a9aa0" />
              <stop offset="55%" stopColor="#2e2e31" />
              <stop offset="100%" stopColor="#5c5c60" />
            </linearGradient>
          </defs>
          {/* barrel that grips the strap */}
          <rect x="13" y="0" width="14" height="12" rx="3" fill="url(#metal)" />
          {/* swivel neck */}
          <rect x="17" y="10" width="6" height="6" fill="url(#metal)" />
          {/* ring */}
          <circle cx="20" cy="22" r="7.5" fill="none" stroke="url(#metal)" strokeWidth="3.4" />
          {/* hook — an open C that catches the card slot */}
          <path
            d="M20 28 C 12 30 11 42 18 46 C 23 49 30 46 30 40"
            fill="none"
            stroke="url(#metal)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* ===== ID CARD ===== */}
        <div
          onPointerDown={onDown}
          className="group relative w-[228px] cursor-grab touch-none overflow-hidden rounded-[1.35rem] active:cursor-grabbing"
          style={{
            boxShadow:
              '0 30px 50px -18px rgba(40,40,36,0.55), 0 6px 14px -6px rgba(40,40,36,0.4)',
          }}
        >
          {/* punch-hole slot the clasp hooks through */}
          <span
            aria-hidden
            className="absolute left-1/2 top-2.5 z-20 h-2 w-11 -translate-x-1/2 rounded-full bg-[rgba(12,12,12,0.55)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
          />

          {/* photo — sits on a warm card body */}
          <div className="relative aspect-[3/3.4] w-full bg-[linear-gradient(160deg,#f1f1f0,#dfdfdd)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={name}
              draggable={false}
              className="h-full w-full select-none object-cover object-[center_28%]"
            />
            {/* diagonal gloss streak */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-y-6 -left-1/3 w-2/3 rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]"
            />
            {/* copper header tag */}
            <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--rebel)]/85 px-2.5 py-1 font-body text-[8.5px] font-bold uppercase tracking-[0.22em] text-[color:var(--merino)] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--santa-fe)]" />
              {brand}
            </span>
          </div>

          {/* dark info panel */}
          <div className="relative bg-[linear-gradient(180deg,#2b2b27,#171716)] px-4 pb-4 pt-3.5 text-[color:var(--merino)]">
            <p className="font-display text-lg font-black leading-tight tracking-tight">
              {name} <span className="text-[color:var(--santa-fe)]">{lastName}</span>
            </p>
            <p className="font-body mt-0.5 text-[11px] font-medium text-[rgba(236,236,235,0.72)]">
              {role}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-[rgba(236,236,235,0.16)] pt-2.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[rgba(236,236,235,0.6)]">
                ID · 2026
              </span>
              <span className="inline-flex items-center gap-1 font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-[color:var(--santa-fe)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--santa-fe)] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--santa-fe)]" />
                </span>
                Active
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* drag hint */}
      <p className="font-body mt-5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        <span aria-hidden>✦</span> {dragHint}
      </p>
    </div>
  );
}
