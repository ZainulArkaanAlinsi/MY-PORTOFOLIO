import type Lenis from 'lenis';

/**
 * Shared handle on the page's Lenis instance, plus a scroll lock that actually
 * works with it.
 *
 * `document.body.style.overflow = 'hidden'` is the usual trick, but it does
 * nothing here: `<html>` is the scroll container (see `layout.tsx`), and Lenis
 * re-applies its own scroll position every frame anyway — so the page kept
 * scrolling behind the open mobile menu. Locking has to go through Lenis when
 * it is running, and through `<html>` when it is not (reduced motion).
 */

let lenis: Lenis | null = null;
let locks = 0;
let prevOverflow = '';

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  lenis?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  document.documentElement.style.overflow = prevOverflow;
  lenis?.start();
}
