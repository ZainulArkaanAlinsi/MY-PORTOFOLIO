// Single source of truth for all static portfolio content.
// UI components read from here so content can change without touching JSX.

export const profile = {
  name: "Zainul Arkaan Al Insi",
  shortName: "Zainul Arkaan",
  initials: "Z",
  handle: "ZAINUL.DEV",
  title: "Full-Stack & Mobile Developer",
  tagline:
    "I design and ship modern web and mobile products with Next.js, Laravel, and Flutter.",
  bio: "Currently studying at IDN Boarding School's Software Engineering program. I focus on building fast, accessible, and well-architected applications — from polished marketing sites to production-grade dashboards and cross-platform mobile apps.",
  location: "Bekasi, Indonesia",
  email: "zainaril13@gmail.com",
  phone: "+62 852 8254 0833",
  cv: "/cv.pdf",
  avatar: "/arkan.png",
  social: {
    github: "https://github.com/zainularkaan",
    linkedin:
      "https://www.linkedin.com/in/zainul-arkaan-3bb51731a/",
    website: "https://zainularkaan.dev",
  },
  availability: "Available for internships & freelance",
  yearsExperience: 3,
} as const;

export const education = [
  {
    period: "2023 — Present",
    school: "IDN Boarding School",
    program: "Software Engineering Specialist Program",
    description:
      "Intensive program focused on full-stack development, mobile engineering, and product thinking.",
  },
] as const;

export const experience = [
  {
    period: "2024 — 2025",
    company: "Ar Rasyad & Al Kahfi School",
    role: "Workshop Instructor",
    description:
      "Designed and taught a hands-on programming curriculum (HTML, CSS, JavaScript) for junior-high students, including live coding demos and small group projects.",
    tags: ["Teaching", "HTML", "CSS", "JavaScript"],
  },
  {
    period: "2025",
    company: "Independent Projects",
    role: "Full-Stack Developer",
    description:
      "Shipped multiple production-style projects across Next.js, Laravel, and Flutter — from admin dashboards to mobile attendance apps with offline sync.",
    tags: ["Next.js", "Laravel", "Flutter", "Firebase"],
  },
  {
    period: "2025",
    company: "Self-directed Learning",
    role: "Mobile Engineering",
    description:
      "Completed certified Flutter & Firebase track, re-implementing ride-sharing patterns (inDrive / Uber clones) with real-time location, auth, and payments flows.",
    tags: ["Flutter", "Firebase", "Realtime"],
  },
] as const;

export const skillGroups = [
  {
    label: "Frontend",
    items: [
      { name: "Next.js", level: 95 },
      { name: "React", level: 88 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 92 },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Laravel", level: 86 },
      { name: "PHP", level: 84 },
      { name: "Node.js", level: 72 },
      { name: "REST APIs", level: 80 },
    ],
  },
  {
    label: "Mobile & Cloud",
    items: [
      { name: "Flutter", level: 80 },
      { name: "Dart", level: 78 },
      { name: "Firebase", level: 75 },
      { name: "Supabase", level: 65 },
    ],
  },
] as const;

export const tools = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Laravel",
  "PHP",
  "Flutter",
  "Dart",
  "Firebase",
  "Node.js",
  "Git",
  "Figma",
] as const;

export const expertise = [
  {
    label: "Frontend",
    value: 92,
    stack: "React · Next.js · Tailwind",
  },
  {
    label: "Backend",
    value: 85,
    stack: "Laravel · PHP · Node",
  },
  {
    label: "Mobile",
    value: 78,
    stack: "Flutter · Firebase",
  },
] as const;

export const softSkills = [
  "Fast learner",
  "Time management",
  "Clear communication",
  "Attention to detail",
  "Adaptability",
  "Team collaboration",
] as const;

export const languages = [
  { name: "Indonesian", level: 100, proficiency: "Native" },
  { name: "Arabic", level: 85, proficiency: "Fluent" },
  { name: "English", level: 65, proficiency: "Intermediate" },
] as const;

export const certifications = [
  {
    year: "2025",
    title: "Fullstack Web Development",
    issuer: "Flexible Kickstart Journal",
    grade: "Excellent",
    link: "https://www.linkedin.com/in/zainul-arkaan-3bb51731a/details/certifications/",
  },
  {
    year: "2025",
    title: "Flutter & Firebase Developer",
    issuer: "Certified Program",
    grade: "Completed",
    link: "https://www.linkedin.com/in/zainul-arkaan-3bb51731a/details/certifications/",
  },
  {
    year: "2025",
    title: "Belajar Dasar Pemrograman Web",
    issuer: "Dicoding Indonesia",
    grade: "Completed",
    link: "https://www.linkedin.com/in/zainul-arkaan-3bb51731a/details/certifications/",
  },
  {
    year: "2024",
    title: "Belajar Membuat Front-End Web",
    issuer: "Dicoding Indonesia",
    grade: "Completed",
    link: "https://www.linkedin.com/in/zainul-arkaan-3bb51731a/details/certifications/",
  },
] as const;

export const stats = {
  hoursCoding: 1200,
  projectsCompleted: 18,
  technologiesMastered: 12,
} as const;

// Curated, production-style projects — the headline work shown on the site.
// `github` points to the real repos under github.com/zainularkaan.
const GH = "https://github.com/zainularkaan";

export type FeaturedProject = {
  name: string;
  year: string;
  category: string;
  summary: string;
  impact: string;
  stack: readonly string[];
  accent: string; // gradient accent per card
  github: string;
  demo?: string;
};

export const featuredProjects: readonly FeaturedProject[] = [
  {
    name: "Absensi Karyawan JNT Martapura",
    year: "2026",
    category: "Mobile + Admin Dashboard",
    summary:
      "Production attendance system for the J&T Martapura branch — a Flutter mobile app for staff check-in with geofencing and biometric verification, paired with an admin dashboard for live monitoring and reporting.",
    impact:
      "Replaced manual paper attendance with real-time, location-verified check-ins and automated daily recaps for branch management.",
    stack: ["Flutter", "Firebase", "Geofencing", "REST API"],
    accent: "from-blue-500 to-cyan-400",
    github: `${GH}/ABSENSI-KARYAWAN-JNT-MARTAPURA`,
  },
  {
    name: "Booking App",
    year: "2025",
    category: "Mobile App",
    summary:
      "A cross-platform booking and reservation app with real-time availability, scheduling, and a clean booking flow from selection to confirmation.",
    impact:
      "Streamlined the full reservation journey into a few taps, with instant status updates backed by Firebase.",
    stack: ["Flutter", "Firebase", "Realtime DB"],
    accent: "from-cyan-400 to-emerald-400",
    github: `${GH}/Booking_App`,
  },
  {
    name: "E-libro",
    year: "2025",
    category: "Digital Library",
    summary:
      "A digital library platform to browse, search, and read e-books with categorized collections and a focused reading experience.",
    impact:
      "Made a full catalog of titles discoverable and readable on any device with a fast, distraction-free UI.",
    stack: ["Flutter", "Firebase", "REST API"],
    accent: "from-violet-400 to-blue-500",
    github: `${GH}/E-libro`,
  },
  {
    name: "News App",
    year: "2025",
    category: "Mobile App",
    summary:
      "A modern news reader consuming a live REST news API — category feeds, search, article detail views, and pull-to-refresh.",
    impact:
      "Delivered fresh, categorized headlines in real time with smooth infinite scrolling and offline-friendly caching.",
    stack: ["Flutter", "REST API", "Dart"],
    accent: "from-emerald-400 to-cyan-400",
    github: `${GH}/NEWS_APP_2025`,
  },
  {
    name: "Qur'an App",
    year: "2025",
    category: "Mobile App",
    summary:
      "A Qur'an companion app with full surah text, audio recitation, translations, and bookmarking — built on an open Qur'an REST API.",
    impact:
      "Combined reading, listening, and bookmarking into one calm, well-typeset experience for daily use.",
    stack: ["Flutter", "REST API", "Audio"],
    accent: "from-violet-400 to-emerald-400",
    github: `${GH}/Qur-an_App`,
  },
] as const;
