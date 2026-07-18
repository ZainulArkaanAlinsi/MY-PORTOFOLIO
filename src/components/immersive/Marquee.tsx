'use client';

import { profile } from '@/data/portfolio';
import { useT } from '@/i18n/provider';

/**
 * Breaking-news ticker — on-theme with "The Developer Times". A sticky live
 * tag on the left, then a dark espresso strip scrolling status headlines
 * (availability, location, current stack). Replaces the old tool-pill marquee;
 * the tools now live in the interactive 3D sphere in the About section.
 */
export default function Marquee() {
  const t = useT();
  const items = [
    t.availability,
    `${t.about.labels.based} ${profile.location}`,
    'Next.js · Laravel · Flutter',
    `${profile.yearsExperience}+ ${t.statsBand.years}`,
    "Portfolio '26",
  ];
  const unit = [...items, ...items];
  const run = [...unit, ...unit];

  return (
    <section
      aria-hidden="true"
      className="relative flex items-stretch overflow-hidden border-y border-[rgba(255,255,255,0.06)] bg-[linear-gradient(90deg,#1d1008,#3a2418)] text-[color:var(--merino)]"
    >
      {/* sticky live tag */}
      <span className="relative z-10 flex shrink-0 items-center gap-2 bg-[color:var(--cardinal)] px-4 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-white sm:px-5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        {t.contact.available}
      </span>

      {/* scrolling headlines */}
      <div className="marquee-fade relative flex-1 overflow-hidden py-3.5">
        <div className="flex w-max animate-marquee-left">
          {run.map((item, i) => (
            <span
              key={i}
              className="mx-6 inline-flex items-center gap-6 whitespace-nowrap font-body text-sm font-semibold uppercase tracking-[0.14em] text-[rgba(245,235,226,0.85)]"
            >
              {item}
              <span className="text-[color:var(--santa-fe)]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
