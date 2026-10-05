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

export const education: {
  period: string;
  school: string;
  program: string;
  description: string;
  // Foto sekolah/kampus. Isi path-nya nanti, mis. "/education/idn.jpg"
  // (taruh file-nya di folder /public). Kosongkan untuk pakai placeholder.
  image?: string;
  // Set for a logo (not a photo): the image is contained, centred on this
  // colour, instead of cropped to fill the panel.
  imageBg?: string;
}[] = [
  {
    period: "2023 — Present",
    school: "IDN Boarding School",
    program: "Software Engineering Specialist Program",
    description:
      "Intensive program focused on full-stack development, mobile engineering, and product thinking.",
    image: "/education/idn.webp",
    imageBg: "#5c86f6",
  },
];

export const experience = [
  {
    period: "2026 — Present",
    company: "PT Sidik (PT Sistem Dirgantara Inovasi Teknologi)",
    role: "Software Development Intern",
    description:
      "Building CertiCal for an ISO/IEC 17025-accredited calibration lab: a Laravel + Filament API and a Flutter app that record calibrations, compute measurement uncertainty (GUM) and issue QR-verified PDF certificates, shipped through a tested GitHub Actions pipeline.",
    tags: ["Laravel", "Flutter", "MySQL", "GitHub Actions"],
  },
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

export const certifications: {
  year: string;
  title: string;
  issuer: string;
  grade: string;
  link: string;
  // Scan of the certificate in /public. Credentials without one are listed
  // compactly under the framed ones instead of showing an empty frame.
  image?: string;
}[] = [
  {
    year: "2025",
    title: "Fullstack Web Development",
    issuer: "Rakamin Academy · Flexible Kickstart Journey",
    grade: "Excellent",
    link: "/certs/rakamin-fullstack-full.webp",
    image: "/certs/rakamin-fullstack.webp",
  },
  {
    year: "2026",
    title: "Node.js (Intermediate)",
    issuer: "HackerRank",
    grade: "Verified",
    link: "https://www.hackerrank.com/certificates/932a4c3d18e1",
    image: "/certs/hackerrank-nodejs.webp",
  },
  {
    year: "2026",
    title: "Cyber Security: Understand Threats and Prevent Attacks",
    issuer: "Alison",
    grade: "Completed",
    link: "https://alison.com/verify/4cd1189e9f",
    image: "/certs/alison-cybersecurity.webp",
  },
  {
    year: "2025",
    title: "Introduction to JavaScript",
    issuer: "Great Learning Academy",
    grade: "Completed",
    link: "https://www.mygreatlearning.com/certificate/KBJQAIAL",
    image: "/certs/greatlearning-js.webp",
  },
  {
    year: "2025",
    title: "Flutter & Firebase Mobile Developer",
    issuer: "Rakamin Academy · Flexible Kickstart Journey",
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
];

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
  // 2:1 cover in /public/work. Falls back to the repo's GitHub card.
  image?: string;
};

export const featuredProjects: readonly FeaturedProject[] = [
  {
    name: "SIDIK Calibration (CertiCal)",
    year: "2026",
    category: "Internship · Laravel API + Flutter",
    summary:
      "The calibration system for PT Sidik, an ISO/IEC 17025-accredited lab. Technicians fill digital worksheets on a Flutter app; a Laravel + Filament API recomputes every figure (GUM uncertainty, ILAC-G8 decision rules) from raw readings, routes it through review, and issues PDF certificates with a public QR verification page.",
    impact:
      "Replaced Excel workbooks and hand-made certificates with one audited flow — output was checked against the lab's master data and every figure matched.",
    stack: ["Laravel", "Flutter", "MySQL", "Filament"],
    accent: "from-blue-600 to-cyan-500",
    github: `${GH}/sidik-calibration-api`,
    image: "/work/sidik.webp",
  },
  {
    name: "Absensi Karyawan JNE Martapura",
    year: "2026",
    category: "Mobile + Web · Attendance System",
    summary:
      "A face-recognition and GPS attendance system for JNE, built with a team of three. Staff clock in from a Flutter Android app that verifies their face and location, while HR follows the day live on a Next.js dashboard, all on a Firebase Firestore + Cloud Functions backend.",
    impact:
      "Turned attendance into something provable rather than reported — a check-in has to match a face and a place, and HR gets the daily recap without chasing anyone.",
    stack: ["Flutter", "Next.js", "Firebase", "TypeScript"],
    accent: "from-blue-500 to-cyan-400",
    // Lives under the collaborator's account, not `GH` — this one was built
    // with two other people (see the repo's contributors).
    github: "https://github.com/NabihanN06/jne_attandance",
    image: "/work/jne.webp",
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
    image: "/work/hotel.webp",
  },
  {
    name: "E-Libro",
    year: "2025",
    category: "Mobile App",
    summary:
      "A Flutter app for a library / reading room — create an account, browse the catalogue, borrow a title and read it in the app's own reader, with the catalogue and accounts served over a REST API.",
    impact:
      "Put the whole loop — find a book, borrow it, read it — on a phone, with nothing to hand back at a counter.",
    // Not Firebase: this app has no Firebase dependency at all. It talks to a
    // REST API through `http` and keeps session state in shared_preferences.
    stack: ["Flutter", "Dart", "REST API"],
    accent: "from-violet-400 to-blue-500",
    github: `${GH}/peminjaman_tempat_baca-buku`,
    image: "/work/elibro.webp",
  },
  {
    name: "News App",
    year: "2025",
    category: "Mobile App",
    summary:
      "A Flutter news reader pulling live headlines from selected countries — trending and latest feeds, search, saved favourites, and the full article one tap away.",
    impact:
      "Delivered fresh, country-filtered headlines with a smooth, readable flow — and a place to keep the ones worth coming back to.",
    stack: ["Flutter", "Dart", "REST API"],
    accent: "from-emerald-400 to-cyan-400",
    github: `${GH}/NEWS_APP_2025`,
    image: "/work/news.webp",
  },
  {
    name: "MyQuran",
    year: "2025",
    category: "Mobile App",
    summary:
      "A Flutter Qur'an app for reading and listening — surah text alongside audio recitation, with search and bookmarks, in a calm interface that keeps being refined.",
    impact:
      "A quiet place to read or listen daily, and to pick up exactly where the last session ended.",
    stack: ["Flutter", "Dart", "REST API"],
    accent: "from-violet-400 to-emerald-400",
    github: `${GH}/Qur-an_App`,
    image: "/work/quran.webp",
  },
] as const;
