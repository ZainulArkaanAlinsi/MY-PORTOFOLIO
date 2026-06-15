'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  ArrowDown,
  Globe,
  Download,
  Mail,
  GraduationCap,
  Award,
  Briefcase,
} from 'lucide-react';
import type { Project } from '@/lib/github';
import {
  profile,
  experience,
  education,
  certifications,
  featuredProjects,
  languages,
} from '@/data/portfolio';
import ThreeScene from './ThreeScene';
import Preloader from './Preloader';
import ImmersiveCursor from './ImmersiveCursor';
import Marquee from './Marquee';
import ScrambleText from './ScrambleText';
import AboutNewspaper from './AboutNewspaper';
import SkillStudio from './SkillStudio';
import RepoShot from './RepoShot';
import TechIcon from './TechIcon';
import ScrollProgress from './ScrollProgress';
import LangThemeControls from './LangThemeControls';
import MobileNav from './MobileNav';
import SmoothScroll from './SmoothScroll';
import SplitText from './SplitText';
import CopyEmailButton from './CopyEmailButton';
import TiltFrame from './TiltFrame';
import { useT } from '@/i18n/provider';

// Brand glyphs (lucide v1 dropped brand icons) — inherit currentColor.
function Github({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}
function Linkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

// Section kicker: "01 / About" with an accent color + scramble decode
function Kicker({ num, text, color }: { num: string; text: string; color: string }) {
  return (
    <p className="font-body mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]">
      <span className="tabular-nums text-slate-300">{num}</span>
      <span className="h-px w-8" style={{ backgroundColor: color }} />
      <ScrambleText text={text} className="font-mono" />
      <span aria-hidden className="ml-1 inline-block h-3.5 w-1.5 animate-pulse" style={{ backgroundColor: color }} />
    </p>
  );
}

// Big slanted kinetic statement band — filled + outlined words alternate
function StatementBand() {
  const words = ['DESIGN', 'BUILD', 'SHIP', 'REPEAT'];
  const run = [...words, ...words, ...words];
  return (
    <section data-skew aria-hidden="true" className="relative overflow-hidden py-10 sm:py-14">
      <div className="skew-band">
        <div className="flex w-max animate-marquee-left">
          {run.map((w, i) => (
            <span
              key={`${w}-${i}`}
              className={`font-display flex items-center px-6 text-5xl font-black uppercase tracking-tight sm:text-7xl ${
                i % 2 === 0 ? 'text-slate-900' : 'text-stroke-accent'
              }`}
            >
              {w}
              <span className="px-6 text-2xl text-cyan-500 sm:text-4xl">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ImmersivePortfolio({ projects }: { projects: Project[] }) {
  const [ready, setReady] = useState(false);
  const [fancyFx, setFancyFx] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const moreReposCount = Math.max(projects.length - featuredProjects.length, 0);
  const t = useT();
  const navLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.work, href: '#work' },
    { label: t.nav.journey, href: '#journey' },
    { label: t.nav.contact, href: '#contact' },
  ];

  // Enable GPU-heavy flourishes (the liquid hero-title filter) only on
  // capable, non-touch, wide screens — keeps phones smooth.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const wide = window.matchMedia('(min-width: 768px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // defer so we don't setState synchronously in the effect body
    const id = requestAnimationFrame(() => setFancyFx(fine && wide && !reduced));
    return () => cancelAnimationFrame(id);
  }, []);

  // Scroll-spy: highlight the nav link for whichever section sits in a thin
  // band near the middle of the viewport. Works with Lenis (native scroll).
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
    // navLinks identity changes with language, but the section ids are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GSAP scroll reveals + light parallax
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
        gsap.from(group.querySelectorAll('[data-stagger-item]'), {
          scrollTrigger: { trigger: group, start: 'top 80%' },
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
        });
      });

      // light parallax drift
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.2');
        gsap.to(el, {
          yPercent: -speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // animated timeline line grows as you scroll the journey, with a glowing
      // comet that rides the growing tip down the line.
      gsap.utils.toArray<HTMLElement>('[data-grow-line]').forEach((el) => {
        gsap.from(el, {
          scaleY: 0,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 60%', scrub: true },
        });

        const container = el.parentElement;
        const comet = container?.querySelector<HTMLElement>('[data-timeline-comet]');
        if (container && comet) {
          gsap.fromTo(
            comet,
            { top: 8, autoAlpha: 0 },
            {
              top: () => container.offsetHeight - 8,
              autoAlpha: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'bottom 60%',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });

      // scroll-velocity skew — the kinetic bands lean into the scroll
      // direction and spring back, giving that lively "alive" feel.
      const skewEls = gsap.utils.toArray<HTMLElement>('[data-skew]');
      if (skewEls.length) {
        const setters = skewEls.map((el) => gsap.quickSetter(el, 'skewY', 'deg'));
        const clamp = gsap.utils.clamp(-7, 7);
        const proxy = { v: 0 };
        ScrollTrigger.create({
          onUpdate: (self) => {
            const sk = clamp(self.getVelocity() / -360);
            if (Math.abs(sk) > Math.abs(proxy.v)) {
              proxy.v = sk;
              gsap.to(proxy, {
                v: 0,
                duration: 0.7,
                ease: 'power3',
                overwrite: true,
                onUpdate: () => setters.forEach((set) => set(proxy.v)),
              });
            }
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Cursor-tracked spotlight glow on [data-spotlight] cards. One delegated
  // listener on the root (cheap), fine-pointer only so phones skip it.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(
        '[data-spotlight]'
      ) as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    root.addEventListener('pointermove', onMove, { passive: true });
    return () => root.removeEventListener('pointermove', onMove);
  }, []);

  // hero intro once preloader is gone
  useEffect(() => {
    if (!ready) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // the name's letters rise from behind their word masks…
      tl.from('[data-hero-name] .split-char', {
        yPercent: 115,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.035,
      });
      // …then the surrounding lines flow up, overlapping the tail of the name
      tl.from(
        '[data-hero-line]',
        {
          yPercent: 70,
          autoAlpha: 0,
          duration: 1.05,
          ease: 'power4.out',
          stagger: 0.09,
        },
        '-=0.55'
      );
    }, rootRef);
    return () => ctx.revert();
  }, [ready]);

  // liquid distortion intensifies when the hero title is hovered
  const liquify = (to: number) => {
    if (!dispRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    gsap.to(dispRef.current, { attr: { scale: to }, duration: 0.5, ease: 'power2.out' });
  };

  return (
    <div
      ref={rootRef}
      className="font-body relative min-h-screen w-full overflow-x-hidden text-slate-900"
    >
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <SmoothScroll />
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />
      <ImmersiveCursor />

      {/* SVG filter used for the liquid hero title */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <filter id="liquid">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" result="noise">
            <animate
              attributeName="baseFrequency"
              dur="14s"
              values="0.012 0.02;0.018 0.012;0.012 0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="6" />
        </filter>
      </svg>

      {/* ===== NAV ===== */}
      <nav className="fixed inset-x-0 top-0 z-50 mx-auto mt-4 flex max-w-6xl items-center justify-between gap-4 px-3">
        <div className="glass flex w-full items-center justify-between gap-4 rounded-full px-5 py-2.5">
          <a href="#top" className="font-display text-sm font-extrabold tracking-tight">
            {profile.handle}
          </a>
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((l) => {
              const isActive = activeSection === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`link-underline font-body text-sm transition-colors hover:text-blue-600 ${
                    isActive ? 'is-active font-semibold text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-2.5">
            <LangThemeControls />
            <a
              href={profile.cv}
              download
              data-cursor="hover"
              className="hidden items-center gap-1.5 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-105 sm:inline-flex"
            >
              <Download className="h-3.5 w-3.5" /> {t.nav.resume}
            </a>
            <MobileNav links={navLinks} active={activeSection} />
          </div>
        </div>
      </nav>

      {/* ===== HERO — 3D + liquid title over a dot grid ===== */}
      <header
        id="top"
        className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
      >
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
        <ThreeScene />
        {/* morphing color blob */}
        <div className="animate-blob pointer-events-none absolute left-[8%] top-[18%] h-56 w-56 bg-linear-to-br from-blue-400/30 via-cyan-300/30 to-violet-400/30 blur-2xl sm:h-80 sm:w-80" />
        {/* decorative outlined statement words */}
        <span
          aria-hidden="true"
          className="font-display text-stroke pointer-events-none absolute -left-4 top-[12%] hidden -rotate-6 text-[14vw] font-black leading-none opacity-40 sm:left-6 sm:block"
        >
          FULL-STACK
        </span>
        <span
          aria-hidden="true"
          className="font-display text-stroke pointer-events-none absolute -right-2 bottom-[14%] hidden rotate-6 text-[14vw] font-black leading-none opacity-40 sm:right-8 sm:block"
        >
          MOBILE
        </span>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[color:var(--background)]" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <p
            data-hero-line
            className="glass-soft mx-auto mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-slate-600"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {t.availability}
          </p>

          <p data-hero-line className="font-body mb-3 text-base text-slate-500 sm:text-lg">
            {t.hero.greeting}
          </p>

          <h1
            data-hero-name
            onMouseEnter={() => liquify(22)}
            onMouseLeave={() => liquify(6)}
            className="hero-title liquid-target font-display text-[clamp(44px,10vw,116px)] font-black leading-[0.92] tracking-[-0.03em]"
            style={fancyFx ? { filter: 'url(#liquid)' } : undefined}
          >
            <SplitText text={profile.name} />
          </h1>

          <div data-hero-line className="relative mt-4 inline-block">
            <h2 className="animated-gradient-text font-display text-[clamp(20px,4vw,44px)] font-black tracking-tight">
              {t.hero.role}
            </h2>
            <span className="sticker glass absolute -right-10 -top-6 hidden rotate-6 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 sm:-right-16 sm:block">
              ★ 2026
            </span>
          </div>

          <p
            data-hero-line
            className="font-body mx-auto mt-7 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            {t.hero.subheadline}
          </p>

          <div data-hero-line className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#work"
              data-magnetic
              data-cursor="hover"
              className="cta-shine inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/30 transition-shadow hover:shadow-blue-500/50"
            >
              {t.hero.viewProjects} <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              data-magnetic
              data-cursor="hover"
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
            >
              <Mail className="h-4 w-4" /> {t.hero.contactMe}
            </a>
            <a
              href={profile.cv}
              download
              data-magnetic
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-slate-600 underline-offset-4 transition-colors hover:text-blue-600 hover:underline"
            >
              <Download className="h-4 w-4" /> {t.hero.downloadResume}
            </a>
          </div>

          {/* tech logo strip */}
          <div data-hero-line className="mt-12 flex flex-col items-center gap-3">
            <span className="font-body text-[10px] uppercase tracking-[0.35em] text-slate-400">
              {t.hero.buildingWith}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              {['Flutter', 'Next.js', 'React', 'Laravel', 'Firebase', 'TypeScript', 'Dart'].map((t) => (
                <TechIcon key={t} name={t} size={26} className="opacity-80 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:opacity-100" />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 sm:flex">
          <span className="font-body text-[9px] uppercase tracking-[0.4em]">{t.hero.scroll}</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </header>

      <Marquee />

      {/* ===== 01 · ABOUT — Hybrid Glass-Newspaper ===== */}
      <AboutNewspaper />

      <StatementBand />

      {/* ===== 02 · SKILLS — bento grid on a color mesh ===== */}
      <section id="skills" className="bg-mesh relative scroll-mt-24 px-6 py-28 sm:px-12 sm:py-44">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="mb-14 text-center">
            <div className="flex justify-center">
              <Kicker num="02" text={t.skills.kicker} color="#ad734e" />
            </div>
            <h2 className="font-display text-[clamp(32px,5.5vw,64px)] font-bold tracking-tight text-balance">
              {t.skills.headingPre} <span className="em-serif animated-gradient-text">{t.skills.headingEm}</span>
            </h2>
          </div>

          {/* interactive device studio */}
          <div data-reveal>
            <SkillStudio />
            <p className="font-body mt-8 text-center text-xs text-slate-400">
              {t.skills.note}
            </p>
          </div>

          {/* languages strip */}
          <div data-reveal-stagger className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
            {languages.map((l, i) => (
              <div key={l.name} data-stagger-item className="glass-news rounded-2xl p-5 text-center">
                <p className="font-display font-bold text-[color:var(--foreground)]">{t.languageNames[i]}</p>
                <p className="font-body text-xs text-slate-500">{t.proficiency[i]}</p>
                <div className="mx-auto mt-3 h-1.5 w-3/4 overflow-hidden rounded-full bg-[rgba(69,29,7,0.1)]">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#ad734e] to-[#dbd294]"
                    style={{ width: `${l.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 03 · WORK — alternating large showcase rows ===== */}
      <section id="work" className="relative scroll-mt-24 px-6 py-28 sm:px-12 sm:py-44">
        <div className="mx-auto max-w-6xl">
          {/* header */}
          <div data-reveal className="mb-16 flex flex-wrap items-end justify-between gap-4 sm:mb-24">
            <div>
              <Kicker num="03" text={t.work.kicker} color="#d12323" />
              <h2 className="font-display text-[clamp(32px,5.5vw,64px)] font-bold tracking-tight text-balance">
                {t.work.headingPre} <span className="em-serif animated-gradient-text">{t.work.headingEm}</span>
              </h2>
            </div>
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
            >
              {moreReposCount > 0 ? t.work.more.replace('{n}', String(moreReposCount)) : t.work.all}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* alternating showcase rows */}
          <div className="space-y-24 sm:space-y-32">
            {featuredProjects.map((p, i) => {
              const flip = i % 2 === 1;
              return (
                <article
                  key={p.name}
                  data-reveal
                  className="group grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
                >
                  {/* preview — matte gradient frame with a subtle cursor tilt */}
                  <div className={`relative isolate ${flip ? 'md:order-2' : ''}`}>
                    <span className="section-watermark pointer-events-none absolute -top-12 -left-2 -z-10 text-[7rem] leading-none sm:text-[10rem]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <TiltFrame>
                      <div className="gradient-border p-2 shadow-[0_34px_64px_-30px_rgba(69,29,7,0.55)] sm:p-2.5">
                        <RepoShot
                          url={p.github}
                          imgClassName="aspect-[16/10] transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                      </div>
                    </TiltFrame>
                  </div>

                  {/* details */}
                  <div className={`relative ${flip ? 'md:order-1' : ''}`}>
                    <div className={`mb-5 h-1.5 w-16 rounded-full bg-linear-to-r ${p.accent}`} />
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      {i === 0 && (
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
                          {t.work.spotlight}
                        </span>
                      )}
                      <span className="font-body text-xs font-medium uppercase tracking-wider text-slate-400">
                        {t.work.categories[i]} · {p.year}
                      </span>
                    </div>
                    <h3 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                      {p.name}
                    </h3>
                    <p className="font-body mt-4 max-w-prose text-base leading-relaxed text-slate-600">
                      {t.work.summaries[i]}
                    </p>
                    <div className="glass-soft mt-5 max-w-prose rounded-2xl p-4">
                      <p className="font-body text-sm leading-relaxed text-slate-600">
                        <span className="font-semibold text-blue-600">{t.work.impact}</span>
                        {t.work.impacts[i]}
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/[0.04] px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          <TechIcon name={s} size={14} /> {s}
                        </span>
                      ))}
                    </div>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="hover"
                        className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-105"
                      >
                        <Github className="h-4 w-4" /> {t.work.viewCode}
                      </a>
                      {p.demo && (
                        <a
                          href={p.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="hover"
                          className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600"
                        >
                          <Globe className="h-4 w-4" /> {t.work.liveDemo}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 04 · JOURNEY — glowing timeline + node icons ===== */}
      <section id="journey" className="relative scroll-mt-24 overflow-hidden px-6 py-28 sm:px-12 sm:py-44">
        <div className="line-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="glow-orb right-[-5rem] top-24 h-72 w-72 bg-emerald-300/40" />

        <div className="relative mx-auto max-w-6xl">
          <div data-reveal className="mb-14 text-center">
            <div className="flex justify-center">
              <Kicker num="04" text={t.journey.kicker} color="#8f823a" />
            </div>
            <h2 className="font-display text-[clamp(32px,5.5vw,64px)] font-bold tracking-tight text-balance">
              {t.journey.headingPre} <span className="em-serif animated-gradient-text">{t.journey.headingEm}</span>
            </h2>
          </div>

          {/* experience timeline */}
          <div data-reveal-stagger className="relative mx-auto max-w-3xl">
            <span
              data-grow-line
              className="timeline-line absolute bottom-2 left-[9px] top-2 w-[2px] md:left-1/2 md:-translate-x-1/2"
            />
            <span
              data-timeline-comet
              aria-hidden
              className="timeline-comet absolute left-[10px] top-2 -translate-x-1/2 md:left-1/2"
            />
            {experience.map((exp, i) => (
              <div
                key={`${exp.company}-${i}`}
                data-stagger-item
                className={`relative mb-10 pl-10 md:w-1/2 md:pl-0 ${
                  i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'
                }`}
              >
                <span
                  className={`absolute left-0 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30 ${
                    i % 2 === 0 ? 'md:-right-[10px] md:left-auto' : 'md:-left-[10px]'
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute -inset-0.5 -z-10 animate-ping rounded-full bg-blue-400/50"
                  />
                  <Briefcase className="h-2.5 w-2.5" />
                </span>
                <div data-spotlight className="glass glow-card spotlight rounded-2xl p-5 text-left">
                  <span className="font-body text-xs font-semibold uppercase tracking-wider text-blue-600">
                    {exp.period}
                  </span>
                  <h3 className="font-display mt-1 text-lg font-bold">{t.exp[i]?.role ?? exp.role}</h3>
                  <p className="font-body text-sm font-medium text-slate-500">{exp.company}</p>
                  <p className="font-body mt-2 text-sm leading-relaxed text-slate-600">
                    {t.exp[i]?.description ?? exp.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        <TechIcon name={tag} size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* certifications */}
          <div className="mt-16">
            <h3 className="font-display mb-6 flex items-center justify-center gap-2 text-xl font-bold">
              <Award className="h-5 w-5 text-cyan-500" /> {t.journey.certifications}
            </h3>
            <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2">
              {certifications.map((c, i) => (
                <a
                  key={c.title}
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-stagger-item
                  data-cursor="hover"
                  data-spotlight
                  className="glass glow-card spotlight flex items-center gap-4 rounded-2xl p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 text-white">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display truncate font-bold">{c.title}</p>
                    <p className="font-body text-sm text-slate-500">
                      {c.issuer} · {c.year} · {t.journey.grades[i] ?? c.grade}
                    </p>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-slate-300" />
                </a>
              ))}
            </div>
          </div>

          {/* education */}
          <div className="mt-12">
            <h3 className="font-display mb-6 flex items-center gap-2 text-xl font-bold">
              <GraduationCap className="h-5 w-5 text-violet-500" /> {t.journey.education}
            </h3>
            <div data-reveal-stagger className="space-y-4">
              {education.map((ed) => (
                <div key={ed.school} data-stagger-item data-spotlight className="glass glow-card spotlight rounded-2xl p-6">
                  <span className="font-body text-xs font-semibold uppercase tracking-wider text-violet-600">
                    {ed.period}
                  </span>
                  <h4 className="font-display mt-1 text-lg font-bold">{ed.school}</h4>
                  <p className="font-body text-sm font-medium text-slate-500">{t.edu.program}</p>
                  <p className="font-body mt-2 text-sm leading-relaxed text-slate-600">
                    {t.edu.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 05 · CONTACT — gradient glass panel + conic glow ring ===== */}
      <section id="contact" className="relative scroll-mt-24 px-6 py-28 sm:px-12 sm:py-44">
        <div
          data-reveal
          className="gradient-border relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2">
            <div className="animate-spin-slow h-full w-full rounded-full bg-[conic-gradient(from_0deg,rgba(173,115,78,0.28),rgba(219,210,148,0.2),rgba(209,35,35,0.22),rgba(173,115,78,0.28))] blur-2xl" />
          </div>

          <div className="relative">
            <div className="flex justify-center">
              <Kicker num="05" text={t.contact.kicker} color="#ad734e" />
            </div>
            <h2 className="font-display text-[clamp(32px,6vw,72px)] font-black leading-[0.98] tracking-[-0.02em]">
              {t.contact.headingPre}
              <span className="em-serif animated-gradient-text"> {t.contact.headingEm}</span>
            </h2>
            <p className="font-body mx-auto mt-6 max-w-xl text-lg text-slate-600">
              {t.contact.paragraph}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                data-magnetic
                data-cursor="hover"
                className="cta-shine inline-flex items-center gap-2.5 rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/30 transition-shadow hover:shadow-blue-500/50"
              >
                <Mail className="h-5 w-5" /> {profile.email}
              </a>
              <CopyEmailButton />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href={profile.social.website}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
              >
                <Globe className="h-4 w-4" /> Website
              </a>
              <a
                href={profile.cv}
                download
                data-cursor="hover"
                className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
              >
                <Download className="h-4 w-4" /> {t.contact.resume}
              </a>
            </div>
          </div>
        </div>

        <footer className="font-body mx-auto mt-16 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-slate-900/[0.08] pt-8 text-xs text-slate-400">
          <span>{profile.name}</span>
          <span>© {new Date().getFullYear()} · {t.contact.footerNote}</span>
        </footer>
      </section>
    </div>
  );
}
