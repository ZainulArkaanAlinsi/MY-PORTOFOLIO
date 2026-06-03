'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Airy magnetic cursor.
 * - A small blue dot tracks the pointer 1:1.
 * - A larger ring trails with easing and grows over interactive elements.
 * - Elements marked [data-magnetic] are gently pulled toward the pointer
 *   when the cursor is near (premium micro-interaction, hero only).
 */
export default function ImmersiveCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    // defer to next frame so we don't setState synchronously in the effect body
    const enableRaf = requestAnimationFrame(() => setEnabled(true));
    document.body.classList.add('cursor-none');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }

      // magnetic pull on nearby [data-magnetic] elements
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

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const interactive = t?.closest?.('a, button, [data-cursor="hover"], [data-magnetic]');
      if (ringRef.current) {
        ringRef.current.style.width = interactive ? '60px' : '34px';
        ringRef.current.style.height = interactive ? '60px' : '34px';
        ringRef.current.style.borderColor = interactive
          ? 'rgba(209, 35, 35, 0.9)'
          : 'rgba(173, 115, 78, 0.6)';
        ringRef.current.style.background = interactive
          ? 'rgba(173, 115, 78, 0.08)'
          : 'transparent';
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(enableRaf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.body.classList.remove('cursor-none');
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
        el.style.transform = '';
      });
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-95 h-2 w-2 rounded-full bg-blue-500"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-94 h-9 w-9 rounded-full border"
        style={{
          borderColor: 'rgba(173, 115, 78, 0.6)',
          transition: 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background 0.2s ease',
        }}
      />
    </>
  );
}
