'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, X, Mail, Download, ArrowUpRight } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { useT } from '@/i18n/provider';

type NavLink = { label: string; href: string };

/**
 * Mobile / tablet navigation (<lg).
 * The desktop nav hides its section links below `lg`, so phones had no way to
 * jump around the page. This adds a hamburger that opens a full-screen,
 * GSAP-animated overlay with big numbered section links, socials and a CTA.
 */
export default function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const t = useT();
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  // lock body scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // open / close animation (clip-wipe panel + staggered links)
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const items = itemsRef.current
      ? Array.from(itemsRef.current.querySelectorAll<HTMLElement>('[data-mnav-item]'))
      : [];
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // skip animating closed→closed on first mount, just hide
    if (!mounted.current) {
      mounted.current = true;
      gsap.set(panel, { autoAlpha: 0 });
      return;
    }

    gsap.killTweensOf([panel, ...items]);

    if (open) {
      if (reduced) {
        gsap.set(panel, { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)' });
        gsap.set(items, { y: 0, autoAlpha: 1 });
        return;
      }
      gsap
        .timeline()
        .set(panel, { autoAlpha: 1 })
        .fromTo(
          panel,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: 'power4.out' }
        )
        .fromTo(
          items,
          { y: 36, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06 },
          '-=0.2'
        );
    } else {
      if (reduced) {
        gsap.set(panel, { autoAlpha: 0 });
        return;
      }
      gsap.to(panel, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => gsap.set(panel, { autoAlpha: 0, clipPath: 'inset(0 0 0% 0)' }),
      });
    }
  }, [open]);

  const socials: NavLink[] = [
    { label: 'GitHub', href: profile.social.github },
    { label: 'LinkedIn', href: profile.social.linkedin },
    { label: 'Website', href: profile.social.website },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(69,29,7,0.12)] bg-[var(--surface)]/60 text-slate-600 transition-colors hover:text-[color:var(--santa-fe)] lg:hidden"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed inset-0 z-[70] flex flex-col overflow-hidden bg-[color:var(--background)]/95 px-6 pb-10 pt-24 backdrop-blur-xl lg:hidden ${
          open ? '' : 'pointer-events-none'
        }`}
      >
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-[color:var(--santa-fe)]/15 blur-3xl" />

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute right-6 top-7 flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(69,29,7,0.14)] bg-[var(--surface)]/70 text-slate-600 transition-colors hover:text-[color:var(--cardinal)]"
        >
          <X className="h-5 w-5" />
        </button>

        <div ref={itemsRef} className="relative flex flex-1 flex-col">
          <p
            data-mnav-item
            className="font-body mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400"
          >
            {profile.handle}
          </p>

          <nav className="flex flex-col">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                data-mnav-item
                className="group flex items-baseline gap-4 border-b border-[var(--line)] py-4"
              >
                <span className="font-mono text-xs tabular-nums text-[color:var(--santa-fe)]">
                  0{i + 1}
                </span>
                <span className="font-display text-3xl font-bold tracking-tight text-[color:var(--foreground)] transition-colors group-hover:text-[color:var(--santa-fe)] sm:text-4xl">
                  {l.label}
                </span>
                <ArrowUpRight className="ml-auto h-5 w-5 self-center text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--santa-fe)]" />
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <a
              data-mnav-item
              href={`mailto:${profile.email}`}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25"
            >
              <Mail className="h-4 w-4" /> {t.hero.contactMe}
            </a>
            <a
              data-mnav-item
              href={profile.cv}
              download
              onClick={() => setOpen(false)}
              className="ml-3 inline-flex items-center gap-2 rounded-full border border-[rgba(69,29,7,0.16)] px-5 py-3.5 text-sm font-semibold text-slate-700"
            >
              <Download className="h-4 w-4" /> {t.nav.resume}
            </a>

            <div data-mnav-item className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-[color:var(--santa-fe)]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
