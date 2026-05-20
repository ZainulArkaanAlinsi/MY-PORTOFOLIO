"use client";

import React, { useRef, useEffect, useState } from "react";

interface LangData {
  name: string;
  percentage: number;
  color: string;
}

interface GitHubLangChartProps {
  languages: LangData[];
  totalRepos?: number;
}

export default function GitHubLangChart({ languages, totalRepos }: GitHubLangChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
          // Trigger staggered bar animation after a small delay
          setTimeout(() => setAnimated(true), 200);
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sort descending
  const sorted = [...languages].sort((a, b) => b.percentage - a.percentage);

  return (
    <div
      ref={containerRef}
      className={`w-full transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-white tracking-tight">
          Languages
        </h3>
        {totalRepos !== undefined && (
          <span className="text-[11px] font-medium text-zinc-500">
            {totalRepos} repos
          </span>
        )}
      </div>

      {/* Animated bar chart */}
      <div className="flex flex-col gap-3">
        {sorted.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2.5">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-xs font-medium text-zinc-300 w-[85px] truncate shrink-0">
              {lang.name}
            </span>
            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${lang.percentage}%` : "0%",
                  backgroundColor: lang.color,
                }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 w-[36px] text-right shrink-0 tabular-nums">
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-white/5">
        {sorted.map((lang) => (
          <span
            key={lang.name}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/4 border border-white/5 text-zinc-300"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            {lang.name}
          </span>
        ))}
      </div>
    </div>
  );
}