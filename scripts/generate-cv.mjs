// Generates public/cv.pdf — a clean, ATS-friendly résumé built from the
// portfolio content. Run with: npm run cv
//
// NOTE: the data below mirrors src/data/portfolio.ts. If you update the
// portfolio content, update it here too and re-run `npm run cv`.

import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'cv.pdf');

const data = {
  name: 'Zainul Arkaan Al Insi',
  title: 'Full-Stack & Mobile Developer',
  email: 'zainaril13@gmail.com',
  phone: '+62 852 8254 0833',
  location: 'Bekasi, Indonesia',
  github: 'github.com/ZainulArkaanAlinsi',
  linkedin: 'linkedin.com/in/zainul-arkaan-3bb51731a',
  summary:
    'Full-stack and mobile developer currently in IDN Boarding School’s Software Engineering program. I build fast, accessible, well-architected products across Next.js, Laravel, and Flutter — from polished marketing sites to production-grade dashboards and cross-platform mobile apps with real-time backends.',
  skillGroups: [
    { label: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
    { label: 'Backend', items: ['Laravel', 'PHP', 'Node.js', 'REST APIs'] },
    { label: 'Mobile & Cloud', items: ['Flutter', 'Dart', 'Firebase', 'Supabase'] },
    { label: 'Tools', items: ['Git', 'Figma', 'Realtime DB', 'Geofencing'] },
  ],
  experience: [
    {
      role: 'Workshop Instructor',
      company: 'Ar Rasyad & Al Kahfi School',
      period: '2024 — 2025',
      desc: 'Designed and taught a hands-on programming curriculum (HTML, CSS, JavaScript) for junior-high students, including live coding demos and small group projects.',
    },
    {
      role: 'Full-Stack Developer',
      company: 'Independent Projects',
      period: '2025',
      desc: 'Shipped multiple production-style projects across Next.js, Laravel, and Flutter — from admin dashboards to mobile attendance apps with offline sync.',
    },
    {
      role: 'Mobile Engineering',
      company: 'Self-directed Learning',
      period: '2025',
      desc: 'Completed a certified Flutter & Firebase track, re-implementing ride-sharing patterns (inDrive / Uber clones) with real-time location, auth, and payment flows.',
    },
  ],
  projects: [
    {
      name: 'Absensi Karyawan JNT Martapura',
      stack: 'Flutter · Firebase · Geofencing · REST API',
      desc: 'Production attendance system for the J&T Martapura branch: a Flutter app for staff check-in with geofencing and biometric verification, plus an admin dashboard for live monitoring and reporting.',
    },
    {
      name: 'Booking App',
      stack: 'Flutter · Firebase · Realtime DB',
      desc: 'Cross-platform booking and reservation app with real-time availability, scheduling, and a clean flow from selection to confirmation.',
    },
    {
      name: 'E-libro',
      stack: 'Flutter · Firebase · REST API',
      desc: 'Digital library platform to browse, search, and read e-books with categorized collections and a focused reading experience.',
    },
    {
      name: 'Qur’an App',
      stack: 'Flutter · REST API · Audio',
      desc: 'Qur’an companion with full surah text, audio recitation, translations, and bookmarking — built on an open Qur’an REST API.',
    },
  ],
  education: [
    {
      school: 'IDN Boarding School',
      program: 'Software Engineering Specialist Program',
      period: '2023 — Present',
      desc: 'Intensive program focused on full-stack development, mobile engineering, and product thinking.',
    },
  ],
  certifications: [
    { title: 'Fullstack Web Development', issuer: 'Flexible Kickstart Journal', year: '2025' },
    { title: 'Flutter & Firebase Developer', issuer: 'Certified Program', year: '2025' },
    { title: 'Belajar Dasar Pemrograman Web', issuer: 'Dicoding Indonesia', year: '2025' },
    { title: 'Belajar Membuat Front-End Web', issuer: 'Dicoding Indonesia', year: '2024' },
  ],
  languages: [
    { name: 'Indonesian', level: 'Native' },
    { name: 'Arabic', level: 'Fluent' },
    { name: 'English', level: 'Intermediate' },
  ],
};

// ----- palette (matches the site's warm theme) -----
const INK = '#451d07'; // rebel
const ACCENT = '#d12323'; // cardinal
const BODY = '#5a4632';
const MUTED = '#9a8470';
const RULE = '#e7dccb';

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 52, bottom: 54, left: 56, right: 56 },
  info: { Title: `${data.name} — Resume`, Author: data.name },
  compress: process.env.CV_NOCOMPRESS ? false : true,
});
doc.pipe(fs.createWriteStream(OUT));

const L = doc.page.margins.left;
const R = doc.page.width - doc.page.margins.right;
const W = R - L;
const BOTTOM = doc.page.height - doc.page.margins.bottom;

function ensure(space) {
  if (doc.y + space > BOTTOM) doc.addPage();
}

function sectionHeader(title) {
  ensure(46);
  doc.moveDown(0.7);
  doc
    .fillColor(ACCENT)
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .text(title.toUpperCase(), L, doc.y, { characterSpacing: 1.6 });
  const y = doc.y + 3;
  doc.moveTo(L, y).lineTo(R, y).lineWidth(1).strokeColor(RULE).stroke();
  doc.moveDown(0.55);
}

// ----- header -----
doc.fillColor(INK).font('Helvetica-Bold').fontSize(27).text(data.name, L, doc.y);
doc.fillColor(ACCENT).font('Helvetica').fontSize(12.5).text(data.title, { characterSpacing: 0.5 });
doc.moveDown(0.45);
const contact = [data.email, data.phone, data.location, data.github, data.linkedin].join('   |   ');
doc.fillColor(MUTED).font('Helvetica').fontSize(8.6).text(contact, { width: W, lineGap: 2 });
doc.moveDown(0.2);
doc.moveTo(L, doc.y).lineTo(R, doc.y).lineWidth(1.4).strokeColor(INK).stroke();

// ----- summary -----
sectionHeader('Profile');
doc.fillColor(BODY).font('Helvetica').fontSize(9.8).text(data.summary, L, doc.y, { width: W, lineGap: 2.5, align: 'justify' });

// ----- skills -----
sectionHeader('Core Skills');
for (const g of data.skillGroups) {
  ensure(20);
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(INK).text(`${g.label}:  `, L, doc.y, { continued: true });
  doc.font('Helvetica').fillColor(BODY).text(g.items.join('  ·  '));
  doc.moveDown(0.18);
}

// ----- experience -----
sectionHeader('Experience');
for (const e of data.experience) {
  ensure(58);
  doc.font('Helvetica-Bold').fontSize(11).fillColor(INK).text(e.role, L, doc.y, { continued: true });
  doc.font('Helvetica').fillColor(MUTED).fontSize(9).text(`   ${e.period}`);
  doc.font('Helvetica-Oblique').fontSize(9.5).fillColor(ACCENT).text(e.company);
  doc.moveDown(0.12);
  doc.font('Helvetica').fontSize(9.5).fillColor(BODY).text(e.desc, { width: W, lineGap: 2 });
  doc.moveDown(0.5);
}

// ----- projects -----
sectionHeader('Selected Projects');
for (const p of data.projects) {
  ensure(52);
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(INK).text(p.name, L, doc.y);
  doc.font('Helvetica-Oblique').fontSize(8.6).fillColor(MUTED).text(p.stack);
  doc.moveDown(0.1);
  doc.font('Helvetica').fontSize(9.3).fillColor(BODY).text(p.desc, { width: W, lineGap: 1.8 });
  doc.moveDown(0.45);
}

// ----- education -----
sectionHeader('Education');
for (const ed of data.education) {
  ensure(46);
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(INK).text(ed.school, L, doc.y, { continued: true });
  doc.font('Helvetica').fillColor(MUTED).fontSize(9).text(`   ${ed.period}`);
  doc.font('Helvetica-Oblique').fontSize(9.5).fillColor(ACCENT).text(ed.program);
  doc.moveDown(0.12);
  doc.font('Helvetica').fontSize(9.3).fillColor(BODY).text(ed.desc, { width: W, lineGap: 1.8 });
  doc.moveDown(0.3);
}

// ----- certifications -----
sectionHeader('Certifications');
for (const c of data.certifications) {
  ensure(18);
  doc.font('Helvetica-Bold').fontSize(9.6).fillColor(INK).text(`${c.title}  `, L, doc.y, { continued: true });
  doc.font('Helvetica').fillColor(BODY).text(`— ${c.issuer}  `, { continued: true });
  doc.fillColor(MUTED).text(`(${c.year})`);
  doc.moveDown(0.12);
}

// ----- languages -----
sectionHeader('Languages');
ensure(18);
const langs = data.languages.map((l) => `${l.name} (${l.level})`).join('     ·     ');
doc.font('Helvetica').fontSize(9.6).fillColor(BODY).text(langs, L, doc.y);

doc.end();

doc.on('end', () => {});
process.on('exit', () => console.log(`Wrote ${OUT}`));
