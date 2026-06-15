'use client';

import { useRef } from 'react';

/**
 * Subtle pointer-driven 3D tilt wrapper. Sets --rx/--ry CSS vars as the mouse
 * moves (consumed by the `.tilt-frame` rule) and eases back to flat on leave.
 *
 * Uses pointer events and only reacts to a real `mouse` pointer — touch and pen
 * are ignored, so tapping/scrolling on a phone never sticks a tilt. Also no-ops
 * under reduced motion.
 */
export default function TiltFrame({
  children,
  className = '',
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${-py * max}deg`);
    el.style.setProperty('--ry', `${px * max}deg`);
  };

  const reset = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className={`tilt-frame ${className}`}>
      {children}
    </div>
  );
}
