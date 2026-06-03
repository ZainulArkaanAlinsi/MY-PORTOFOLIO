'use client';

// A browser-framed preview of a GitHub repo using its live OpenGraph card
// image — gives every project a real visual without needing local assets.
// If the image can't load (private/renamed repo, rate limit), it falls back
// to a branded panel instead of a broken-image icon.

import { useState } from 'react';

function ownerRepo(url: string): { owner: string; repo: string } | null {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

export default function RepoShot({
  url,
  className = '',
  imgClassName = 'aspect-[2/1]',
}: {
  url: string;
  className?: string;
  imgClassName?: string;
}) {
  const or = ownerRepo(url);
  const src = or ? `https://opengraph.githubassets.com/1/${or.owner}/${or.repo}` : null;
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[rgba(69,29,7,0.14)] bg-white shadow-[0_24px_50px_-30px_rgba(69,29,7,0.5)] ${className}`}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-[rgba(69,29,7,0.1)] bg-[var(--surface-2)] px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--santa-fe)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--deco)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--cardinal)]" />
        <span className="ml-3 truncate rounded-md bg-white/70 px-2 py-0.5 font-mono text-[10px] text-slate-400">
          {or ? `github.com/${or.owner}/${or.repo}` : 'preview'}
        </span>
      </div>

      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={or ? `${or.repo} repository preview` : ''}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`w-full bg-[var(--surface-2)] object-cover ${imgClassName}`}
        />
      ) : (
        <div
          className={`flex w-full items-center justify-center bg-linear-to-br from-[var(--surface-2)] to-[var(--merino)] ${imgClassName}`}
        >
          <span className="px-6 text-center font-display text-base font-bold capitalize tracking-tight text-[color:var(--rebel)] sm:text-lg">
            {or ? or.repo.replace(/[-_]/g, ' ') : 'Project preview'}
          </span>
        </div>
      )}
    </div>
  );
}
