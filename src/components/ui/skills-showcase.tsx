'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Code2, Database, Smartphone, Zap, Package, Layers, LucideIcon } from 'lucide-react';

// =========================================
// 1. CONFIGURATION & DATA TYPES
// =========================================

export type SkillCategoryId = 'frontend' | 'backend' | 'mobile';

export interface SkillMetric {
  name: string;
  value: number; // 0-100 (proficiency)
  icon: LucideIcon;
  tags?: string[];
}

export interface SkillCategory {
  id: SkillCategoryId;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  colors: {
    gradient: string;
    glow: string;
    ring: string;
    text: string;
  };
  skills: SkillMetric[];
}

// Default Data (Easy to Modify Here)
const SKILL_DATA: Record<SkillCategoryId, SkillCategory> = {
  frontend: {
    id: 'frontend',
    label: 'Frontend',
    title: 'Frontend Development',
    description: 'Crafting beautiful, interactive user interfaces with modern frameworks. Specializing in React, Next.js, and Tailwind CSS for responsive, performant web applications.',
    icon: Code2,
    colors: {
      gradient: 'from-blue-600 to-indigo-900',
      glow: 'bg-blue-500',
      ring: 'border-l-blue-500/50',
      text: 'text-blue-400',
    },
    skills: [
      { name: 'React / Next.js', value: 95, icon: Zap, tags: ['UI', 'SSR', 'Performance'] },
      { name: 'TypeScript', value: 92, icon: Code2, tags: ['Type Safety', 'Best Practices'] },
      { name: 'Tailwind CSS', value: 94, icon: Package, tags: ['Styling', 'Responsive'] },
      { name: 'Framer Motion', value: 88, icon: Layers, tags: ['Animations', 'Interactions'] },
      { name: 'State Management', value: 90, icon: Database, tags: ['Redux', 'Context'] },
    ],
  },
  backend: {
    id: 'backend',
    label: 'Backend',
    title: 'Backend Development',
    description: 'Building robust server-side applications with scalable architecture. Expert in Node.js, Laravel, and database design with focus on security and performance.',
    icon: Database,
    colors: {
      gradient: 'from-emerald-600 to-teal-900',
      glow: 'bg-emerald-500',
      ring: 'border-r-emerald-500/50',
      text: 'text-emerald-400',
    },
    skills: [
      { name: 'Node.js / Express', value: 91, icon: Zap, tags: ['APIs', 'Middleware'] },
      { name: 'Laravel / PHP', value: 89, icon: Package, tags: ['MVC', 'Eloquent'] },
      { name: 'Database Design', value: 93, icon: Database, tags: ['SQL', 'MongoDB'] },
      { name: 'RESTful APIs', value: 94, icon: Layers, tags: ['Design', 'Documentation'] },
      { name: 'Authentication & Security', value: 90, icon: Code2, tags: ['JWT', 'OAuth'] },
    ],
  },
  mobile: {
    id: 'mobile',
    label: 'Mobile',
    title: 'Mobile App Development',
    description: 'Creating native and cross-platform mobile applications. Proficient in Flutter for iOS and Android with strong performance optimization and UX principles.',
    icon: Smartphone,
    colors: {
      gradient: 'from-pink-600 to-rose-900',
      glow: 'bg-pink-500',
      ring: 'border-b-pink-500/50',
      text: 'text-pink-400',
    },
    skills: [
      { name: 'Flutter / Dart', value: 88, icon: Zap, tags: ['Cross-platform', 'Native'] },
      { name: 'State Management', value: 86, icon: Layers, tags: ['Provider', 'Riverpod'] },
      { name: 'Firebase Integration', value: 87, icon: Package, tags: ['Auth', 'Realtime'] },
      { name: 'API Integration', value: 91, icon: Database, tags: ['REST', 'WebSocket'] },
      { name: 'UI/UX Implementation', value: 89, icon: Code2, tags: ['Responsive', 'Animations'] },
    ],
  },
};

// =========================================
// 2. ANIMATION VARIANTS
// =========================================

/* Animations removed (inline motion props used in compact layout) */

// =========================================
// 3. SUB-COMPONENTS
// =========================================

const BackgroundGradient = ({ isLeft }: { isLeft: boolean }) => (
  <div className="fixed inset-0 pointer-events-none">
    <motion.div
      animate={{
        background: isLeft
          ? 'radial-gradient(circle at 0% 50%, rgba(59, 130, 246, 0.12), transparent 50%)'
          : 'radial-gradient(circle at 100% 50%, rgba(16, 185, 129, 0.12), transparent 50%)',
      }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    />
  </div>
);

/* SkillIcon and SkillDetails removed — replaced with compact inline rendering below */

const CategorySwitcher = ({
  activeId,
  onToggle,
}: {
  activeId: SkillCategoryId;
  onToggle: (id: SkillCategoryId) => void;
}) => {
  const options = Object.values(SKILL_DATA).map((p) => ({
    id: p.id,
    label: p.label,
  }));

  return (
    <div className="fixed bottom-12 inset-x-0 flex justify-center z-50 pointer-events-none">
      <motion.div layout className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            whileTap={{ scale: 0.96 }}
            className="relative w-24 h-12 rounded-full flex items-center justify-center text-sm font-medium focus:outline-none"
          >
            {activeId === opt.id && (
              <motion.div
                layoutId="island-surface"
                className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-white/5 shadow-inner"
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-300 ${
                activeId === opt.id
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {opt.label}
            </span>
            {activeId === opt.id && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-1 h-1 w-6 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

// =========================================
// 4. MAIN COMPONENT
// =========================================

export default function SkillsShowcase() {
  const [activeCategory, setActiveCategory] = useState<SkillCategoryId>('frontend');
  const [showSwitcher, setShowSwitcher] = useState(true);

  const currentData = SKILL_DATA[activeCategory];
  const isLeft = activeCategory === 'frontend';

  // derive a compact tools list from the category skills for badge display
  const tools = Array.from(new Set(currentData.skills.map((s) => s.name.split(/[\/\s,-]+/)[0]))).slice(0, 12);

  useEffect(() => {
    // show the fixed switcher only when #skills is visible in the viewport
    const el = document.getElementById('skills');
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setShowSwitcher(entry.isIntersecting));
      },
      { root: null, threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" className="relative w-full text-zinc-100 px-6 py-16">
      <BackgroundGradient isLeft={isLeft} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-400 font-bold">02.5 — Skills</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{currentData.title}</h2>
            <p className="mt-2 text-zinc-400 max-w-xl">{currentData.description}</p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setActiveCategory('frontend')}
              className={`px-3 py-2 rounded-full text-sm font-semibold ${isLeft ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Frontend
            </button>
            <button
              onClick={() => setActiveCategory('backend')}
              className={`px-3 py-2 rounded-full text-sm font-semibold ${!isLeft ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Backend
            </button>
            <button
              onClick={() => setActiveCategory('mobile')}
              className={`px-3 py-2 rounded-full text-sm font-semibold ${activeCategory === 'mobile' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Mobile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex items-center justify-center">
            <div className={`relative w-56 h-56 rounded-full border border-white/6 ${currentData.colors.ring} overflow-hidden flex items-center justify-center`}> 
              <div className={`absolute -inset-8 rounded-full bg-gradient-to-br ${currentData.colors.gradient} blur-2xl opacity-36`} />
              <div className={`w-40 h-40 rounded-full overflow-hidden bg-white/3 flex items-center justify-center text-black font-bold`}> 
                {/* use local asset if available */}
                <Image src={`/assets/${currentData.id}.svg`} alt={currentData.label} width={160} height={160} className="object-cover" />
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              {currentData.skills.map((skill, i) => (
                <motion.div key={skill.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-white/3 rounded-2xl p-4 border border-white/6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/6 flex items-center justify-center text-white">
                        {skill.icon ? <skill.icon size={16} /> : <Zap size={16} />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{skill.name}</div>
                        <div className="text-xs text-zinc-400">Proficiency</div>
                      </div>
                    </div>
                    <div className="text-sm font-mono text-zinc-300">{skill.value}%</div>
                  </div>

                  <div className="relative mt-3 h-2 w-full bg-white/6 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${skill.value}%` }} transition={{ duration: 0.9, delay: 0.12 + i * 0.05 }} className={`absolute top-0 bottom-0 left-0 ${currentData.id === 'frontend' ? 'bg-gradient-to-r from-sky-400 to-cyan-400' : currentData.id === 'backend' ? 'bg-gradient-to-r from-rose-400 to-orange-400' : 'bg-gradient-to-r from-pink-400 to-rose-400'}`} />
                  </div>
                </motion.div>
              ))}

              {/* tools badges */}
              <div className="pt-3">
                <div className="text-xs text-zinc-400 mb-2 font-semibold">Tools & libraries</div>
                <div className="flex flex-wrap gap-2">
                  {tools.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/6 text-zinc-200">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSwitcher && <CategorySwitcher activeId={activeCategory} onToggle={setActiveCategory} />}
    </section>
  );
}
