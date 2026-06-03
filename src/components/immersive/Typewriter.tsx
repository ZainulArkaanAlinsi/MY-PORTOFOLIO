'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Types out `text` once it scrolls into view. Reduced-motion users get the
 * full string immediately. All setState happens inside timeouts (never
 * synchronously in the effect body) to keep the render path clean.
 */
export default function Typewriter({
  text,
  className = '',
  speed = 38,
  caret = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  caret?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeouts: number[] = [];

    const typeAll = () => {
      if (reduced) {
        timeouts.push(window.setTimeout(() => {
          setOut(text);
          setDone(true);
        }, 0));
        return;
      }
      let i = 0;
      const tick = () => {
        i++;
        setOut(text.slice(0, i));
        if (i < text.length) timeouts.push(window.setTimeout(tick, speed));
        else setDone(true);
      };
      timeouts.push(window.setTimeout(tick, speed));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          typeAll();
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [text, speed]);

  return (
    <span ref={ref} className={className}>
      {out}
      {caret && <span className="tw-caret" style={{ opacity: done ? 0 : 1 }}>|</span>}
    </span>
  );
}
