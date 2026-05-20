"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Download,
  Menu,
  X,
  ArrowUpRight,
  GitFork,
  Star,
  GraduationCap,
  Briefcase,
  Award,
  Code2,
  Wrench,
  Layers,
  Languages,
  Sparkles,
  ChevronDown,
  Zap,
  Cpu,

  Terminal,
  Rocket,
  Target,
} from "lucide-react";
import { Project, GitHubUserStats } from "@/lib/github";
import GitHubCalendar from "@/components/gitstats/GitHubCalendar";
import GitHubLangChart from "@/components/gitstats/GitHubLangChart";
import StatsTracker from "@/components/gitstats/StatsTracker";
import AnimatedCounter from "@/components/AnimatedCounter";
import {
  profile,
  education,
  experience,
  skillGroups,
  tools,
  expertise,
  softSkills,
  languages as spokenLanguages,
  certifications,
  stats,
} from "@/data/portfolio";


/* ===== Inline brand icons (lucide@1.16 has no Github/Linkedin) ===== */
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.69-1.3-1.69-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.41-5.25 5.69.42.36.79 1.07.79 2.17v3.22c0 .31.21.67.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

/* ===== Tool brand meta ===== */
const TOOL_META: Record<
  string,
  { color: string; glyph: string; tone: "light" | "dark" }
> = {
  "Next.js":      { color: "#0f172a", glyph: "▲",  tone: "dark" },
  React:          { color: "#0ea5e9", glyph: "⚛",  tone: "dark" },
  TypeScript:     { color: "#1d4ed8", glyph: "TS", tone: "dark" },
  "Tailwind CSS": { color: "#22d3ee", glyph: "✦",  tone: "light" },
  Laravel:        { color: "#ef4444", glyph: "⚡", tone: "dark" },
  PHP:            { color: "#6366f1", glyph: "🐘", tone: "dark" },
  Flutter:        { color: "#3b82f6", glyph: "◆",  tone: "dark" },
  Dart:           { color: "#0ea5e9", glyph: "◆",  tone: "dark" },
  Firebase:       { color: "#f59e0b", glyph: "🔥", tone: "light" },
  "Node.js":      { color: "#16a34a", glyph: "●",  tone: "dark" },
  Git:            { color: "#f97316", glyph: "≠",  tone: "dark" },
  Figma:          { color: "#ec4899", glyph: "◆",  tone: "dark" },
};

/* ===== Skill group accent palettes ===== */
const GROUP_ACCENTS: Record<
  string,
  { from: string; to: string; icon: React.ReactNode; ring: string }
> = {
  Frontend: {
    from: "from-blue-500/15",
    to: "to-cyan-500/5",
    icon: <Code2 className="w-4 h-4" />,
    ring: "border-blue-400/30",
  },
  Backend: {
    from: "from-rose-500/15",
    to: "to-orange-500/5",
    icon: <Terminal className="w-4 h-4" />,
    ring: "border-rose-400/30",
  },
  "Mobile & Cloud": {
    from: "from-purple-500/15",
    to: "to-pink-500/5",
    icon: <Cpu className="w-4 h-4" />,
    ring: "border-purple-400/30",
  },
};

const CERT_ACCENTS = [
  { color: "#10b981", badge: "🏆" },
  { color: "#3b82f6", badge: "📱" },
  { color: "#f97316", badge: "🌐" },
  { color: "#a855f7", badge: "🎨" },
];

const LANG_FLAGS: Record<string, string> = {
  Indonesian: "🇮🇩",
  Arabic: "🇸🇦",
  English: "🇬🇧",
};

interface PortfolioClientProps {
  initialProjects: Project[];
  initialGitHubStats: GitHubUserStats;
}

const NAV_LINKS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "github", label: "GitHub" },
  { id: "projects", label: "Projects" },
] as const;

/* ===== Tilt handlers ===== */
const handleTilt = (e: React.MouseEvent<HTMLElement>, factor = 8) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  e.currentTarget.style.transform = `perspective(900px) rotateY(${x * factor}deg) rotateX(${-y * factor}deg) translateY(-4px)`;
};
const handleTiltLeave = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.transform =
    "perspective(900px) rotateY(0) rotateX(0) translateY(0)";
};

export default function PortfolioClient({
  initialProjects,
  initialGitHubStats,
}: PortfolioClientProps) {
  const heroRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  // Client component: treat as client-side for effects.
  const isClient = true;



  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [typedText, setTypedText] = useState("");
  const [cursorHover, setCursorHover] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  const fullTitle = profile.title;

  const {
    languages: ghLanguages,
    contributionCalendar,
    totalStars,
    totalForks,
    username,
    totalPublicRepos,
    totalCommits,
  } = initialGitHubStats;


  // (Intentionally no mount-only setState; GSAP-like behaviors run in effects below.)






  /* Typing effect */
  useEffect(() => {
    if (!isClient) return;

    let idx = 0;
    // Avoid sync setState in effect body
    queueMicrotask(() => setTypedText(""));

    const interval = setInterval(() => {
      if (idx <= fullTitle.length) {
        setTypedText(fullTitle.slice(0, idx));
        idx++;
      } else clearInterval(interval);
    }, 55);

    return () => clearInterval(interval);
  }, [isClient, fullTitle]);


  /* Cursor */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
    if (cursorRef.current)
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    if (cursorDotRef.current)
      cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  }, []);

  useEffect(() => {
    if (!isClient) return;
    window.addEventListener("mousemove", handleMouseMove);
    const enter = () => setCursorHover(true);
    const leave = () => setCursorHover(false);
    const els = document.querySelectorAll(
      "a, button, .hoverable, .hero-badge, .tilt-card"
    );
    els.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [handleMouseMove, isClient]);

  /* Particles */
  useEffect(() => {
    if (!isClient || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId = 0;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isClient]);

  /* Scroll progress + active + reveal */
  useEffect(() => {
    if (!isClient) return;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);

      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (progressRef.current && max > 0) {
        progressRef.current.style.transform = `scaleX(${Math.min(y / max, 1)})`;
      }

      const ids = ["hero", "about", "experience", "github", "projects"];
      let current = "hero";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 140) current = id;
      }
      setActiveSection(current);

      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) {
          el.classList.add("is-visible");
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isClient]);

  return (
    <div
      className={`min-h-screen bg-[#0b1120] text-zinc-100 font-sans selection:bg-blue-500/30 selection:text-white ${
        isClient ? "cursor-none" : ""
      }`}
    >
      {/* CURSOR */}
      {isClient && (
        <>
          <div
            ref={cursorRef}
            className={`custom-cursor ${cursorHover ? "hovering" : ""}`}
          />
          <div ref={cursorDotRef} className="custom-cursor-dot" />
        </>
      )}

      {/* SCROLL PROGRESS */}
      <div className="fixed top-0 inset-x-0 h-[2px] z-[80] bg-white/5">
        <div
          ref={progressRef}
          className="h-full origin-left scale-x-0 bg-blue-500 transition-transform duration-150"
        />
      </div>

      {/* ===== HERO (original style preserved) ===== */}
      <header
        id="hero"
        ref={heroRef}
        className="relative h-screen w-full flex flex-col overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 pointer-events-none"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-blue-600/40 via-transparent to-[#0b1120]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[200px] z-0" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] z-0" />

        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[120px] z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
            left: `${mousePos.x * 100}%`,
            top: `${mousePos.y * 100}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 0.8s ease-out, top 0.8s ease-out",
          }}
        />

        <nav
          className={`relative z-30 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? "fixed top-0 left-0 right-0 max-w-none bg-[#0b1120]/85 backdrop-blur-xl border-b border-white/5"
              : ""
          }`}
        >
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-extrabold text-lg group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              {profile.initials}
            </div>
            <span className="font-bold tracking-tight text-white/70 text-sm">
              {profile.handle}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === link.id
                    ? "text-white bg-white/10"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute -bottom-0.5 left-4 right-4 h-[2px] bg-gradient-to-r from-blue-500 to-blue-300 rounded-full" />
                )}
              </a>
            ))}
            <a
              href={profile.cv}
              download
              className="ml-4 px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> CV
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur border border-white/20 transition-all hover:bg-white/20"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden absolute top-20 left-4 right-4 z-50 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-5 flex flex-col gap-3 text-sm">
            {NAV_LINKS.slice(1).map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className="text-white/70 hover:text-white py-2 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={profile.cv}
              download
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:scale-[1.02] transition-all"
            >
              <Download className="w-4 h-4" /> Download CV
            </a>
          </div>
        )}

        <div
          className="absolute inset-x-0 bottom-0 top-12 z-1 flex items-end justify-center pointer-events-none"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * 24}px, ${(mousePos.y - 0.5) * 18}px)`,
            transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="relative h-[105%] sm:h-[110%] flex items-end justify-center img-glow">
            <Image
              src={profile.avatar}
              alt={profile.shortName}
              width={1400}
              height={1680}
              priority
              className="object-contain w-auto h-full max-h-none"
              style={{ filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.6))" }}
            />
          </div>
        </div>

        <div
          className="hero-badge absolute top-[12%] right-[5%] md:right-[10%] z-20 hidden sm:block"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -20}px, ${(mousePos.y - 0.5) * -20}px)`,
            transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-bold text-yellow-300 tracking-wider shadow-xl hover:bg-white/20 hover:scale-105 transition-all cursor-default">
            ✨ Open to Work
          </div>
        </div>

        <div
          className="hero-badge absolute bottom-[20%] left-[3%] md:left-[8%] z-20 hidden sm:block"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -25}px, ${(mousePos.y - 0.5) * -25}px)`,
            transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white/8 backdrop-blur-xl rounded-full border border-white/15 flex items-center justify-center shadow-2xl hover:bg-white/12 hover:scale-105 transition-all duration-300 cursor-default">
            <div className="text-center font-black text-[10px] sm:text-[11px] text-white/85 uppercase leading-tight tracking-wide">
              IDN<br />Boarding<br />School
            </div>
          </div>
        </div>

        <div
          className="hero-badge absolute top-[30%] left-[4%] md:left-[8%] z-20 hidden sm:block"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -15}px, ${(mousePos.y - 0.5) * -15}px)`,
            transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-bold text-white tracking-wider shadow-xl hover:bg-white/20 hover:scale-105 transition-all cursor-default">
            💻 Full-Stack
          </div>
        </div>

        <div
          className="hero-badge absolute bottom-[35%] right-[4%] md:right-[8%] z-20 hidden sm:block"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -18}px, ${(mousePos.y - 0.5) * -18}px)`,
            transition: "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="px-4 py-2 bg-white/8 backdrop-blur-xl border border-white/15 rounded-xl text-[9px] font-bold text-emerald-300 shadow-xl flex items-center gap-1.5 hover:bg-white/12 hover:scale-105 transition-all cursor-default">
            <Sparkles className="w-3.5 h-3.5" /> {profile.yearsExperience}+ Years
          </div>
        </div>

        <div
          className="hero-badge absolute top-[50%] right-[3%] md:right-[6%] z-20 hidden sm:block"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -22}px, ${(mousePos.y - 0.5) * -22}px)`,
            transition: "transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="px-4 py-2 bg-white/8 backdrop-blur-xl border border-white/15 rounded-xl text-[9px] font-bold text-amber-300 shadow-xl flex items-center gap-1.5 hover:bg-white/12 hover:scale-105 transition-all cursor-default">
            🏅 Certified
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 pb-14 sm:pb-16 px-6 text-center pointer-events-none">
          <div className="max-w-5xl mx-auto pointer-events-auto">
            <p className="text-white/40 text-[10px] sm:text-xs font-medium uppercase tracking-[0.4em] mb-2">
              Hello, I am
            </p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95]">
              <span className="hero-title">
                {profile.name.toUpperCase()}
              </span>
            </h1>
            <p className="text-white/50 text-xs sm:text-base mt-3 font-medium min-h-[1.6em]">
              {typedText}
              <span className="animate-pulse text-blue-400">|</span>
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/20">
          <span className="text-[7px] font-semibold uppercase tracking-[0.4em]">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </header>

      {/* ===== SECTIONS BELOW ===== */}
      <main className="relative max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32 flex flex-col gap-28 sm:gap-36">
        {/* Subtle background grid */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* ===== ABOUT ===== */}
        <Section
          id="about"
          eyebrow="01 — About"
          title="A bit about me."
          accent="blue"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">
            <div className="reveal">
              <p className="text-zinc-200 text-base sm:text-lg leading-relaxed">
                {profile.bio}
              </p>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mt-4">
                Outside of shipping side projects, I teach programming to
                younger students and contribute to open-source. I believe in
                clean code, measured architecture, and design that respects the
                reader.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-8">
                {[
                  { value: stats.hoursCoding, suffix: "+", label: "Hours coding" },
                  { value: stats.projectsCompleted, suffix: "", label: "Projects shipped" },
                  { value: stats.technologiesMastered, suffix: "", label: "Technologies" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="tilt-card rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-white/2 p-4 glow-card"
                    onMouseMove={(e) => handleTilt(e, 6)}
                    onMouseLeave={handleTiltLeave}
                  >
                    <div className="text-2xl sm:text-3xl font-black bg-gradient-to-br from-blue-300 to-cyan-200 bg-clip-text text-transparent">
                      <AnimatedCounter target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-400 mt-1.5 font-semibold">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Expertise mini-bars */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {expertise.map((e) => (
                  <div
                    key={e.label}
                    className="rounded-xl border border-white/5 bg-white/2 p-4 hover:border-blue-400/30 hover:bg-white/4 transition-colors"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                        {e.label}
                      </span>
                      <span className="text-sm font-bold text-blue-300 tabular-nums">
                        {e.value}%
                      </span>
                    </div>
                    <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                        style={{ width: `${e.value}%` }}
                      />
                    </div>
                    <div className="text-[9px] text-zinc-500 mt-2">{e.stack}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5 reveal">
              {/* Education */}
              <div
                className="tilt-card rounded-2xl border border-white/10 bg-gradient-to-br from-white/3 to-transparent p-6 glow-card"
                onMouseMove={(e) => handleTilt(e, 4)}
                onMouseLeave={handleTiltLeave}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="inline-flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-400/20 flex items-center justify-center text-blue-300">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                      Education
                    </h4>
                  </div>
                </div>
                {education.map((ed) => (
                  <div key={ed.school} className="relative pl-5 border-l-2 border-blue-500/40">
                    <span className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-400 ring-4 ring-[#0b1120]" />
                    <span className="inline-block text-[10px] font-bold text-blue-300 uppercase tracking-wider bg-blue-500/10 px-2 py-0.5 rounded">
                      {ed.period}
                    </span>
                    <h5 className="font-bold text-white text-base mt-2">
                      {ed.school}
                    </h5>
                    <p className="text-zinc-400 text-xs mt-1">{ed.program}</p>
                    <p className="text-zinc-500 text-xs mt-3 leading-relaxed">
                      {ed.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Languages */}
              <div
                className="tilt-card rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/8 to-transparent p-6 glow-card"
                onMouseMove={(e) => handleTilt(e, 4)}
                onMouseLeave={handleTiltLeave}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="inline-flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center text-emerald-300">
                      <Languages className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                      Languages
                    </h4>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {spokenLanguages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-sm font-semibold text-zinc-100 inline-flex items-center gap-2">
                          <span className="text-base">
                            {LANG_FLAGS[lang.name] ?? "🌐"}
                          </span>
                          {lang.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold bg-white/5 px-2 py-0.5 rounded">
                          {lang.proficiency}
                        </span>
                      </div>
                      <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full relative shimmer-bar"
                          style={{ width: `${lang.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== EXPERIENCE & SKILLS ===== */}
        <Section
          id="experience"
          eyebrow="02 — Work"
          title="Experience & expertise."
          accent="purple"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16">
            {/* Timeline */}
            <div className="reveal">
              <div className="inline-flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-400/20 flex items-center justify-center text-purple-300">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                  Timeline
                </h3>
              </div>

              <ol className="relative ml-1 pl-7">
                {/* gradient line */}
                <span className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-blue-400/60 via-purple-400/40 to-pink-400/20" />

                {experience.map((item, i) => (
                  <li
                    key={i}
                    className="relative pb-7 last:pb-0 tilt-card"
                    onMouseMove={(e) => handleTilt(e, 4)}
                    onMouseLeave={handleTiltLeave}
                  >
                    <span className="absolute -left-[27px] top-3 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 ring-4 ring-[#0b1120] shadow-lg shadow-blue-500/30" />
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/3 to-transparent p-5 glow-card">
                      <div className="flex items-baseline justify-between gap-3 flex-wrap">
                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider bg-blue-500/10 border border-blue-400/20 px-2 py-0.5 rounded">
                          {item.period}
                        </span>
                        <Rocket className="w-3.5 h-3.5 text-zinc-500" />
                      </div>
                      <h4 className="font-bold text-white mt-2">{item.role}</h4>
                      <p className="text-zinc-500 text-xs mt-0.5 font-medium">
                        {item.company}
                      </p>
                      <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded border border-purple-400/20 bg-purple-500/10 text-purple-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Skills (category cards) */}
            <div className="flex flex-col gap-7 reveal">
              <div className="inline-flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-400/20 flex items-center justify-center text-blue-300">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                  Skills
                </h3>
              </div>

              {skillGroups.map((group) => {
                const accent = GROUP_ACCENTS[group.label] ?? {
                  from: "from-blue-500/15",
                  to: "to-cyan-500/5",
                  icon: <Code2 className="w-4 h-4" />,
                  ring: "border-blue-400/30",
                };
                return (
                  <div
                    key={group.label}
                    className={`tilt-card rounded-2xl border border-white/10 bg-gradient-to-br ${accent.from} ${accent.to} p-5 glow-card`}
                    onMouseMove={(e) => handleTilt(e, 3)}
                    onMouseLeave={handleTiltLeave}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center gap-2 text-zinc-200 text-sm font-bold uppercase tracking-wider">
                        <span className={`w-6 h-6 rounded-md border ${accent.ring} bg-white/5 flex items-center justify-center text-zinc-200`}>
                          {accent.icon}
                        </span>
                        {group.label}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                        {group.items.length} skills
                      </span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {group.items.map((skill) => (
                        <div key={skill.name}>
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-sm font-medium text-zinc-200">
                              {skill.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 tabular-nums font-mono">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full relative shimmer-bar bg-gradient-to-r from-blue-400 to-cyan-300"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tools row (branded badges, full width) */}
          <div className="mt-10 reveal">
            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-400/20 flex items-center justify-center text-amber-300">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                Tools I use daily
              </h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {tools.map((name) => {
                const meta = TOOL_META[name];
                const bg = meta ? meta.color : "#475569";
                const textDark = meta?.tone === "light";
                return (
                  <div
                    key={name}
                    className="tilt-card group flex flex-col items-center gap-1.5 px-3 py-3.5 rounded-xl border border-white/10 font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-default"
                    style={{
                      backgroundColor: `${bg}CC`,
                      color: textDark ? "#0f172a" : "#fff",
                    }}
                    onMouseMove={(e) => handleTilt(e, 8)}
                    onMouseLeave={handleTiltLeave}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
                      {meta?.glyph ?? "●"}
                    </span>
                    {name}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Soft skills */}
          <div className="mt-10 reveal">
            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-pink-500/15 border border-pink-400/20 flex items-center justify-center text-pink-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                Soft skills
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {softSkills.map((s, i) => (
                <div
                  key={s}
                  className="tilt-card flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-gradient-to-br from-white/3 to-transparent hover:border-blue-400/30 transition-colors"
                  onMouseMove={(e) => handleTilt(e, 4)}
                  onMouseLeave={handleTiltLeave}
                >
                  <span className="w-7 h-7 rounded-md bg-blue-500/15 border border-blue-400/20 flex items-center justify-center text-blue-300 text-xs font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold text-zinc-200">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ===== GITHUB ===== */}
        <Section
          id="github"
          eyebrow="03 — Activity"
          title="Live from GitHub."
          accent="cyan"
        >
          <div className="flex items-center justify-between mb-6 reveal flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-sm text-zinc-200 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-400/20">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{totalStars}</span>
                <span className="text-zinc-500 text-xs">stars</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-zinc-200 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-400/20">
                <GitFork className="w-3.5 h-3.5 text-blue-300" />
                <span className="font-bold">{totalForks}</span>
                <span className="text-zinc-500 text-xs">forks</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-zinc-200 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-400/20">
                <Layers className="w-3.5 h-3.5 text-purple-300" />
                <span className="font-bold">{totalPublicRepos}</span>
                <span className="text-zinc-500 text-xs">repos</span>
              </span>
            </div>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-300 hover:text-blue-200 font-semibold hover:gap-2 transition-all"
            >
              @{username} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="reveal">
            <StatsTracker
              hoursCoding={stats.hoursCoding}
              projectsCompleted={stats.projectsCompleted}
              technologiesMastered={stats.technologiesMastered}
              totalRepos={totalPublicRepos}
              totalStars={totalStars}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6 reveal">
            <div className="gradient-border p-5">
              <GitHubCalendar
                days={contributionCalendar}
                totalCommits={totalCommits}
                username={username}
              />
            </div>
            <div className="gradient-border p-5">
              <GitHubLangChart
                languages={ghLanguages}
                totalRepos={totalPublicRepos}
              />
            </div>
          </div>
        </Section>

        {/* ===== CERTIFICATIONS ===== */}
        <Section
          id="certifications"
          eyebrow="04 — Credentials"
          title="Certifications."
          accent="amber"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal">
            {certifications.map((cert, i) => {
              const accent = CERT_ACCENTS[i % CERT_ACCENTS.length];
              return (
                <a
                  key={i}
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tilt-card shine-card group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/3 to-transparent p-6 glow-card overflow-hidden"
                  onMouseMove={(e) => handleTilt(e, 5)}
                  onMouseLeave={handleTiltLeave}
                >
                  <span
                    className="absolute top-0 inset-x-0 h-1"
                    style={{
                      background: `linear-gradient(90deg, ${accent.color}, ${accent.color}99, transparent)`,
                    }}
                  />
                  <div className="flex items-start justify-between gap-4 mt-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                        {cert.year} · {cert.issuer}
                      </div>
                      <h3 className="font-bold text-white mt-1.5 leading-snug text-base">
                        {cert.title}
                      </h3>
                    </div>
                    <div
                      className="text-2xl shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center"
                      style={{
                        backgroundColor: `${accent.color}15`,
                        borderColor: `${accent.color}40`,
                      }}
                    >
                      {accent.badge}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded border inline-flex items-center gap-1"
                      style={{
                        borderColor: `${accent.color}50`,
                        color: accent.color,
                        backgroundColor: `${accent.color}10`,
                      }}
                    >
                      <Award className="w-2.5 h-2.5" /> {cert.grade}
                    </span>
                    <span className="text-xs text-zinc-500 inline-flex items-center gap-1 group-hover:text-blue-300 transition-colors">
                      View credential <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </Section>

        {/* ===== PROJECTS ===== */}
        <Section
          id="projects"
          eyebrow="05 — Work"
          title="Selected projects."
          accent="pink"
        >
          <div className="flex items-end justify-between mb-6 reveal flex-wrap gap-3">
            <div>
              <p className="text-zinc-400 text-sm">
                Pulled live from GitHub. Sorted by recent stars.
              </p>
              <p className="text-zinc-600 text-xs mt-1 inline-flex items-center gap-1.5">
                <Target className="w-3 h-3" /> Showing top {Math.min(initialProjects.length, 9)} of {totalPublicRepos}.
              </p>
            </div>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-300 hover:text-blue-200 hover:gap-2 transition-all px-3 py-1.5 rounded-lg border border-blue-400/20 bg-blue-500/10"
            >
              All repositories <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 reveal">
            {initialProjects.slice(0, 9).map((project) => (
              <a
                key={project.id}
                href={project.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tilt-card group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/3 to-transparent p-5 hover:border-blue-400/40 transition-colors flex flex-col overflow-hidden glow-card"
                onMouseMove={(e) => handleTilt(e, 5)}
                onMouseLeave={handleTiltLeave}
              >
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(96,165,250,0.6), transparent 70%)",
                  }}
                />
                <div className="relative flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-300 uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 bg-white/5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: getLangColor(project.language),
                      }}
                    />
                    {project.language || "Code"}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                    {project.stars > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        {project.stars}
                      </span>
                    )}
                    {project.forks > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {project.forks}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-white text-base leading-snug group-hover:text-blue-300 transition-colors break-words capitalize">
                  {project.name.replace(/[-_]/g, " ")}
                </h3>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed line-clamp-2 flex-1">
                  {project.description}
                </p>
                {project.topics && project.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.topics.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[9px] font-medium px-1.5 py-0.5 rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 relative">
                  <span className="text-[10px] text-zinc-500 inline-flex items-center gap-1 uppercase tracking-wider font-semibold">
                    View on GitHub
                  </span>
                  <span className="text-blue-300 inline-flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Section>

        {/* ===== CONTACT ===== */}
        <Section
          id="contact"
          eyebrow="06 — Get in touch"
          title="Let's build something."
          accent="blue"
        >
          <div className="reveal relative rounded-3xl border border-white/10 overflow-hidden">
            {/* gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/10 to-pink-500/10" />
            <div
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/30 blur-3xl animate-float"
            />
            <div
              className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl animate-float"
              style={{ animationDelay: "2s" }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center p-8 sm:p-12">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {profile.availability}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-5 leading-tight">
                  Have a project <br className="hidden sm:block" />
                  in mind?
                </h3>
                <p className="text-zinc-300 mt-4 leading-relaxed max-w-md">
                  Whether it&apos;s a marketing site, a dashboard, or a mobile
                  app — I&apos;d love to hear about it.
                </p>
                <div className="flex flex-wrap gap-3 mt-7">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-zinc-900 text-sm font-bold hover:bg-zinc-100 hover:scale-105 transition-all shadow-xl shadow-blue-500/10"
                  >
                    <Mail className="w-4 h-4" /> Send an email
                  </a>
                  <a
                    href={profile.cv}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-white/5 text-zinc-100 text-sm font-bold hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download CV
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <ContactRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={profile.email}
                  href={`mailto:${profile.email}`}
                  accent="#60a5fa"
                />
                <ContactRow
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone"
                  value={profile.phone}
                  href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                  accent="#a78bfa"
                />
                <ContactRow
                  icon={<MapPin className="w-4 h-4" />}
                  label="Location"
                  value={profile.location}
                  accent="#f472b6"
                />
                <ContactRow
                  icon={<GithubIcon className="w-4 h-4" />}
                  label="GitHub"
                  value={`@${username}`}
                  href={profile.social.github}
                  accent="#fff"
                />
                <ContactRow
                  icon={<LinkedinIcon className="w-4 h-4" />}
                  label="LinkedIn"
                  value="zainul-arkaan"
                  href={profile.social.linkedin}
                  accent="#0ea5e9"
                />
              </div>
            </div>
          </div>
        </Section>
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <span>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </span>
          <span>
            Built with <span className="text-zinc-300">Next.js</span>,{" "}
            <span className="text-zinc-300">Tailwind</span> &amp;{" "}
            <span className="text-zinc-300">GSAP</span>.
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Helpers ---------- */

const ACCENT_ORB: Record<string, string> = {
  blue: "bg-blue-500/15",
  purple: "bg-purple-500/15",
  cyan: "bg-cyan-500/15",
  amber: "bg-amber-500/15",
  pink: "bg-pink-500/15",
};

const ACCENT_TEXT: Record<string, string> = {
  blue: "text-blue-300",
  purple: "text-purple-300",
  cyan: "text-cyan-300",
  amber: "text-amber-300",
  pink: "text-pink-300",
};

function Section({
  id,
  eyebrow,
  title,
  children,
  accent = "blue",
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  accent?: "blue" | "purple" | "cyan" | "amber" | "pink";
}) {
  return (
    <section id={id} className="relative scroll-mt-24">
      {/* decorative orb */}
      <div
        className={`absolute -z-10 -top-20 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none ${ACCENT_ORB[accent]}`}
      />
      <div className="mb-10 reveal flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div
            className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] font-bold mb-3 ${ACCENT_TEXT[accent]}`}
          >
            <span className="w-6 h-px bg-current" />
            {eyebrow}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.05]">
            {title}
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  accent = "#60a5fa",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  accent?: string;
}) {
  const content = (
    <>
      <span
        className="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0"
        style={{
          backgroundColor: `${accent}15`,
          borderColor: `${accent}40`,
          color: accent,
        }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
          {label}
        </div>
        <div className="text-sm text-white font-semibold truncate">{value}</div>
      </div>
      {href && <ArrowUpRight className="w-4 h-4 text-zinc-500" />}
    </>
  );
  const base =
    "flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 backdrop-blur px-4 py-3 hover:border-white/20 hover:bg-white/5 transition-colors";
  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={base}
    >
      {content}
    </a>
  ) : (
    <div className={base}>{content}</div>
  );
}

function getLangColor(lang: string): string {
  const map: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    PHP: "#4F5D95",
    Dart: "#00B4AB",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Vue: "#41b883",
    Go: "#00ADD8",
  };
  return map[lang] || "#94a3b8";
}
