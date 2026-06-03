import Image from 'next/image';
import profile from '../../data/profile.json';

export default function AboutPage() {
  const p = profile.personal;

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="flex flex-col items-center md:items-start">
          <div className="w-40 h-40 rounded-full overflow-hidden border border-white/6">
            <Image src={p.avatar || '/arkan.png'} alt={p.name} width={160} height={160} className="object-cover" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold">{p.name}</h1>
          <div className="text-zinc-400 mt-1">{p.title}</div>
          <div className="text-zinc-400 mt-2 text-sm">{p.location}</div>
        </div>

        <div className="md:col-span-2">
          <div className="prose prose-invert max-w-none">
            <p>{p.profileSummary}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/3 p-4 rounded-lg">
              <div className="text-xs text-zinc-300 font-semibold">Hours Coding</div>
              <div className="text-2xl font-bold">{profile.stats.hoursCoding}</div>
            </div>
            <div className="bg-white/3 p-4 rounded-lg">
              <div className="text-xs text-zinc-300 font-semibold">Projects</div>
              <div className="text-2xl font-bold">{profile.stats.projectsCompleted}</div>
            </div>
            <div className="bg-white/3 p-4 rounded-lg">
              <div className="text-xs text-zinc-300 font-semibold">Technologies</div>
              <div className="text-2xl font-bold">{profile.stats.technologiesMastered}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-zinc-300">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.skills.map((s: string) => (
                <span key={s} className="px-2 py-1 bg-white/5 rounded text-sm text-zinc-200">{s}</span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-zinc-300">Certifications</h3>
            <ul className="mt-2 space-y-2">
              {profile.certifications.map((c: { title: string; year?: string; description?: string }) => (
                <li key={c.title} className="bg-white/3 p-3 rounded">
                  <div className="font-semibold">{c.title} <span className="text-xs text-zinc-400">{c.year}</span></div>
                  <div className="text-sm text-zinc-300">{c.description}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
