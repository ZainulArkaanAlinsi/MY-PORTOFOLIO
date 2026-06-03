'use client';

import { useEffect, useRef, useState } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

/**
 * Decodes from random glyphs into the final text when it scrolls into view.
 * Respects reduced-motion: shows the final text immediately.
 */
export default function ScrambleText({
  text,
  className = '',
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  as?: 'span' | 'p' | 'div';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // initial state is already the final text, so reduced-motion = no-op
    if (reduced) return;

    let raf = 0;
    let started = false;

    const run = () => {
      const total = 28; // frames to fully resolve
      let frame = 0;
      const tick = () => {
        const progress = frame / total;
        const revealed = Math.floor(progress * text.length);
        let s = '';
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') s += ' ';
          else if (i < revealed) s += text[i];
          else s += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setOut(s);
        frame++;
        if (frame <= total) raf = requestAnimationFrame(tick);
        else setOut(text);
      };
      tick();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <Tag ref={ref as React.Ref<never>} className={`scramble ${className}`}>
      {out}
    </Tag>
  );
}
