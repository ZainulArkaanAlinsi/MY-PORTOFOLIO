'use client';

import { useEffect, useRef } from 'react';

/**
 * Playful doodle preloader — a sketchy progress bar with a snail riding the
 * fill edge, a percentage that trails it, and a bouncy "Loading……" caption.
 * When it reaches 100 the whole curtain slides up to reveal the hero.
 *
 * Two rules keep it from ever holding the page hostage:
 *
 * 1. Progress is derived from the *wall clock*, not from an incrementing
 *    counter. The old version advanced by one step per `setTimeout(…, 62)`, so
 *    while the main thread was busy booting Three.js / GSAP / fonts the timers
 *    were starved and the bar crawled — it was still at ~70% after 15 seconds.
 *    Reading `performance.now()` means a dropped frame costs nothing.
 * 2. `MAX_MS` is a hard ceiling and a plain `setTimeout` backstop force-finishes
 *    even if rAF never fires again. Real load signals (fonts + window load)
 *    shorten it; nothing can lengthen it.
 *
 * The counter writes straight to the DOM through refs, so the curtain never
 * re-renders while it counts — one less thing competing for the main thread.
 */

const MIN_MS = 600; // floor, so the curtain doesn't just flash
const MAX_MS = 1600; // ceiling, never longer than this

export default function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const snailRef = useRef<HTMLDivElement>(null);
  const pctWrapRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(false);
  // latest-callback ref: the boot effect runs once, but `onDone` is a fresh
  // closure on every parent render
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    // Hold the page still behind the curtain (html, not body — html is the
    // scroll container here, so body overflow alone would not stop it).
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    const start = performance.now();
    let assetsReady = false;
    const markReady = () => {
      assetsReady = true;
    };

    if (document.readyState === 'complete') markReady();
    else window.addEventListener('load', markReady, { once: true });
    document.fonts?.ready.then(markReady).catch(markReady);

    let raf = 0;
    let leaveTimer = 0;
    let doneTimer = 0;

    const paint = (p: number) => {
      const pct = Math.round(p * 100);
      if (barRef.current) barRef.current.style.width = `${pct}%`;
      if (snailRef.current) snailRef.current.style.left = `${pct}%`;
      if (pctWrapRef.current) pctWrapRef.current.style.left = `${pct}%`;
      if (pctRef.current) pctRef.current.textContent = `${pct}%`;
    };

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      paint(1);
      cancelAnimationFrame(raf);
      // slide the curtain up, then hand the page over
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        // no curtain slide — just hand the page over
        doneTimer = window.setTimeout(() => onDoneRef.current(), 120);
        return;
      }
      leaveTimer = window.setTimeout(() => {
        const el = rootRef.current;
        if (el) {
          el.style.transition = 'transform 0.75s cubic-bezier(0.76,0,0.24,1)';
          el.style.transform = 'translateY(-100%)';
        }
        // `transitionend` can be missed if the tab is hidden — always release
        // the page on a timer instead of trusting the event.
        doneTimer = window.setTimeout(() => onDoneRef.current(), 800);
      }, 160);
    };

    const loop = () => {
      const elapsed = performance.now() - start;
      // once the real load signals land, the bar races to full over MIN_MS
      const span = assetsReady ? MIN_MS : MAX_MS;
      const p = Math.min(1, elapsed / span);
      paint(p);
      if (p >= 1) finish();
      else raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // backstop: if rAF is starved entirely, still let the visitor in
    const hardStop = window.setTimeout(finish, MAX_MS + 500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hardStop);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
      window.removeEventListener('load', markReady);
      html.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[color:var(--background)]"
    >
      <div className="relative w-[280px] -rotate-[1.5deg] sm:w-[360px]">
        {/* percentage + little arrow that trail the snail */}
        <div ref={pctWrapRef} className="absolute -top-11 flex items-start gap-0.5" style={{ left: 0, transform: 'translateX(-8%)' }}>
          <span ref={pctRef} className="font-display text-lg font-black tabular-nums text-[color:var(--santa-fe)]">
            0%
          </span>
          <span className="mt-2 text-sm text-[color:var(--santa-fe)]">↙</span>
        </div>

        {/* snail riding the leading edge of the fill */}
        <div
          ref={snailRef}
          className="absolute -top-4 z-10 text-3xl leading-none"
          style={{ left: 0, transform: 'translateX(-62%) scaleX(-1)' }}
          aria-hidden="true"
        >
          🐌
        </div>

        {/* sketchy track */}
        <div className="relative h-6 w-full overflow-hidden rounded-full border-[3px] border-[color:var(--foreground)] bg-[color:var(--surface)]">
          <div ref={barRef} className="h-full w-0 rounded-full bg-[color:var(--muted)]" />
        </div>
      </div>

      <p className="mt-9 font-display text-2xl font-black uppercase tracking-[0.28em] text-[color:var(--foreground)]">
        Loading
        <span className="animate-pulse text-[color:var(--santa-fe)]">……</span>
      </p>
    </div>
  );
}
