'use client';

import { useEffect, useState } from 'react';
import { MapPin, Briefcase, Star, Sparkle, Clock, Rocket, Layers } from 'lucide-react';
import { profile, stats } from '@/data/portfolio';
import AnimatedCounter from '@/components/AnimatedCounter';
import Typewriter from './Typewriter';
import LanyardCard from './LanyardCard';
import ToolSphere from './ToolSphere';
import { useApp } from '@/i18n/provider';

const DATE_LOCALE: Record<string, string> = { id: 'id-ID', en: 'en-GB', ar: 'ar' };

export default function AboutNewspaper() {
  const { t, lang } = useApp();
  // Live "edition" dateline + clock. Both are client-only and both are pinned
  // to Asia/Jakarta (this is the Bekasi edition). Client-only matters twice
  // over: the server runs on UTC, and the page is now ISR-cached for an hour,
  // so a date baked into the HTML could be served after midnight WIB and
  // disagree with the reader's own clock.
  const [today, setToday] = useState('');
  const [time, setTime] = useState('');
  useEffect(() => {
    const locale = DATE_LOCALE[lang] ?? 'en-GB';
    const tick = () => {
      const now = new Date();
      setToday(
        now.toLocaleDateString(locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Jakarta',
        })
      );
      setTime(
        now.toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Jakarta',
        })
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [lang]);

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
            <span className="tabular-nums">
              {today}
              {time && <span className="text-[color:var(--santa-fe)]"> · {time}</span>}
            </span>
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

          {/* lanyard ID card + fact rail */}
          <aside className="lg:col-span-5">
            <div className="space-y-10">
              <div data-reveal>
                <LanyardCard
                  photo={profile.avatar}
                  name={profile.name.split(' ')[0]}
                  lastName={profile.name.split(' ').slice(1).join(' ')}
                  role={t.hero.role}
                  brand={profile.handle}
                  dragHint={t.about.dragMe}
                />
              </div>

              {/* fact file */}
              <div data-reveal data-spotlight className="glass-news spotlight rounded-3xl p-7">
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

        {/* ===== DAILY TOOLS — interactive 3D tool sphere ===== */}
        <div
          data-reveal
          className="relative mt-20 overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.07)] bg-[linear-gradient(160deg,#161c25,#0a0d12)] p-7 text-center shadow-[0_40px_70px_-40px_rgba(25,35,51,0.7)] sm:p-10"
        >
          {/* faint grid + vignette so the tiles read like they float in space */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.13]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(146,176,221,0.55) 1px,transparent 1px),linear-gradient(90deg,rgba(146,176,221,0.55) 1px,transparent 1px)',
              backgroundSize: '42px 42px',
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent,rgba(0,0,0,0.6))]"
          />
          <div className="relative">
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-[color:var(--santa-fe)]">
              {t.about.dailyTools}
            </p>
            <ToolSphere />
            <p className="font-body -mt-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[rgba(230,234,241,0.5)]">
              <span aria-hidden>✦</span> {t.about.dragMe}
            </p>
          </div>
        </div>

        {/* ===== STAT STRIP — editorial counter cards ===== */}
        <div data-reveal-stagger className="mt-16 grid grid-cols-3 gap-3 sm:gap-6">
          {[
            { target: profile.yearsExperience, suffix: '+', label: t.about.statYears, Icon: Clock },
            { target: stats.projectsCompleted, suffix: '+', label: t.about.statProjects, Icon: Rocket },
            { target: stats.technologiesMastered, suffix: '+', label: t.about.statTech, Icon: Layers },
          ].map((s, i) => (
            <div
              key={s.label}
              data-stagger-item
              data-spotlight
              className="stat-card group spotlight relative overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[linear-gradient(160deg,var(--surface),var(--surface-2))] px-3 py-5 shadow-[0_20px_44px_-26px_rgba(25,35,51,0.45)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_54px_-24px_rgba(25,35,51,0.5)] sm:rounded-3xl sm:px-6 sm:py-8"
            >
              {/* oversized ghost numeral */}
              <span
                aria-hidden
                className="font-display pointer-events-none absolute -right-2 -top-7 select-none text-[6.5rem] font-black leading-none text-[rgba(76,116,175,0.07)] sm:-right-3 sm:-top-8 sm:text-[8rem]"
              >
                {i + 1}
              </span>

              {/* icon chip + index */}
              <div className="relative flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[rgba(34,104,210,0.1)] text-[color:var(--cardinal)] transition-colors duration-300 group-hover:bg-[rgba(34,104,210,0.16)] sm:h-11 sm:w-11">
                  <s.Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <span className="font-mono hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400 sm:inline">
                  0{i + 1}<span className="text-slate-300"> / 03</span>
                </span>
              </div>

              {/* animated number */}
              <div className="font-display relative mt-5 text-4xl font-black tabular-nums text-[color:var(--cardinal)] sm:mt-7 sm:text-6xl">
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </div>

              {/* accent bar (widens on hover) */}
              <div className="mt-3 h-1 w-9 rounded-full bg-[color:var(--cardinal)] transition-all duration-300 group-hover:w-16" />

              {/* label */}
              <div className="font-body relative mt-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-[color:var(--muted)] sm:text-[11px] sm:tracking-[0.2em]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
