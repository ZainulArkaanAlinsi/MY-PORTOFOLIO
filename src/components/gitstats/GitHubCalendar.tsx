"use client";

import React, { useRef, useEffect, useState } from "react";

interface DayData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubCalendarProps {
  days: DayData[];
  totalCommits?: number;
  username?: string;
}

const LEVEL_COLORS = [
  "bg-white/4",       // level 0 — no contribution
  "bg-emerald-900/60",// level 1 — light
  "bg-emerald-700",   // level 2 — medium
  "bg-emerald-500",   // level 3 — high
  "bg-emerald-400",   // level 4 — very high
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function GitHubCalendar({ days, totalCommits, username }: GitHubCalendarProps) {
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
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Group days into weeks (Sunday-start weeks)
  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];

  // Fill leading empty days so the first day aligns to Sunday
  if (days.length > 0) {
    const firstDate = new Date(days[0].date);
    const firstDayOfWeek = firstDate.getDay(); // 0=Sun
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: "", count: 0, level: 0 });
    }
  }

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    // pad remaining
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0, level: 0 });
    }
    weeks.push(currentWeek);
  }

  // Calculate visible day count (non-empty)
  const activeDays = days.filter((d) => d.count > 0).length;

  return (
    <div
      ref={containerRef}
      className={`w-full transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm text-white tracking-tight">
            Contributions
          </h3>
          {totalCommits !== undefined && totalCommits > 0 && (
            <p className="text-xs text-zinc-500 mt-0.5">
              {totalCommits.toLocaleString()} this year
            </p>
          )}
        </div>
        {username && (
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-blue-400 hover:underline"
          >
            @{username}
          </a>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => {
                const d = new Date(day.date);
                const isToday =
                  day.date &&
                  new Date().toISOString().split("T")[0] === day.date;
                return (
                  <div
                    key={`${wi}-${di}`}
                    title={
                      day.date
                        ? `${day.count} contributions on ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
                        : ""
                    }
                    className={`w-[10px] h-[10px] rounded-[2px] ${LEVEL_COLORS[day.level]} ${
                      isToday ? "ring-1 ring-blue-400" : ""
                    } transition-colors duration-150`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="flex items-center justify-between mt-3 text-[10px] font-medium text-zinc-500">
        <span>{activeDays} active days</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {LEVEL_COLORS.map((cls, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}