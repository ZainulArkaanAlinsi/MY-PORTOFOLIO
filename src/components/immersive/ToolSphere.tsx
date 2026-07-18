'use client';

import { useEffect, useMemo, useRef } from 'react';
import { tools } from '@/data/portfolio';
import TechIcon from './TechIcon';

/**
 * An interactive 3D "tag cloud" sphere of the tools I use. It idles with a
 * slow auto-spin, you can grab and fling it to rotate, and each tile billboards
 * to face you while depth drives its scale / glow / opacity. Pure CSS 3D
 * transforms driven by one rAF loop (no WebGL) and it pauses when off-screen,
 * so it stays light on phones.
 */
export default function ToolSphere() {
  const rootRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  // evenly distributed points on a unit sphere (Fibonacci lattice)
  const points = useMemo(() => {
    const n = tools.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    return tools.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const world = worldRef.current;
    if (!root || !world) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rot = { x: -14, y: 0 };
    const vel = { x: 0, y: reduce ? 0 : 0.28 };
    const drag = { active: false, lx: 0, ly: 0 };
    let radius = 132;
    let visible = true;
    let raf = 0;

    const measure = () => {
      const w = root.clientWidth;
      radius = Math.max(96, Math.min(160, w * 0.34));
    };
    measure();

    const tick = () => {
      if (!drag.active) {
        // ease back toward the gentle auto-spin, bleed off fling momentum
        vel.y += ((reduce ? 0 : 0.28) - vel.y) * 0.03;
        vel.x *= 0.94;
      }
      rot.x += vel.x;
      rot.y += vel.y;
      rot.x = Math.max(-62, Math.min(62, rot.x));

      const rxr = (rot.x * Math.PI) / 180;
      const ryr = (rot.y * Math.PI) / 180;
      const cx = Math.cos(rxr);
      const sx = Math.sin(rxr);
      const cy = Math.cos(ryr);
      const sy = Math.sin(ryr);

      world.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;

      for (let i = 0; i < points.length; i++) {
        const el = tileRefs.current[i];
        if (!el) continue;
        const p = points[i];
        // world-space z (depth toward viewer) after rotateX then rotateY
        const y1 = p.y * cx - p.z * sx;
        const z1 = p.y * sx + p.z * cx;
        const z2 = -p.x * sy + z1 * cy;
        const depth = (z2 + 1) / 2; // 0 (back) → 1 (front)

        const scale = 0.62 + depth * 0.5;
        el.style.transform =
          `translate3d(${p.x * radius}px, ${p.y * radius}px, ${p.z * radius}px)` +
          ` rotateY(${-rot.y}deg) rotateX(${-rot.x}deg) scale(${scale})`;
        el.style.opacity = String(0.35 + depth * 0.65);
        el.style.zIndex = String(Math.round(depth * 100));
        // front tiles glow warmer / stronger
        const g = Math.round(depth * 26);
        el.style.boxShadow = `0 ${6 + g}px ${16 + g * 1.4}px -8px rgba(173,115,78,${0.25 + depth * 0.4})`;
        void y1; // (kept for clarity of the rotation math)
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onDown = (e: PointerEvent) => {
      drag.active = true;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      root.setPointerCapture?.(e.pointerId);
      root.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.active) return;
      const dx = e.clientX - drag.lx;
      const dy = e.clientY - drag.ly;
      drag.lx = e.clientX;
      drag.ly = e.clientY;
      rot.y += dx * 0.35;
      rot.x -= dy * 0.35;
      vel.y = dx * 0.35;
      vel.x = -dy * 0.35;
    };
    const onUp = (e: PointerEvent) => {
      drag.active = false;
      root.releasePointerCapture?.(e.pointerId);
      root.style.cursor = 'grab';
    };

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);

    const onResize = () => measure();
    window.addEventListener('resize', onResize);

    // pause the loop while the sphere is scrolled out of view
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.05 }
    );
    io.observe(root);
    if (visible) start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', onResize);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
    };
  }, [points]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex h-[340px] w-full max-w-[440px] cursor-grab touch-none items-center justify-center sm:h-[380px]"
      style={{ perspective: '900px' }}
      role="img"
      aria-label={`Tools I use: ${tools.join(', ')}`}
    >
      {/* soft core glow behind the cloud */}
      <span
        aria-hidden
        className="pointer-events-none absolute h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(173,115,78,0.35),transparent_70%)] blur-2xl"
      />
      <div
        ref={worldRef}
        className="relative"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        aria-hidden
      >
        {tools.map((tool, i) => (
          <div
            key={tool}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 -ml-[30px] -mt-[30px] flex h-[60px] w-[60px] flex-col items-center justify-center gap-1 rounded-2xl border border-white/60 bg-[linear-gradient(150deg,#fffaf3,#f0e2d1)]"
            title={tool}
          >
            <TechIcon name={tool} size={26} />
          </div>
        ))}
      </div>
    </div>
  );
}
