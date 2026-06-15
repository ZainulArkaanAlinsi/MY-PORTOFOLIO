'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Buttery smooth scrolling via Lenis, wired into GSAP.
 *
 * Lenis virtualises the *native* window scroll (it never transforms a wrapper),
 * so all the `position: fixed` chrome — nav, custom cursor, grain, scroll bar —
 * keeps working. We drive Lenis from gsap.ticker and feed ScrollTrigger.update
 * on every Lenis scroll so the scrub/reveal/parallax animations stay perfectly
 * in sync with the smoothed scroll position.
 *
 * Disabled entirely under prefers-reduced-motion (native scroll takes over),
 * and touch scrolling is left native so phones keep their momentum feel.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // keep ScrollTrigger in lock-step with the smoothed scroll
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    // single RAF loop: gsap drives Lenis (time is seconds → Lenis wants ms)
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // smooth in-page anchor navigation, offset for the fixed nav bar
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as Element | null)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      const href = a?.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      // Lenis honours the sections' existing `scroll-mt-24` (scroll-margin),
      // so no manual offset is needed — they land just below the fixed nav.
      lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
    };
    document.addEventListener('click', onClick);

    // recalc triggers once everything (fonts/images) has settled
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(refreshId);
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(onTick);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  return null;
}
