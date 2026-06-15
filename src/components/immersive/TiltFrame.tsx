'use client';

import { useRef } from 'react';

/**
 * Subtle pointer-driven 3D tilt wrapper. Sets --rx/--ry CSS vars on mouse
 * move (consumed by the `.tilt-frame` rule) and eases back to flat on leave.
 * No-ops under reduced motion; touch devices simply never fire mousemove.
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

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${-py * max}deg`);
    el.style.setProperty('--ry', `${px * max}deg`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={`tilt-frame ${className}`}>
      {children}
    </div>
  );
}
