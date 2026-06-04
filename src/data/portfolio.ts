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
    github: "https://github.com/ZainulArkaanAlinsi",
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
// `github` points to the real repos under github.com/ZainulArkaanAlinsi.
const GH = "https://github.com/ZainulArkaanAlinsi";

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
    category: "Web · Admin Dashboard",
    summary:
      "A web-based employee attendance system for the J&T Martapura branch. Staff attendance across working days is recorded and monitored by admins through a real-time dashboard.",
    impact:
      "Replaced manual attendance with a monitored dashboard — admins track daily presence and recaps at a glance.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "REST API"],
    accent: "from-blue-500 to-cyan-400",
    github: `${GH}/ABSENSI-KARYAWAN-JNT-MARTAPURA`,
  },
  {
    name: "Hotel Booking Website",
    year: "2025",
    category: "Web App",
    summary:
      "A hotel room-booking platform built with Laravel — detailed room info, online and offline reservations, and tools that help the business reach more customers.",
    impact:
      "Turned room booking into a complete online flow while still supporting offline reservations.",
    stack: ["Laravel", "PHP", "MySQL"],
    accent: "from-cyan-400 to-emerald-400",
    github: `${GH}/laravel-booking-website`,
  },
  {
    name: "E-Libro",
    year: "2025",
    category: "Mobile App",
    summary:
      "A Flutter app for a reading room / library — browse the catalogue, borrow books, and keep track of reading in a clean, focused mobile UI.",
    impact:
      "Made borrowing and tracking books simple straight from a phone.",
    stack: ["Flutter", "Dart", "Firebase"],
    accent: "from-violet-400 to-blue-500",
    github: `${GH}/peminjaman_tempat_baca-buku`,
  },
  {
    name: "News App",
    year: "2025",
    category: "Mobile App",
    summary:
      "A Flutter news reader that pulls the latest headlines from selected countries via a live news API — browse, search, and read full articles.",
    impact:
      "Delivered fresh, country-filtered headlines with a smooth, readable flow.",
    stack: ["Flutter", "Dart", "REST API"],
    accent: "from-emerald-400 to-cyan-400",
    github: `${GH}/NEWS_APP_2025`,
  },
  {
    name: "Qur'an App",
    year: "2025",
    category: "Mobile App",
    summary:
      "A clean Flutter Qur'an app for reading surahs on mobile, with the interface continually being refined for a calmer reading experience.",
    impact:
      "A calm, focused Qur'an reading experience for daily use.",
    stack: ["Flutter", "Dart", "REST API"],
    accent: "from-violet-400 to-emerald-400",
    github: `${GH}/Qur-an_App`,
  },
] as const;
