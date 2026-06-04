'use client';

import { motion } from 'framer-motion';
import { MapPin, Briefcase, Star, Sparkle } from 'lucide-react';
import { profile, experience, stats, tools } from '@/data/portfolio';
import AnimatedCounter from '@/components/AnimatedCounter';
import Typewriter from './Typewriter';
import TechIcon from './TechIcon';
import { useApp } from '@/i18n/provider';

const DATE_LOCALE: Record<string, string> = { id: 'id-ID', en: 'en-GB', ar: 'ar' };

export default function AboutNewspaper() {
  const { t, lang } = useApp();
  const today = new Date().toLocaleDateString(DATE_LOCALE[lang] ?? 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <section id="about" className="paper relative scroll-mt-24 overflow-hidden px-6 py-28 sm:px-12 sm:py-44">
      <div className="relative mx-auto max-w-6xl">
        {/* ===== MASTHEAD ===== */}
        <div data-reveal className="mb-16 sm:mb-24">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 sm:text-[11px]">
            <span>{t.about.volume}</span>
            <span className="hidden sm:inline">{t.about.est}</span>
            <span>Bekasi, ID</span>
          </div>

          <h2 className="font-serif my-5 text-center text-[clamp(36px,8vw,92px)] font-black uppercase leading-[0.92] tracking-tight text-[color:var(--rebel)]">
            The Developer Times
          </h2>

          <div className="flex flex-col items-center justify-between gap-1 border-y border-[var(--line)] py-3 font-body text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500 sm:flex-row sm:text-[11px]">
            <span>{today}</span>
            <span className="text-[color:var(--cardinal)]">{t.about.tags}</span>
            <span>{t.about.edition}</span>
          </div>
        </div>

        {/* ===== LEAD ===== */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <article data-reveal className="lg:col-span-7">
            <p className="font-body mb-5 text-[11px] font-bold uppercase tracking-[0.35em] text-[color:var(--cardinal)]">
              {t.about.frontPage}
            </p>
            <h3 className="font-serif text-[clamp(28px,4.8vw,52px)] font-black leading-[1.06] text-[color:var(--rebel)]">
              {t.about.headline}
            </h3>

            <p className="font-body mt-5 border-b border-[var(--line)] pb-6 text-base italic text-slate-500">
              {t.about.bylinePre} {profile.name} — {t.hero.role}, {t.about.reportingFrom} {profile.location}.
            </p>

            {/* standfirst */}
            <p className="font-body mt-8 text-xl leading-relaxed text-slate-700 sm:text-2xl">
              <Typewriter text={t.about.standfirst} />
            </p>

            {/* body */}
            <div className="mt-8 max-w-prose space-y-6 text-[16px] leading-[1.85] text-slate-700">
              <p className="drop-cap">{t.about.body[0]}</p>
              <p>{t.about.body[1]}</p>
              <p>{t.about.body[2]}</p>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <span className="h-px flex-1 bg-[var(--line)]" />
              <Sparkle className="h-4 w-4 text-[color:var(--santa-fe)]" />
              <span className="h-px flex-1 bg-[var(--line)]" />
            </div>
          </article>

          {/* portrait + fact rail */}
          <aside className="lg:col-span-5">
            <div className="space-y-10">
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

                <div className="glass animate-float absolute -left-4 -top-4 rounded-2xl px-4 py-2.5">
                  <p className="font-display text-xs font-bold text-[color:var(--santa-fe)]">
                    Flutter · Next.js
                  </p>
                </div>
                <div className="glass absolute -bottom-5 -right-4 rounded-2xl px-4 py-3">
                  <p className="font-display text-sm font-bold text-[color:var(--rebel)]">
                    {profile.shortName}
                  </p>
                  <p className="font-body text-xs text-slate-500">{t.availability}</p>
                </div>

                {/* draggable polaroid */}
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
                    {t.about.dragMe}
                  </figcaption>
                </motion.div>
              </figure>

              {/* fact file */}
              <div data-reveal className="glass-news rounded-3xl p-7">
                <h4 className="font-serif mb-4 border-b border-[var(--line)] pb-3 text-lg font-black uppercase tracking-tight text-[color:var(--rebel)]">
                  {t.about.factFile}
                </h4>
                <dl className="divide-y divide-[var(--line)] text-sm">
                  {[
                    { icon: MapPin, k: t.about.labels.based, v: profile.location },
                    { icon: Briefcase, k: t.about.labels.role, v: t.hero.role },
                    { icon: Star, k: t.about.labels.focus, v: 'Flutter · Next.js · Laravel' },
                    { icon: Star, k: t.about.labels.experience, v: t.about.experienceValue },
                    { icon: Star, k: t.about.labels.status, v: t.availability },
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

        {/* ===== PULL QUOTE ===== */}
        <blockquote data-reveal className="relative mx-auto mt-24 max-w-3xl text-center">
          <span aria-hidden className="font-serif block text-7xl leading-none text-[color:var(--santa-fe)] opacity-40">
            &ldquo;
          </span>
          <p className="font-serif -mt-4 text-[clamp(22px,3.2vw,36px)] font-bold italic leading-snug text-[color:var(--rebel)]">
            {t.about.pullQuote}
          </p>
          <footer className="font-body mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            — {profile.shortName}
          </footer>
        </blockquote>

        {/* ===== DAILY TOOLS ===== */}
        <div data-reveal className="glass-news mt-20 rounded-3xl p-7 sm:p-9">
          <p className="font-body mb-6 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-[color:var(--santa-fe)]">
            {t.about.dailyTools}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-6">
            {tools.map((tool) => (
              <div
                key={tool}
                className="flex w-16 flex-col items-center gap-2 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <TechIcon name={tool} size={34} className="transition-transform duration-300 hover:scale-110" />
                <span className="font-body text-center text-[10px] leading-tight text-slate-500">{tool}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CAREER DISPATCHES ===== */}
        <div className="mt-24">
          <div data-reveal className="mb-10 flex items-center gap-4">
            <h4 className="font-serif text-2xl font-black uppercase tracking-tight text-[color:var(--rebel)]">
              {t.about.recentDispatches}
            </h4>
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <div data-reveal-stagger className="grid gap-6 sm:grid-cols-3">
            {experience.slice(0, 3).map((exp, i) => (
              <article key={`${exp.company}-${i}`} data-stagger-item className="glass-news flex flex-col rounded-3xl p-7">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--cardinal)]">
                    {t.about.kickers[i] ?? 'Notes'}
                  </span>
                  <span className="font-body text-[11px] font-semibold text-slate-400">{exp.period}</span>
                </div>
                <h5 className="font-serif text-xl font-black leading-tight text-[color:var(--rebel)]">
                  {t.exp[i]?.role ?? exp.role}
                </h5>
                <p className="font-body mt-0.5 text-sm font-semibold text-[color:var(--santa-fe)]">{exp.company}</p>
                <p className="font-body mt-3 text-sm leading-relaxed text-slate-600">
                  {t.exp[i]?.description ?? exp.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* ===== STAT STRIP ===== */}
        <div data-reveal-stagger className="mt-16 grid grid-cols-3 gap-6">
          {[
            { target: profile.yearsExperience, suffix: '+', label: t.about.statYears },
            { target: stats.projectsCompleted, suffix: '+', label: t.about.statProjects },
            { target: stats.technologiesMastered, suffix: '+', label: t.about.statTech },
          ].map((s) => (
            <div key={s.label} data-stagger-item className="glass-news rounded-3xl px-4 py-7 text-center">
              <div className="text-gradient font-display text-4xl font-black sm:text-5xl">
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </div>
              <div className="font-body mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
