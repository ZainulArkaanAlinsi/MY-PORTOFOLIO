'use client';

import * as React from 'react';
import { Zap, Code2 } from 'lucide-react';

export type Skill = {
  name: string;
  value: number; // 0-100
};

export type SkillCategory = {
  id: string;
  title: string;
  colorFrom: string;
  colorTo: string;
  skills: Skill[];
};

const TOOLS = [
  { name: 'Next.js', color: 'from-neutral-800 to-neutral-800' },
  { name: 'React', color: 'from-sky-500 to-sky-500' },
  { name: 'TypeScript', color: 'from-blue-700 to-blue-700' },
  { name: 'Tailwind CSS', color: 'from-cyan-400 to-cyan-400' },
  { name: 'Laravel', color: 'from-rose-500 to-rose-500' },
  { name: 'PHP', color: 'from-indigo-500 to-indigo-500' },
  { name: 'Flutter', color: 'from-blue-500 to-blue-500' },
  { name: 'Dart', color: 'from-cyan-500 to-cyan-500' },
  { name: 'Firebase', color: 'from-amber-500 to-amber-500' },
  { name: 'Node.js', color: 'from-emerald-500 to-emerald-500' },
  { name: 'Git', color: 'from-orange-500 to-orange-500' },
  { name: 'Figma', color: 'from-pink-500 to-pink-500' },
];

const CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    colorFrom: 'from-blue-800',
    colorTo: 'to-cyan-500',
    skills: [
      { name: 'Next.js', value: 95 },
      { name: 'React', value: 88 },
      { name: 'TypeScript', value: 85 },
      { name: 'Tailwind CSS', value: 92 },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    colorFrom: 'from-rose-800',
    colorTo: 'to-amber-500',
    skills: [
      { name: 'Laravel', value: 86 },
      { name: 'PHP', value: 84 },
      { name: 'Node.js', value: 72 },
      { name: 'REST APIs', value: 80 },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile & Cloud',
    colorFrom: 'from-purple-800',
    colorTo: 'to-violet-500',
    skills: [
      { name: 'Flutter', value: 80 },
      { name: 'Dart', value: 78 },
      { name: 'Firebase', value: 75 },
      { name: 'Supabase', value: 65 },
    ],
  },
];

export default function SkillsGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Tools grid */}
      <h3 className="flex items-center gap-3 text-sm font-semibold mb-6">
        <span className="inline-block w-8 h-8 rounded-lg bg-amber-800/30 flex items-center justify-center">
          <Zap className="w-4 h-4 text-amber-300" />
        </span>
        TOOLS I USE DAILY
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
        {TOOLS.map((t) => (
          <div key={t.name} className="rounded-xl p-4 bg-gradient-to-br from-white/2 to-transparent border border-white/6 shadow-inner flex items-center justify-center">
            <div className="w-full text-center py-6 rounded-lg" style={{ background: 'transparent' }}>
              <div className="text-xs font-semibold tracking-wider text-white/90">{t.name.toUpperCase()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Skill cards */}
      <h3 className="flex items-center gap-3 text-sm font-semibold mb-6 mt-8">
        <span className="inline-block w-8 h-8 rounded-lg bg-sky-800/20 flex items-center justify-center">
          <Code2 className="w-4 h-4 text-sky-300" />
        </span>
        SKILLS
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <article key={cat.id} className="rounded-2xl p-6 bg-gradient-to-br from-white/2 to-transparent border border-white/6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.colorFrom} ${cat.colorTo} flex items-center justify-center text-white`}></div>
                <div>
                  <h4 className="text-sm font-bold tracking-wider">{cat.title.toUpperCase()}</h4>
                  <div className="text-xs text-white/60 mt-1">{cat.skills.length} skills</div>
                </div>
              </div>
              <div className="text-xs text-white/60 font-mono"> </div>
            </div>

            <div className="space-y-4">
              {cat.skills.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-white">{s.name}</div>
                    <div className="text-xs text-white/60">{s.value}%</div>
                  </div>

                  <div className="relative h-2 bg-white/6 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500`}
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </article>
        ))}
      </div>

    </section>
  );
}
