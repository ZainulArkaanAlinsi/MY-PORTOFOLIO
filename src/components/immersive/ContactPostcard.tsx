'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Send } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { useT } from '@/i18n/provider';
import CopyEmailButton from './CopyEmailButton';
import TiltFrame from './TiltFrame';

/**
 * The contact centrepiece: an airmail postcard addressed to me.
 *
 * It reuses the site's paper-and-ink language (polaroids, tape, sticky notes in
 * the hero) rather than inventing a new one — here it's a par-avion edge, a
 * rubber postmark and a perforated stamp holding the real photo.
 *
 * On scroll the card lands like it was tossed onto the desk, the postmark gets
 * stamped on, the address lines write themselves in and the stamp drops last.
 * All of it is skipped under reduced motion (the card is simply there), and the
 * cursor tilt is mouse-only via TiltFrame, so a touch drag never sticks a tilt.
 */
export default function ContactPostcard() {
  const t = useT();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%' } });
      tl.from('[data-card]', {
        y: 64,
        rotate: -3.5,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
      })
        .from(
          '[data-postmark]',
          { scale: 2.4, rotate: -30, autoAlpha: 0, duration: 0.45, ease: 'back.out(2)' },
          '-=0.3'
        )
        .from(
          '[data-line]',
          { x: -20, autoAlpha: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out' },
          '-=0.2'
        )
        .from(
          '[data-stamp]',
          { y: -24, rotate: 12, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.6)' },
          '-=0.45'
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <TiltFrame max={4}>
        <div data-card className="airmail relative rounded-[1.15rem]">
          {/* a strip of tape holding it to the page */}
          <span
            aria-hidden
            className="tape -top-3 left-10 rotate-[-6deg] rounded-[2px]"
          />

          {/* Laid out like a real postcard: the address runs down the left,
              the stamp and its cancellation sit in the top-right corner. A
              single stacked column left ~100px of blank ruled paper between the
              stamp row and the address, which just read as a gap. */}
          <div className="postcard-paper relative overflow-hidden rounded-[0.6rem] px-5 py-6 sm:px-9 sm:py-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
              {/* stamp + postmark — first on mobile, top-right on desktop */}
              <div className="order-1 flex shrink-0 items-start gap-3 sm:order-2 sm:flex-col sm:items-center sm:gap-4">
                {/* postage stamp holding the real photo */}
                <span data-stamp aria-hidden className="stamp block w-[74px] rotate-[3deg] sm:w-[84px]">
                  <span className="block overflow-hidden rounded-[2px] bg-[var(--surface-2)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.avatar}
                      alt=""
                      className="block aspect-[4/5] w-full object-cover"
                    />
                  </span>
                  <span className="font-mono mt-1 block text-center text-[7px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    ID · 2026
                  </span>
                </span>

                {/* rubber postmark */}
                <span
                  data-postmark
                  aria-hidden
                  className="postmark relative flex h-[70px] w-[70px] shrink-0 rotate-[-12deg] items-center justify-center text-center sm:h-[76px] sm:w-[76px]"
                >
                  <span className="font-mono text-[8px] font-bold uppercase leading-[1.4] tracking-[0.1em] text-[color:var(--cardinal)]/75">
                    Bekasi
                    <br />
                    ★ ID ★
                    <br />
                    2026
                  </span>
                </span>
              </div>

              {/* ── the address side ── */}
              <div className="order-2 min-w-0 flex-1 sm:order-1">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[color:var(--cardinal)]">
                  Par Avion
                </p>
                <p className="font-body mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  {t.contact.emailDirect}
                </p>

                <div className="mt-5">
                  <p
                    data-line
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400"
                  >
                    To
                  </p>

                  <a
                    data-line
                    href={`mailto:${profile.email}`}
                    data-cursor="hover"
                    className="address-rule mt-2 block break-all pb-3 font-serif text-[clamp(20px,3.6vw,34px)] font-bold italic leading-tight text-[color:var(--rebel)] transition-colors hover:text-[color:var(--cardinal)]"
                  >
                    {profile.email}
                  </a>

                  <p
                    data-line
                    className="address-rule font-body flex flex-wrap items-center gap-x-2.5 gap-y-1 py-3 text-sm text-[color:var(--muted)]"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[color:var(--santa-fe)]" />
                    {profile.location}
                    <span className="text-[color:var(--santa-fe)]">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      {t.contact.available}
                    </span>
                  </p>
                </div>

                {/* ── send row ── */}
                <div data-line className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${profile.email}`}
                    data-magnetic
                    data-cursor="hover"
                    className="cta-shine inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-shadow hover:shadow-blue-500/50"
                  >
                    <Send className="h-4 w-4" /> {t.contact.sendEmail}
                  </a>
                  <CopyEmailButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </TiltFrame>

      {/* a small note pinned under the card, like a reminder on the desk */}
      <div
        aria-hidden
        className="scrap-bob pointer-events-none absolute -bottom-7 right-4 hidden sm:block"
        style={{ ['--rot' as string]: '-5deg' }}
      >
        <div className="sticky-note rounded-sm px-3.5 py-2">
          <span className="pushpin absolute -top-1.5 left-1/2 -translate-x-1/2" />
          <p className="font-body inline-flex items-center gap-1.5 text-[11px] font-bold text-[color:var(--rebel)]">
            <Mail className="h-3.5 w-3.5" /> ~24h
          </p>
        </div>
      </div>
    </div>
  );
}
