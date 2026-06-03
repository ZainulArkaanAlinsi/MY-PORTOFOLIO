import React from 'react';
import SkillsGrid from '@/components/ui/skills-grid';

export const metadata = {
  title: 'Skills — Demo',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-neutral-900 to-black text-white">
      <div className="pt-24 pb-40">
        <SkillsGrid />
      </div>
    </main>
  );
}
