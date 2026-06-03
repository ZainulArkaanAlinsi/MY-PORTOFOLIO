'use client';

import * as React from 'react';
import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Star, GitFork } from 'lucide-react';
import type { Project } from '@/lib/github';

type CategoryDef = {
  id: string;
  label: string;
  accent: string;
  blurb: string;
};

const CATEGORIES: CategoryDef[] = [
  { id: 'mobile', label: 'Mobile & Apps', accent: '#3b82f6', blurb: 'Flutter & cross-platform apps' },
  { id: 'web', label: 'Web & Interactive', accent: '#8b5cf6', blurb: 'Next.js, Laravel & the web' },
  { id: 'colorful', label: 'Colorful', accent: '#ec4899', blurb: 'Bold color & visual systems' },
  { id: '360', label: '360°', accent: '#10b981', blurb: 'Panoramic & spatial scenes' },
  { id: '3d', label: '3D', accent: '#f59e0b', blurb: 'WebGL & real-time 3D' },
  { id: 'interaction', label: 'Interaction Design', accent: '#0ea5e9', blurb: 'Motion & micro-interactions' },
  { id: 'ui', label: 'UI Design', accent: '#06b6d4', blurb: 'Interfaces & design detail' },
];

function categorize(p: Project): string {
  const blob = `${p.name} ${p.description ?? ''} ${(p.topics ?? []).join(' ')} ${p.language ?? ''}`.toLowerCase();
  if (/(dart|flutter|android|ios|mobile|kotlin|swift|attendance|absensi|\bapp\b)/.test(blob)) return 'mobile';
  if (/(three|webgl|r3f|react-three|\b3d\b)/.test(blob)) return '3d';
  if (/(360|panorama|\bvr\b|aframe|spatial)/.test(blob)) return '360';
  if (/(gsap|framer|lottie|animation|motion|interactive|interaction|scroll|parallax)/.test(blob)) return 'interaction';
  if (/(figma|design-system|design system|ui-kit|ui kit|component|\bui\b|landing|portfolio)/.test(blob)) return 'ui';
  if (/(color|colour|palette|gradient|\btheme\b)/.test(blob)) return 'colorful';
  return 'web';
}

function ownerRepo(htmlUrl: string): { owner: string; repo: string } | null {
  try {
    const parts = new URL(htmlUrl).pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

function previewImage(p: Project): string | null {
  const or = ownerRepo(p.htmlUrl);
  if (!or) return null;
  // GitHub's open-graph social preview — looks polished, always available.
  return `https://opengraph.githubassets.com/og/${or.owner}/${or.repo}`;
}

export default function WorkShowcase({ projects }: { projects: Project[] }) {
  const reduceMotion = useReducedMotion();

  const grouped = useMemo(() => {
    const map: Record<string, Project[]> = {};
    for (const c of CATEGORIES) map[c.id] = [];
    for (const p of projects) map[categorize(p)].push(p);
    return map;
  }, [projects]);

  // default to the category with the most work
  const defaultActive = useMemo(() => {
    let best = CATEGORIES[0].id;
    let max = -1;
    for (const c of CATEGORIES) {
      if (grouped[c.id].length > max) {
        max = grouped[c.id].length;
        best = c.id;
      }
    }
    return best;
  }, [grouped]);

  const [active, setActive] = useState<string>(defaultActive);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!previewRef.current) return;
    previewRef.current.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 120}px)`;
  };

  const hoveredCat = CATEGORIES.find((c) => c.id === hovered) ?? null;
  const hoveredProject = hovered ? grouped[hovered][0] ?? null : null;
  const hoveredImg = hoveredProject ? previewImage(hoveredProject) : null;

  const activeCat = CATEGORIES.find((c) => c.id === active)!;
  const activeProjects = grouped[active];

  return (
    <div className="relative" onMouseMove={onMouseMove}>
      {/* Floating cursor preview (fine-pointer only) */}
      {!reduceMotion && (
        <div
          ref={previewRef}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
          style={{ willChange: 'transform' }}
        >
          <AnimatePresence>
            {showPreview && hoveredCat && (
              <motion.div
                key={hoveredCat.id}
                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="h-44 w-72 overflow-hidden rounded-xl border border-white/15 shadow-2xl"
                style={{ boxShadow: `0 20px 60px ${hoveredCat.accent}55` }}
              >
                {hoveredImg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hoveredImg}
                    alt={hoveredProject?.name ?? hoveredCat.label}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-center"
                    style={{
                      background: `linear-gradient(135deg, ${hoveredCat.accent}, #0b1120)`,
                    }}
                  >
                    <span className="px-4 text-sm font-semibold text-white/90">
                      {hoveredCat.label}
                      <br />
                      <span className="text-xs font-normal text-white/60">
                        New work in progress
                      </span>
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ===== Big-type category menu ===== */}
      <ul
        className="border-t border-white/10"
        onMouseLeave={() => {
          setHovered(null);
          setShowPreview(false);
        }}
      >
        {CATEGORIES.map((cat, i) => {
          const count = grouped[cat.id].length;
          const isActive = active === cat.id;
          const isHovered = hovered === cat.id;
          return (
            <li key={cat.id} className="border-b border-white/10">
              <button
                onClick={() => setActive(cat.id)}
                onMouseEnter={() => {
                  setHovered(cat.id);
                  setShowPreview(true);
                }}
                className="group flex w-full items-center gap-4 py-5 text-left transition-colors sm:py-6"
              >
                <span
                  className="w-8 shrink-0 font-mono text-xs font-bold tabular-nums transition-colors"
                  style={{ color: isHovered || isActive ? cat.accent : 'rgba(255,255,255,0.3)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="relative flex-1 overflow-hidden">
                  <span
                    className="block text-2xl font-black tracking-tight transition-all duration-300 sm:text-4xl lg:text-5xl"
                    style={{
                      color: isHovered || isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                      transform: isHovered ? 'translateX(12px)' : 'translateX(0)',
                    }}
                  >
                    {cat.label}
                  </span>
                </span>

                <span className="hidden text-right sm:block">
                  <span className="block text-[11px] uppercase tracking-wider text-zinc-500">
                    {cat.blurb}
                  </span>
                </span>

                <span
                  className="ml-2 flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-2 text-xs font-bold tabular-nums transition-colors"
                  style={{
                    color: isHovered || isActive ? '#0b1120' : 'rgba(255,255,255,0.6)',
                    backgroundColor: isHovered || isActive ? cat.accent : 'rgba(255,255,255,0.08)',
                  }}
                >
                  {count}
                </span>

                <ArrowUpRight
                  className="h-5 w-5 shrink-0 transition-all duration-300"
                  style={{
                    color: isHovered || isActive ? cat.accent : 'rgba(255,255,255,0.3)',
                    transform: isHovered ? 'translate(4px,-4px)' : 'none',
                  }}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* ===== Selected category's work ===== */}
      <div className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeCat.accent }} />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            {activeCat.label}
          </h3>
          <span className="text-xs text-zinc-500">
            {activeProjects.length} {activeProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {activeProjects.length === 0 ? (
              <div
                className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-14 text-center"
                style={{ background: `linear-gradient(135deg, ${activeCat.accent}10, transparent)` }}
              >
                <p className="text-base font-semibold text-white">
                  {activeCat.label} — coming soon
                </p>
                <p className="mt-1 max-w-sm text-sm text-zinc-400">
                  New work in this area is in progress. Check back soon.
                </p>
              </div>
            ) : (
              activeProjects.map((project) => (
                <a
                  key={project.id}
                  href={project.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5 transition-colors hover:border-white/25"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-px opacity-50 transition-opacity group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, ${activeCat.accent}, transparent)` }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                      {project.language || 'Code'}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                      {project.stars > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {project.stars}
                        </span>
                      )}
                      {project.forks > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {project.forks}
                        </span>
                      )}
                    </div>
                  </div>
                  <h4 className="mt-3 text-base font-bold capitalize leading-snug text-white transition-colors group-hover:text-white">
                    {project.name.replace(/[-_]/g, ' ')}
                  </h4>
                  <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-400">
                    {project.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      View on GitHub
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-zinc-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </div>
                </a>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
