'use client';

import { Fragment } from 'react';

/**
 * Accessible text splitter for per-character GSAP reveals.
 *
 * Renders each word as an inline-block mask (`.split-word`, overflow hidden)
 * containing per-character spans (`.split-char`) that a GSAP timeline can rise
 * from behind the mask. The real string is exposed via `aria-label` while the
 * fragmented spans are `aria-hidden`, so screen readers / SEO read the word,
 * not the letters. With no JS / reduced motion the chars simply sit at rest and
 * look like normal text.
 */
export default function SplitText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="split-word" aria-hidden="true">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className="split-char">
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  );
}
