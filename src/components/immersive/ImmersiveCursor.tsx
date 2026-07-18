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

    const onMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      const RADIUS = 110;
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS) {
          const pull = (1 - dist / RADIUS) * 0.4;
          el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        } else if (el.style.transform) {
          el.style.transform = '';
        }
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        el.style.transform = '';
      });
    };
  }, []);

  return null;
}
