"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
  Briefcase,
  Award,
  Layers,
  ChevronDown,
  Copy,
  Check,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { Project, GitHubUserStats } from "@/lib/github";
import GitHubCalendar from "@/components/gitstats/GitHubCalendar";
import GitHubLangChart from "@/components/gitstats/GitHubLangChart";
import StatsTracker from "@/components/gitstats/StatsTracker";
import AnimatedCounter from "@/components/AnimatedCounter";
import { CinematicFooter } from "@/components/ui/motion-footer";
import SkillsShowcase from "@/components/ui/skills-showcase";
import ExpertiseGrid from "@/components/ui/expertise-grid";
import WorkShowcase from "@/components/ui/work-showcase";

import {
  profile,
  experience,
  softSkills,
  certifications,
  stats,
  tools,
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

/* Tool meta removed — tools are shown in SkillsShowcase now */

/* ===== Skill group accent palettes ===== */
/* GROUP_ACCENTS removed — skills cards replaced by `SkillsGrid` component */

const CERT_ACCENTS = [
  { color: "#10b981", badge: "🏆" },
  { color: "#3b82f6", badge: "📱" },
  { color: "#f97316", badge: "🌐" },
  { color: "#a855f7", badge: "🎨" },
];



/* ===== GLSL Shader Sources ===== */
const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float ratio = u_resolution.x / u_resolution.y;
    vec2 centeredUv = (uv - 0.5) * vec2(ratio, 1.0);
    
    // Base color (Matches #0b1120)
    vec3 color = vec3(0.043, 0.067, 0.125);

    // Dynamic Aurora effect
    float liquid = sin(centeredUv.x * 3.0 + u_time * 0.5) * cos(centeredUv.y * 2.0 + u_time * 0.4);
    float swirl = sin(distance(uv, u_mouse) * 5.0 - u_time * 0.8);
    
    // Color layers
    vec3 blue = vec3(0.145, 0.388, 0.922);   // #2563eb
    vec3 purple = vec3(0.545, 0.271, 0.965); // #8b5cf6
    
    color = mix(color, blue, liquid * 0.5 + 0.2);
    color = mix(color, purple, swirl * 0.15);
    
    // Cinematic Noise Grain
    float grain = (random(uv + u_time * 0.01) - 0.5) * 0.04;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface PortfolioClientProps {
  initialProjects: Project[];
  initialGitHubStats: GitHubUserStats;
}

const NAV_LINKS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "expertise", label: "Expertise" },
  { id: "experience", label: "Experience" },
  { id: "github", label: "GitHub" },
  { id: "projects", label: "Projects" },
] as const;

/* ===== Derive LinkedIn slug from full profile URL (single source of truth) ===== */
const linkedinSlug = (() => {
  try {
    const path = new URL(profile.social.linkedin).pathname.replace(/\/+$/, "");
    return path.split("/").filter(Boolean).pop() ?? "linkedin";
  } catch {
    return "linkedin";
  }
})();

/* Lazy-cached motion preference (touch device OR prefers-reduced-motion → skip heavy effects) */
let _motionDisabledCache: boolean | null = null;
const isMotionDisabled = (): boolean => {
  if (_motionDisabledCache !== null) return _motionDisabledCache;
  if (typeof window === "undefined") return false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  _motionDisabledCache = reduced || coarse;
  return _motionDisabledCache;
};

/* ===== Tilt handlers — no-op when motion is disabled (touch / reduced-motion) ===== */
const handleTilt = (e: React.MouseEvent<HTMLElement>, factor = 8) => {
  if (isMotionDisabled()) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  e.currentTarget.style.transform = `perspective(900px) rotateY(${x * factor}deg) rotateX(${-y * factor}deg) translateY(-4px)`;
};
const handleTiltLeave = (e: React.MouseEvent<HTMLElement>) => {
  if (isMotionDisabled()) return;
  e.currentTarget.style.transform =
    "perspective(900px) rotateY(0) rotateX(0) translateY(0)";
};

export default function PortfolioClient({
  initialProjects,
  initialGitHubStats,
}: PortfolioClientProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string, label: string) => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  }, []);

  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  /* motionEnabled starts false so SSR + first paint match; flips true after mount on fine-pointer, motion-allowed clients */
  const [motionEnabled, setMotionEnabled] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [typedText, setTypedText] = useState("");
  const [cursorHover, setCursorHover] = useState(false);
  const [scrollParallaxY, setScrollParallaxY] = useState(0); // New state for parallax effect
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const apply = () =>
      setMotionEnabled(!(reducedQuery.matches || coarseQuery.matches));
    queueMicrotask(apply);
    reducedQuery.addEventListener("change", apply);
    coarseQuery.addEventListener("change", apply);
    return () => {
      reducedQuery.removeEventListener("change", apply);
      coarseQuery.removeEventListener("change", apply);
    };
  }, []);

  /* Prayer-on-section-enter (optional): overlay + audio */
  const [prayerEnabled, setPrayerEnabled] = useState(false);
  const [prayerVisible, setPrayerVisible] = useState(false);
  const [prayerText, setPrayerText] = useState("");
  const prayerAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = requestAnimationFrame(() => {
      const v = localStorage.getItem("prayerEnabled");
      setPrayerEnabled(v === "1");
    });
    // Avoid NotSupportedError when asset is missing/unavailable
    try {
      prayerAudioRef.current = new Audio("/assets/prayer.mp3");
      // Some browsers throw on play/load; we'll just keep a ref if it exists
    } catch {
      prayerAudioRef.current = null;
    }
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!prayerEnabled) return;
    if (!activeSection) return;
    const label = `Praying for ${activeSection}`;
    requestAnimationFrame(() => {
      setPrayerText(label);
      setPrayerVisible(true);
    });
    const audio = prayerAudioRef.current;
    if (audio && userInteracted) {
      try {
        audio.currentTime = 0;
        void audio.play();
      } catch {
        // ignore playback errors (autoplay restrictions)
      }
    }
    const t = setTimeout(() => setPrayerVisible(false), 3000);
    return () => clearTimeout(t);
  // Keep dependency array size/order stable (Next.js dev hot reload can otherwise warn)
  }, [activeSection, prayerEnabled, userInteracted] as const);

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
    let idx = 0;
    queueMicrotask(() => setTypedText(""));

    const interval = setInterval(() => {
      if (idx <= fullTitle.length) {
        setTypedText(fullTitle.slice(0, idx));
        idx++;
      } else clearInterval(interval);
    }, 55);

    return () => clearInterval(interval);
  }, [fullTitle]);

  /* Track first user interaction to enable audio playback (browser autoplay policy) */
  useEffect(() => {
    if (userInteracted) return;
    const onInteract = () => {
      setUserInteracted(true);
      document.removeEventListener("click", onInteract);
      document.removeEventListener("keydown", onInteract);
    };
    document.addEventListener("click", onInteract);
    document.addEventListener("keydown", onInteract);
    return () => {
      document.removeEventListener("click", onInteract);
      document.removeEventListener("keydown", onInteract);
    };
  }, [userInteracted]);

  /* Cursor + mousePos (rAF-throttled, single listener with event delegation for hover) */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    if (cursorRef.current)
      cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    if (cursorDotRef.current)
      cursorDotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  }, []);

  useEffect(() => {
    if (!motionEnabled) return;

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;
    let dirty = false;

    const onMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      handleMouseMove(e);
      if (dirty) return;
      dirty = true;
      rafId = requestAnimationFrame(() => {
        dirty = false;
        setMousePos({
          x: pendingX / window.innerWidth,
          y: pendingY / window.innerHeight,
        });
      });
    };

    const HOVER_SELECTOR = "a, button, .hoverable, .hero-badge, .tilt-card";
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.(HOVER_SELECTOR)) setCursorHover(true);
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.(HOVER_SELECTOR)) setCursorHover(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [motionEnabled, handleMouseMove]);

  /* WebGL Shader Background */
  useEffect(() => {
    if (!motionEnabled || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)!;
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    let animFrame = 0;
    let running = true;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = (time: number) => {
      if (!running) return;
      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mousePos.x, 1.0 - mousePos.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animFrame = requestAnimationFrame(render);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) render(performance.now());
    };

    document.addEventListener("visibilitychange", onVisibility);
    render(0);

    return () => {
      running = false;
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motionEnabled, mousePos]);

  /* Scroll progress + active section — rAF-throttled, cached section refs */
  useEffect(() => {
    const ids = ["hero", "about", "expertise", "experience", "github", "projects"];
    const sectionEls = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    let rafId = 0;
    let dirty = false;
    let lastScrolled = false;
    let lastActive = "hero";
    let lastParallaxY = 0; // Track last parallax Y to avoid excessive state updates

    const update = () => {
      dirty = false;
      const y = window.scrollY;

      const nextScrolled = y > 80;
      if (nextScrolled !== lastScrolled) {
        lastScrolled = nextScrolled;
        setScrolled(nextScrolled);
      }

      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (progressRef.current && max > 0) {
        progressRef.current.style.transform = `scaleX(${Math.min(y / max, 1)})`;
      }

      // Calculate and update parallax for badges
      if (motionEnabled) {
        const newParallaxY = -y * 0.3; // Adjust 0.3 for desired parallax strength
        if (newParallaxY !== lastParallaxY) {
          lastParallaxY = newParallaxY;
          setScrollParallaxY(newParallaxY);
        }
      } else if (scrollParallaxY !== 0) {
        setScrollParallaxY(0); // Reset if motion is disabled
      }

      let current = "hero";
      for (const el of sectionEls) {
        if (el.getBoundingClientRect().top <= 140) current = el.id;
      }
      if (current !== lastActive) {
        lastActive = current;
        setActiveSection(current);
      }
    };

    const onScroll = () => {
      if (dirty) return;
      dirty = true;
      rafId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [motionEnabled, scrollParallaxY]); // include scrollParallaxY to satisfy lint (used in effect)
  

  /* Reveal on scroll — IntersectionObserver replaces per-scroll querySelectorAll */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (els.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#0b1120] text-zinc-100 font-sans selection:bg-blue-500/30 selection:text-white ${
        motionEnabled ? "cursor-none" : ""
      }`}
    >
      {/* CURSOR — only on fine-pointer + motion allowed */}
      {motionEnabled && (
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

      {/* Prayer overlay (shows briefly when entering a section if enabled) */}
      {prayerVisible && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 pointer-events-none transition-opacity duration-300">
          <div className="text-center px-6 py-4 bg-white/5 rounded-md backdrop-blur-sm">
            <p className="text-2xl font-semibold text-white">{prayerText}</p>
          </div>
        </div>
      )}

      {/* Prayer toggle button */}
      <div className="fixed bottom-6 right-6 z-[95]">
        <button
          onClick={() => {
            const next = !prayerEnabled;
            setPrayerEnabled(next);
            try {
              localStorage.setItem("prayerEnabled", next ? "1" : "0");
            } catch {}
          }}
          className="px-3 py-2 rounded-lg bg-white/8 backdrop-blur-sm hover:bg-white/12 transition text-sm"
          aria-pressed={prayerEnabled}
          title="Toggle prayer overlay"
        >
          {prayerEnabled ? "Prayer: On" : "Prayer: Off"}
        </button>
      </div>

      {/* ===== HERO ===== */}
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
            transform: `translate(${(mousePos.x - 0.5) * -20}px, ${(mousePos.y - 0.5) * -20 + scrollParallaxY}px)`,
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
            transform: `translate(${(mousePos.x - 0.5) * -25}px, ${(mousePos.y - 0.5) * -25 + scrollParallaxY}px)`,
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
            transform: `translate(${(mousePos.x - 0.5) * -15}px, ${(mousePos.y - 0.5) * -15 + scrollParallaxY}px)`,
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
            transform: `translate(${(mousePos.x - 0.5) * -18}px, ${(mousePos.y - 0.5) * -18 + scrollParallaxY}px)`,
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
            transform: `translate(${(mousePos.x - 0.5) * -22}px, ${(mousePos.y - 0.5) * -22 + scrollParallaxY}px)`,
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

        {/* ===== ABOUT (Updated layout) ===== */}
        <Section id="about" eyebrow="01 — About" title="A bit about me." accent="blue">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-44 h-44 rounded-full overflow-hidden border border-white/6">
                <Image src={profile.avatar} alt={profile.name} width={176} height={176} className="object-cover" />
              </div>
              <h2 className="mt-4 text-xl font-extrabold">{profile.name}</h2>
              <div className="text-zinc-400 mt-1 text-sm">{profile.title}</div>
              <div className="text-zinc-400 mt-2 text-sm">{profile.location}</div>
            </div>

            <div className="lg:col-span-2">
              <p className="text-zinc-200 text-base sm:text-lg leading-relaxed">
                {profile.bio}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/3 p-4 rounded-lg">
                  <div className="text-xs text-zinc-300 font-semibold">Hours Coding</div>
                  <div className="text-2xl font-bold"><AnimatedCounter target={stats.hoursCoding} suffix="+" /></div>
                </div>
                <div className="bg-white/3 p-4 rounded-lg">
                  <div className="text-xs text-zinc-300 font-semibold">Projects</div>
                  <div className="text-2xl font-bold"><AnimatedCounter target={stats.projectsCompleted} /></div>
                </div>
                <div className="bg-white/3 p-4 rounded-lg">
                  <div className="text-xs text-zinc-300 font-semibold">Technologies</div>
                  <div className="text-2xl font-bold"><AnimatedCounter target={stats.technologiesMastered} /></div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-zinc-300">Tools & Skills</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tools.map((t) => (
                    <span key={t} className="px-2 py-1 bg-white/5 rounded text-sm text-zinc-200">{t}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-zinc-300">Certifications</h3>
                <ul className="mt-2 space-y-2">
                  {certifications.map((c) => (
                    <li key={c.title} className="bg-white/3 p-3 rounded">
                      <div className="font-semibold">{c.title} <span className="text-xs text-zinc-400">{c.year}</span></div>
                      <div className="text-sm text-zinc-300">{c.issuer ?? ''}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== EXPERTISE / WHAT I DO ===== */}
        <Section
          id="expertise"
          eyebrow="02 — What I do"
          title="Areas of expertise."
          accent="cyan"
        >
          <ExpertiseGrid />
        </Section>

        {/* ===== EXPERIENCE & SKILLS ===== */}
        <Section
          id="experience"
          eyebrow="03 — Work"
          title="Experience & journey."
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

                {experience.slice(0, 4).map((item, i) => (
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

            {/* Skills cards removed — using `SkillsGrid` to avoid duplicate UI */}
          </div>

          {/* Tools row (branded badges, full width) */}
          {/* Tools row removed — unified in SkillsShowcase */}

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

        {/* ===== SKILLS SHOWCASE (replaces cards & tools) ===== */}
        <SkillsShowcase />

        {/* ===== GITHUB ===== */}
        <Section
          id="github"
          eyebrow="04 — Activity"
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
          eyebrow="05 — Credentials"
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
          eyebrow="06 — Work"
          title="Work, by category."
          accent="pink"
        >
          <div className="flex items-end justify-between mb-6 reveal flex-wrap gap-3">
            <div>
              <p className="text-zinc-400 text-sm">
                Explore my work by discipline — hover to preview, click to open.
              </p>
              <p className="text-zinc-600 text-xs mt-1 inline-flex items-center gap-1.5">
                <Target className="w-3 h-3" /> {totalPublicRepos} repositories, grouped across 7 areas.
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

          <div className="reveal">
            <WorkShowcase projects={initialProjects} />
          </div>
        </Section>

        {/* ===== CONTACT ===== */}
        <Section
          id="contact"
          eyebrow="07 — Get in touch"
          title="Let's build something."
          accent="blue"
        >
          <div className="reveal relative rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-br from-white/3 to-transparent">
            <div
              aria-hidden="true"
              className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"
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
                <p className="text-zinc-400 text-sm sm:text-base mt-4 leading-relaxed max-w-md">
                  Whether it&apos;s a marketing site, a dashboard, or a mobile
                  app — I&apos;d love to hear about it.
                </p>
                <div className="flex flex-wrap gap-3 mt-7">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-400 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Send an email
                  </a>
                  <a
                    href={profile.cv}
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 bg-white/5 text-zinc-100 text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download CV
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <ContactRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={profile.email}
                    onCopy={() => copyToClipboard(profile.email, "Email")}
                    isCopied={copyFeedback === "Email"}
                />
                <ContactRow
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone"
                  value={profile.phone}
                    onCopy={() => copyToClipboard(profile.phone.replace(/\s+/g, ""), "Phone")}
                    isCopied={copyFeedback === "Phone"}
                />
                <ContactRow
                  icon={<MapPin className="w-4 h-4" />}
                  label="Location"
                  value={profile.location}
                />
                <ContactRow
                  icon={<GithubIcon className="w-4 h-4" />}
                  label="GitHub"
                  value={`@${username}`}
                  href={profile.social.github}
                />
                <ContactRow
                  icon={<LinkedinIcon className="w-4 h-4" />}
                  label="LinkedIn"
                  value={linkedinSlug}
                  href={profile.social.linkedin}
                />
              </div>
            </div>
          </div>
        </Section>
      </main>

      <CinematicFooter />

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

const SECTION_BG: Record<
  string,
  { light: string; dark: string; textLight: string; textDark: string }
> = {
  hero: {
    light: "bg-gradient-to-b from-blue-50 via-white/60 to-white/0",
    dark: "bg-gradient-to-b from-blue-600/25 via-[#0b1120] to-[#0b1120]",
    textLight: "text-zinc-900",
    textDark: "text-white",
  },
  about: {
    light: "bg-gradient-to-br from-cyan-50/70 via-white to-white",
    dark: "bg-gradient-to-br from-cyan-400/10 via-[#0b1120] to-[#0b1120]",
    textLight: "text-zinc-900",
    textDark: "text-white",
  },
  expertise: {
    light: "bg-gradient-to-br from-sky-50/70 via-white to-white",
    dark: "bg-gradient-to-br from-cyan-400/10 via-[#0b1120] to-[#0b1120]",
    textLight: "text-zinc-900",
    textDark: "text-white",
  },
  experience: {
    light: "bg-gradient-to-br from-violet-50/70 via-white to-white",
    dark: "bg-gradient-to-br from-purple-500/10 via-[#0b1120] to-[#0b1120]",
    textLight: "text-zinc-900",
    textDark: "text-white",
  },
  github: {
    light: "bg-gradient-to-br from-emerald-50/70 via-white to-white",
    dark: "bg-gradient-to-br from-emerald-400/10 via-[#0b1120] to-[#0b1120]",
    textLight: "text-zinc-900",
    textDark: "text-white",
  },
  projects: {
    light: "bg-gradient-to-br from-pink-50/70 via-white to-white",
    dark: "bg-gradient-to-br from-pink-400/10 via-[#0b1120] to-[#0b1120]",
    textLight: "text-zinc-900",
    textDark: "text-white",
  },
  certifications: {
    light: "bg-gradient-to-br from-amber-50/70 via-white to-white",
    dark: "bg-gradient-to-br from-amber-400/10 via-[#0b1120] to-[#0b1120]",
    textLight: "text-zinc-900",
    textDark: "text-white",
  },
  contact: {
    light: "bg-gradient-to-br from-blue-50/70 via-white to-white",
    dark: "bg-gradient-to-br from-blue-400/10 via-[#0b1120] to-[#0b1120]",
    textLight: "text-zinc-900",
    textDark: "text-white",
  },
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
  const bg =
    SECTION_BG[id] ??
    ({
      light: "bg-white",
      dark: "bg-[#0b1120]",
      textLight: "text-zinc-900",
      textDark: "text-white",
    } as const);

  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className="relative scroll-mt-24"
      initial={reduceMotion ? false : { opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* section background (beda per id) */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-20 rounded-[1.5rem] ${bg.light} dark:${bg.dark}`}
      />
      {/* decorative orb */}
      <div
        className={`absolute -z-10 -top-20 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none ${ACCENT_ORB[accent]}`}
      />
      <motion.div
        className="mb-10 flex items-end justify-between gap-6 flex-wrap"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <div
            className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] font-bold mb-3 ${ACCENT_TEXT[accent]}`}
          >
            <span className="w-6 h-px bg-current" />
            {eyebrow}
          </div>
          <h2
            className={`text-3xl sm:text-5xl font-black tracking-tight leading-[1.05] ${bg.textLight} dark:${bg.textDark}`}
          >
            {title}
          </h2>
        </div>
      </motion.div>
      <div className="relative z-0">{children}</div>
    </motion.section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  onCopy,
  isCopied,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  onCopy?: () => void;
  isCopied?: boolean;
}) {
  const content = (
    <>
      <span className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center shrink-0 text-blue-300">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
          {label}
        </div>
        <div className="text-sm text-white font-semibold truncate">{value}</div>
      </div>
      {onCopy ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            onCopy();
          }}
          className={`p-2 rounded-md transition-all ${isCopied ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-500 hover:text-white hover:bg-white/10"}`}
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      ) : (
        href && <ArrowUpRight className="w-4 h-4 text-zinc-500 shrink-0" />
      )}
    </>
  );
  const base =
    "flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-4 py-3 hover:border-blue-400/30 hover:bg-white/5 transition-colors";
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
