'use client';

import { motion } from 'framer-motion';
import { MapPin, Briefcase, Star, Sparkle } from 'lucide-react';
import { profile, experience, stats, tools } from '@/data/portfolio';
import AnimatedCounter from '@/components/AnimatedCounter';
import Typewriter from './Typewriter';
import TechIcon from './TechIcon';

const today = new Date().toLocaleDateString('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const KICKERS = ['Career', 'Teaching', 'Craft'];

export default function AboutNewspaper() {
  return (
    <section id="about" className="paper relative overflow-hidden px-5 py-24 sm:px-10 sm:py-36">
      <div className="relative mx-auto max-w-6xl">
        {/* ===== MASTHEAD ===== */}
        <div data-reveal className="mb-16 sm:mb-24">
          <div className="flex items-center justify-between border-b border-[rgba(69,29,7,0.2)] pb-3 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 sm:text-[11px]">
            <span>Vol. I — About</span>
            <span className="hidden sm:inline">★ Est. 2023 ★</span>
            <span>Bekasi, ID</span>
          </div>

          <h2 className="font-serif my-5 text-center text-[clamp(36px,8vw,92px)] font-black uppercase leading-[0.92] tracking-tight text-[color:var(--rebel)]">
            The Developer Times
          </h2>

          <div className="flex flex-col items-center justify-between gap-1 border-y border-[rgba(69,29,7,0.2)] py-3 font-body text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500 sm:flex-row sm:text-[11px]">
            <span>{today}</span>
            <span className="text-[color:var(--cardinal)]">Full-Stack · Mobile · Web</span>
            <span>Portfolio Edition</span>
          </div>
        </div>

        {/* ===== LEAD ===== */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          {/* article column */}
          <article data-reveal className="lg:col-span-7">
            <p className="font-body mb-5 text-[11px] font-bold uppercase tracking-[0.35em] text-[color:var(--cardinal)]">
              Front Page · About the Developer
            </p>
            <h3 className="font-serif text-[clamp(28px,4.8vw,52px)] font-black leading-[1.06] text-[color:var(--rebel)]">
              Turning ideas into products
              <br className="hidden sm:block" /> that actually ship.
            </h3>

            <p className="font-body mt-5 border-b border-[rgba(69,29,7,0.2)] pb-6 text-base italic text-slate-500">
              By {profile.name} — {profile.title}, reporting from {profile.location}.
            </p>

            {/* standfirst */}
            <p className="font-body mt-8 text-xl leading-relaxed text-slate-700 sm:text-2xl">
              <Typewriter text="Hi — I'm a developer who likes turning rough ideas into real, working software." />
            </p>

            {/* body — generous single measure, no cramped columns */}
            <div className="mt-8 max-w-prose space-y-6 text-[16px] leading-[1.85] text-slate-700">
              <p className="drop-cap">{profile.bio}</p>
              <p>
                My journey runs from teaching the fundamentals of the web to junior students,
                to building cross-platform mobile apps and full-stack dashboards used in the
                real world — attendance systems, booking flows, reader apps, and admin panels.
              </p>
              <p>
                I care about clean architecture, smooth interaction, and the unglamorous
                details — error states, offline sync, performance — that decide whether a
                product feels trustworthy. I work end to end: design, build, deploy, iterate.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <span className="h-px flex-1 bg-[rgba(69,29,7,0.18)]" />
              <Sparkle className="h-4 w-4 text-[color:var(--santa-fe)]" />
              <span className="h-px flex-1 bg-[rgba(69,29,7,0.18)]" />
            </div>
          </article>

          {/* portrait + fact rail */}
          <aside className="lg:col-span-5">
            <div className="space-y-10">
              {/* portrait */}
              <figure data-reveal className="relative">
                <div className="gradient-border overflow-hidden p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="aspect-4/5 w-full rounded-[0.9rem] object-cover"
                    data-parallax="0.08"
                  />
                </div>

                {/* floating glass chips — given room to breathe */}
                <div className="glass animate-float absolute -left-4 -top-4 rounded-2xl px-4 py-2.5">
                  <p className="font-display text-xs font-bold text-[color:var(--santa-fe)]">
                    Flutter · Next.js
                  </p>
                </div>
                <div className="glass absolute -bottom-5 -right-4 rounded-2xl px-4 py-3">
                  <p className="font-display text-sm font-bold text-[color:var(--rebel)]">
                    {profile.shortName}
                  </p>
                  <p className="font-body text-xs text-slate-500">Available for work</p>
                </div>

                {/* draggable polaroid pinned to the portrait */}
                <motion.div
                  drag
                  dragSnapToOrigin
                  dragElastic={0.2}
                  whileDrag={{ scale: 1.06, rotate: 0, zIndex: 50 }}
                  className="grab absolute -bottom-10 -left-8 hidden w-28 -rotate-6 rounded-sm bg-white p-2 pb-6 shadow-xl shadow-[rgba(69,29,7,0.3)] sm:block"
                  style={{ touchAction: 'none' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/arkaan22.png"
                    alt=""
                    aria-hidden
                    className="aspect-square w-full object-cover"
                    draggable={false}
                  />
                  <figcaption className="font-body absolute inset-x-0 bottom-1 text-center text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    drag me ✦
                  </figcaption>
                </motion.div>
              </figure>

              {/* fact file */}
              <div data-reveal className="glass-news rounded-3xl p-7">
                <h4 className="font-serif mb-4 border-b border-[rgba(69,29,7,0.18)] pb-3 text-lg font-black uppercase tracking-tight text-[color:var(--rebel)]">
                  Fact File
                </h4>
                <dl className="divide-y divide-[rgba(69,29,7,0.1)] text-sm">
                  {[
                    { icon: MapPin, k: 'Based in', v: profile.location },
                    { icon: Briefcase, k: 'Role', v: profile.title },
                    { icon: Star, k: 'Focus', v: 'Flutter · Next.js · Laravel' },
                    { icon: Star, k: 'Experience', v: `${profile.yearsExperience}+ years` },
                    { icon: Star, k: 'Status', v: profile.availability },
                  ].map((row) => (
                    <div key={row.k} className="flex items-start gap-3 py-3">
                      <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--santa-fe)]" />
                      <div>
                        <dt className="font-body text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          {row.k}
                        </dt>
                        <dd className="font-body font-medium text-slate-800">{row.v}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </aside>
        </div>

        {/* ===== PULL QUOTE (full-width band) ===== */}
        <blockquote data-reveal className="relative mx-auto mt-24 max-w-3xl text-center">
          <span
            aria-hidden
            className="font-serif block text-7xl leading-none text-[color:var(--santa-fe)] opacity-40"
          >
            &ldquo;
          </span>
          <p className="font-serif -mt-4 text-[clamp(22px,3.2vw,36px)] font-bold italic leading-snug text-[color:var(--rebel)]">
            Shipping things that actually work beats shipping things that merely look done.
          </p>
          <footer className="font-body mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            — {profile.shortName}
          </footer>
        </blockquote>

        {/* ===== DAILY TOOLS (real brand logos) ===== */}
        <div data-reveal className="glass-news mt-20 rounded-3xl p-7 sm:p-9">
          <p className="font-body mb-6 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-[color:var(--santa-fe)]">
            Daily tools of the trade
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-6">
            {tools.map((t) => (
              <div
                key={t}
                className="flex w-16 flex-col items-center gap-2 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <TechIcon name={t} size={34} className="transition-transform duration-300 hover:scale-110" />
                <span className="font-body text-center text-[10px] leading-tight text-slate-500">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CAREER DISPATCHES ===== */}
        <div className="mt-24">
          <div data-reveal className="mb-10 flex items-center gap-4">
            <h4 className="font-serif text-2xl font-black uppercase tracking-tight text-[color:var(--rebel)]">
              Recent Dispatches
            </h4>
            <span className="h-px flex-1 bg-[rgba(69,29,7,0.18)]" />
          </div>

          <div data-reveal-stagger className="grid gap-6 sm:grid-cols-3">
            {experience.slice(0, 3).map((exp, i) => (
              <article
                key={`${exp.company}-${i}`}
                data-stagger-item
                className="glass-news flex flex-col rounded-3xl p-7"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--cardinal)]">
                    {KICKERS[i] ?? 'Notes'}
                  </span>
                  <span className="font-body text-[11px] font-semibold text-slate-400">
                    {exp.period}
                  </span>
                </div>
                <h5 className="font-serif text-xl font-black leading-tight text-[color:var(--rebel)]">
                  {exp.role}
                </h5>
                <p className="font-body mt-0.5 text-sm font-semibold text-[color:var(--santa-fe)]">
                  {exp.company}
                </p>
                <p className="font-body mt-3 text-sm leading-relaxed text-slate-600">
                  {exp.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* ===== STAT STRIP ===== */}
        <div data-reveal-stagger className="mt-16 grid grid-cols-3 gap-6">
          {[
            { target: profile.yearsExperience, suffix: '+', label: 'Years coding' },
            { target: stats.projectsCompleted, suffix: '+', label: 'Projects built' },
            { target: stats.technologiesMastered, suffix: '+', label: 'Technologies' },
          ].map((s) => (
            <div key={s.label} data-stagger-item className="glass-news rounded-3xl px-4 py-7 text-center">
              <div className="text-gradient font-display text-4xl font-black sm:text-5xl">
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </div>
              <div className="font-body mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
