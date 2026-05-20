"use client";

import React, { useRef, useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const startTime = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}