"use client";

import React, { useRef, useEffect, useState } from "react";

interface StatsTrackerProps {
  hoursCoding: number;
  projectsCompleted: number;
  technologiesMastered: number;
  /** Additional metrics from GitHub, e.g. total repos, stars */
  totalRepos?: number;
  totalStars?: number;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, duration / (target / step));
    return () => clearInterval(interval);
  }, [started, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsTracker({
  hoursCoding,
  projectsCompleted,
  technologiesMastered,
  totalRepos,
  totalStars,
}: StatsTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: "Hours Coding", value: hoursCoding, suffix: "+" },
    { label: "Projects Completed", value: projectsCompleted, suffix: "" },
    { label: "Technologies", value: technologiesMastered, suffix: "" },
    ...(totalRepos !== undefined ? [{ label: "GitHub Repos", value: totalRepos, suffix: "" }] : []),
    ...(totalStars !== undefined ? [{ label: "Total Stars", value: totalStars, suffix: "" }] : []),
  ];

  return (
    <div
      ref={containerRef}
      className={`w-full transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/5 bg-white/2 p-4 flex flex-col hover:border-blue-400/30 hover:bg-white/4 transition-colors"
          >
            <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </span>
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-1.5">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}