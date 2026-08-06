'use client';

import { useEffect } from 'react';

/**
 * Magnetic micro-interaction (no custom cursor chrome).
 * Elements marked [data-magnetic] are gently pulled toward the pointer when it
 * is near — a premium touch on the hero/contact CTAs. The native cursor is
 * left untouched (no dot, no trailing ring).
 */
export default function ImmersiveCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const RADIUS = 110;
    // The old version re-queried the DOM and measured every magnetic element on
    // every single mousemove — a full layout read per event. Now the list is
    // cached, the work is throttled to one animation frame, and elements that
    // are off-screen are skipped before measuring.
    // Parent effects run after children have mounted, so every [data-magnetic]
    // element already exists here. They are static CTAs — React updates their
    // text when the language changes but keeps the same nodes, so one read is
    // enough for the life of the page.
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));

    let raf = 0;
    let mx = 0;
    let my = 0;

    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -RADIUS || r.top > vh + RADIUS) {
          if (el.style.transform) el.style.transform = '';
          continue;
        }
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS) {
          const pull = (1 - dist / RADIUS) * 0.4;
          el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        } else if (el.style.transform) {
          el.style.transform = '';
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      for (const el of els) el.style.transform = '';
    };
  }, []);

  return null;
}
