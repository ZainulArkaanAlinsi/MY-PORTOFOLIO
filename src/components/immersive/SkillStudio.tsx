'use client';

import { useState } from 'react';
import { Layers, Server, Smartphone } from 'lucide-react';
import { skillGroups } from '@/data/portfolio';
import TechIcon from './TechIcon';
import { useT } from '@/i18n/provider';

const RADIUS = 46;
const CIRC = 2 * Math.PI * RADIUS;
const ICONS = [Layers, Server, Smartphone];

export default function SkillStudio() {
  const [active, setActive] = useState(0);
  const t = useT();

  const group = skillGroups[active];
  const catLabel = (i: number) => t.skills.categories[i] ?? skillGroups[i].label;
  const items = group.items;
  const top = [...items].sort((a, b) => b.level - a.level)[0];

  return (
    <div className="relative">
      {/* soft studio glows */}
      <div className="glow-orb left-[12%] top-[6%] h-72 w-72 bg-blue-300/40" />
      <div className="glow-orb bottom-[4%] right-[12%] h-80 w-80 bg-cyan-200/50" />

      <div className="relative flex flex-col items-center justify-center gap-12 lg:flex-row lg:items-end lg:gap-0">
        {/* ===== LAPTOP ===== */}
        <div className="w-[min(560px,92vw)]">
          <div className="dev-screen">
            <span className="dev-cam" />
            <div className="flex flex-col bg-[var(--surface)] p-5 text-slate-800 sm:p-6">
              {/* window bar */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--santa-fe)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--deco)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--cardinal)]" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
                  toolkit.app
                </span>
              </div>

              {/* tabs */}
              <div className="mb-5 flex flex-wrap gap-2">
                {skillGroups.map((g, i) => {
                  const Icon = ICONS[i] ?? Layers;
                  const on = i === active;
                  return (
                    <button
                      key={g.label}
                      onClick={() => setActive(i)}
                      data-cursor="hover"
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        on
                          ? 'bg-[color:var(--santa-fe)] text-white'
                          : 'text-slate-500 hover:bg-[rgba(173,115,78,0.08)] hover:text-[color:var(--santa-fe)]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {catLabel(i)}
                    </button>
                  );
                })}
              </div>

              {/* skill bars */}
              <div key={active} className="grid grid-cols-2 gap-x-5 gap-y-4">
                {items.map((s, i) => (
                  <div key={s.name} className="animate-mock-in" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[13px] font-bold text-[color:var(--rebel)]">
                        <TechIcon name={s.name} size={16} />
                        {s.name}
                      </span>
                      <span className="font-mono text-[11px] text-[color:var(--cardinal)]">{s.level}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[rgba(69,29,7,0.1)]">
                      <div
                        className="animate-grow-bar h-full rounded-full bg-linear-to-r from-[#ad734e] to-[#dbd294]"
                        style={{ width: `${s.level}%`, animationDelay: `${0.15 + i * 0.05}s` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* footer */}
              <div className="mt-5 flex items-center justify-between border-t border-[rgba(69,29,7,0.08)] pt-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
                  {catLabel(active)} · {t.skills.operational}
                </span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
              </div>
            </div>
          </div>
          <div className="dev-deck mx-auto" />
        </div>

        {/* ===== PHONE (companion) ===== */}
        <div className="dev-phone z-20 w-[176px] shrink-0 lg:-ml-16 lg:mb-10">
          <span className="dev-island" />
          <div
            className="flex flex-col px-4 pb-5 pt-9 text-white"
            style={{ background: 'linear-gradient(165deg, #ad734e, #6d4730 65%, #451d07)' }}
          >
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-white/55">
              {catLabel(active)}
            </p>
            <p className="font-display mb-4 text-sm font-bold">{t.skills.spotlight}</p>

            <div key={active} className="animate-mock-in flex flex-col items-center">
              {/* brand logo badge */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
                <TechIcon name={top.name} size={30} />
              </div>
              {/* mini ring */}
              <div className="relative h-28 w-28">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="9" />
                  <circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    fill="none"
                    stroke="#f5ebe2"
                    strokeWidth="9"
                    strokeLinecap="round"
                    className="animate-ring"
                    style={{
                      strokeDasharray: CIRC,
                      strokeDashoffset: 'var(--target)',
                      ['--circ' as string]: `${CIRC}`,
                      ['--target' as string]: `${CIRC * (1 - top.level / 100)}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-2xl font-black">{top.level}%</span>
                </div>
              </div>

              <p className="font-display mt-4 text-lg font-bold leading-tight">{top.name}</p>
              <p className="font-body text-[11px] text-white/60">{t.skills.topSkill}</p>

              <div className="mt-5 w-full rounded-2xl border border-white/15 bg-white/10 p-3 text-center">
                <p className="font-body text-[9px] uppercase tracking-[0.2em] text-white/55">{t.skills.toolsTracked}</p>
                <p className="font-display text-lg font-bold">{items.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
