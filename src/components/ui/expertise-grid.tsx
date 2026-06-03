'use client';

import * as React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  Smartphone,
  Globe,
  Palette,
  Orbit,
  Boxes,
  MousePointerClick,
  LayoutDashboard,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

type Expertise = {
  id: string;
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
  from: string; // tailwind gradient start
  to: string; // tailwind gradient end
  glow: string; // rgba for hover glow
  featured?: boolean;
};

const EXPERTISE: Expertise[] = [
  {
    id: 'mobile',
    index: '01',
    title: 'Mobile & Apps',
    description:
      'Cross-platform apps with Flutter & Firebase — native-grade UX, real-time data, and offline sync, from idea to store.',
    icon: Smartphone,
    from: 'from-blue-500',
    to: 'to-cyan-400',
    glow: 'rgba(59,130,246,0.35)',
    featured: true,
  },
  {
    id: 'web',
    index: '02',
    title: 'Web & Interactive',
    description:
      'Fast, accessible web experiences built with Next.js and modern tooling.',
    icon: Globe,
    from: 'from-violet-500',
    to: 'to-fuchsia-500',
    glow: 'rgba(139,92,246,0.35)',
  },
  {
    id: 'colorful',
    index: '03',
    title: 'Colorful',
    description:
      'Bold, vibrant visual systems with confident color and typography.',
    icon: Palette,
    from: 'from-pink-500',
    to: 'to-rose-400',
    glow: 'rgba(236,72,153,0.35)',
  },
  {
    id: '360',
    index: '04',
    title: '360°',
    description:
      'Immersive 360° scenes and panoramic, spatial storytelling.',
    icon: Orbit,
    from: 'from-emerald-500',
    to: 'to-teal-400',
    glow: 'rgba(16,185,129,0.35)',
  },
  {
    id: '3d',
    index: '05',
    title: '3D',
    description:
      'Real-time 3D and WebGL visuals that bring interfaces to life.',
    icon: Boxes,
    from: 'from-amber-500',
    to: 'to-orange-400',
    glow: 'rgba(245,158,11,0.35)',
  },
  {
    id: 'interaction',
    index: '06',
    title: 'Interaction Design',
    description:
      'Micro-interactions and motion that make every action feel alive.',
    icon: MousePointerClick,
    from: 'from-sky-500',
    to: 'to-indigo-400',
    glow: 'rgba(14,165,233,0.35)',
  },
  {
    id: 'ui',
    index: '07',
    title: 'UI Design',
    description:
      'Pixel-perfect interfaces with clear hierarchy and polished detail.',
    icon: LayoutDashboard,
    from: 'from-cyan-500',
    to: 'to-blue-400',
    glow: 'rgba(6,182,212,0.35)',
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function ExpertiseCard({ item }: { item: Expertise }) {
  const Icon = item.icon;
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{ ['--glow' as string]: item.glow }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 transition-colors duration-300 hover:border-white/20 ${
        item.featured ? 'sm:col-span-2 lg:col-span-2' : ''
      }`}
    >
      {/* hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), var(--glow), transparent 60%)`,
        }}
      />

      {/* top accent line */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${item.from} ${item.to} opacity-40 group-hover:opacity-90 transition-opacity`}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.from} ${item.to} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <span className="text-[11px] font-black tracking-widest text-white/25 tabular-nums">
          {item.index}
        </span>
      </div>

      <h3 className="relative mt-5 text-lg font-bold text-white">
        {item.title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-zinc-400">
        {item.description}
      </p>

      <span className="relative mt-5 inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 transition-colors group-hover:text-white">
        Explore
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </motion.div>
  );
}

export default function ExpertiseGrid() {
  const reduceMotion = useReducedMotion();

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={reduceMotion ? undefined : containerVariants}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      onMouseMove={onMouseMove}
    >
      {EXPERTISE.map((item) => (
        <ExpertiseCard key={item.id} item={item} />
      ))}
    </motion.div>
  );
}
