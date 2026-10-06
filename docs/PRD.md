# PRD — Portofolio Zainul Arkaan

> Dokumen acuan untuk semua perubahan di portofolio ini. Baca dulu sebelum
> revisi, dan perbarui dokumen ini setiap kali ada keputusan baru.
> Terakhir diperbarui: 6 Oktober 2026.

Label yang dipakai:
- **[Keputusan]** sudah disepakati, jangan diubah tanpa permintaan baru.
- **[Asumsi]** belum dikonfirmasi pemilik, perlu dicek.
- **[Terbuka]** masih harus diputuskan.

---

## 1. Ringkasan

Situs portofolio pribadi Zainul Arkaan Al Insi, Full-Stack & Mobile Developer
(Next.js, Laravel, Flutter), siswa PPLG SMK IDN Bogor, saat ini magang di PT Sidik.

- Live: https://my-zainaril-portofolio-one.vercel.app
- Repo: `ZainulArkaanAlinsi/MY-PORTOFOLIO`, branch `main`
- Satu halaman utama (`/`) dengan beberapa section, tiga bahasa (ID/EN/AR), mode terang/gelap.

## 2. Tujuan

1. Pengunjung paham dalam beberapa detik: siapa Zainul, bisa apa, dan proyek terbaiknya.
2. Pengunjung mudah mengunduh CV dan menghubungi (email, LinkedIn, GitHub).
3. Proyek ditampilkan jujur, sesuai isi repo sebenarnya.
4. Situs terasa rapi dan profesional, tidak terlihat seperti template AI.
5. Situs tetap ringan, termasuk di HP.

## 3. Audiens

- **[Asumsi]** Utama: rekruter/HR untuk magang dan pekerjaan junior developer.
- **[Asumsi]** Kedua: calon klien freelance (status di profil: "Available for internships & freelance").
- **[Asumsi]** Ketiga: guru, pembimbing, dan teman sekolah.

Yang dicari audiens: proyek nyata, tech stack, pengalaman, sertifikat, CV, kontak.

## 4. Struktur halaman

Urutan section di `/` (komponen utama: `src/components/immersive/ImmersivePortfolio.tsx`):

| # | Section | Isi | Komponen |
|---|---------|-----|----------|
| 0 | Preloader | Animasi pembuka singkat | `Preloader.tsx` |
| 1 | Hero (`#top`) | Nama, peran, CTA (Lihat proyek, Kontak, Unduh CV), komputer retro 3D | `RetroComputer3D.tsx` |
| 2 | Marquee | Pita statistik dan teknologi | `Marquee.tsx` |
| 3 | About | Gaya koran: headline, bio, fact box, pull quote, polaroid, daily tools | `AboutNewspaper.tsx` |
| 4 | Skills (`#skills`) | Kategori skill di laptop dan HP CSS | `SkillStudio.tsx` |
| 5 | Work (`#work`) | Proyek unggulan dengan cover 2:1 | data `featuredProjects` |
| 6 | Journey (`#journey`) | Pengalaman, pendidikan, sertifikat | data `experience`, `education`, `certifications` |
| 7 | Contact (`#contact`) | Kartu pos airmail, salin email | `ContactPostcard.tsx` |

Navigasi: nav atas (desktop, `.nav-solid`) dan `MobileNav.tsx` (di bawah `lg`).
Isi nav: About, Skills, Work, Journey, Contact, Resume. **[Keputusan]** Link "Website" sudah dihapus.

**[Keputusan]** Hanya ada satu halaman (`/`) dan endpoint `/api/webhooks/github`. Route demo lama sudah dihapus pada 6 Oktober 2026. Jangan buat halaman demo baru di repo ini.

## 5. Konten

### Sumber data
- **[Keputusan]** Semua konten statis ada di `src/data/portfolio.ts`. Komponen tidak boleh menyimpan teks konten sendiri.
- **[Keputusan]** Semua teks UI dan terjemahan ada di `src/i18n/dict.ts`. Setiap teks baru wajib ditambahkan ke ketiga bahasa (ID, EN, AR). TypeScript memaksa bentuknya sama.
- Data dinamis (proyek, pengalaman, pendidikan, sertifikat) diterjemahkan per index di `dict.ts`. Jika urutan di `portfolio.ts` berubah, urutan di `dict.ts` juga harus ikut.
- Daftar repo GitHub diambil lewat `src/lib/github.ts`, halaman di-cache ISR 1 jam (`revalidate = 3600`).

### Aturan isi
- **[Keputusan]** Deskripsi proyek harus sesuai isi repo. Jangan klaim fitur atau teknologi yang tidak ada di repo.
- **[Keputusan]** Tidak boleh ada statistik, testimoni, atau logo klien palsu.
- **[Keputusan]** Urutan proyek unggulan: SIDIK (CertiCal) pertama, lalu JNE, Hotel Booking, E-Libro, News App, MyQuran.
- **[Keputusan]** Proyek JNE dikerjakan bertiga dan repo-nya di akun kolaborator. Sebutkan sebagai kerja tim.
- **[Keputusan]** CV = `public/cv.pdf`, disalin dari PDF milik pemilik. **Jangan** jalankan `npm run cv`, karena perintah itu menimpa CV asli.
- **[Keputusan]** Pengalaman dan pendidikan mengikuti CV terbaru. Bagian "Freelance Full-Stack Developer · Client Projects" sudah dihapus.
- Sertifikat yang punya scan disimpan di `public/certs/` (`<nama>.webp` dan `<nama>-full.webp`). Sertifikat tanpa scan tampil sebagai daftar ringkas.
- Cover proyek disimpan di `public/covers/` (WebP, rasio 2:1). Jika cover tidak ada, tampilan memakai kartu GitHub (`RepoShot.tsx`).

### Aset
| Aset | Lokasi |
|------|--------|
| Foto profil | `public/arkan.png`, `public/arkaan22.png` |
| Cover proyek | `public/covers/*.webp` |
| Sertifikat | `public/certs/*.webp` |
| Logo sekolah | `public/education/idn.webp` |
| CV | `public/cv.pdf` |
| Logo teknologi | CDN simple-icons (`TechIcon.tsx`), butuh internet |

## 6. Desain

### Arah visual (berlaku sejak 5 Oktober 2026)
- **[Keputusan]** Flat editorial: kertas, tinta, dan satu aksen hijau botol.
- **[Keputusan]** Hindari "warna AI": gradien biru/ungu, glow, teks bergradien, efek ping/halo, aurora.

| Token | Nilai | Peran |
|-------|-------|-------|
| Kertas (background) | `#f5f4f0` | Permukaan utama |
| Tinta (teks) | `#161616` | Teks utama |
| Aksen `--santa-fe` | `#1f5c45` | Satu-satunya warna aksen |
| Aksen mode gelap | `#8fbfa8` | Teks aksen di mode gelap |
| Netral | graphite | Garis, teks sekunder |

- Palet diatur terpusat di `src/app/globals.css` (blok `@theme` dan blok "FLAT EDITORIAL PASS"). Nama variabel lama (`--santa-fe`, dll.) sengaja dipertahankan.
- Ramp warna blue/cyan/violet/emerald di `@theme` diarahkan ke hijau yang sama, jadi class lama ikut berubah.
- Pengecualian: layar CRT amber di `RetroComputer3D` dibiarkan.

### Tipografi
- Display: **Sora**. Serif: **Lora**. Body: **DM Sans**.
- **[Keputusan]** Unbounded dan Playfair ditolak karena "terlalu desain".

### Prinsip UX yang wajib diterapkan di semua section
Visual hierarchy, white space, visual balance, alignment, consistency,
information architecture, visual rhythm, cognitive load rendah, Fitts's law,
Hick's law, progressive disclosure, dan grid 8pt (spacing kelipatan 8).

Penerapannya:
- Satu fokus utama per section.
- Satu CTA utama, maksimal dua CTA sekunder.
- Detail panjang dipindah ke section lain, jangan menumpuk di hero.
- Pakai ulang chip, kartu, font, dan warna yang sudah ada.

### Gerak
- Animasi pakai GSAP, Lenis, dan Framer Motion.
- **[Keputusan]** Saat `prefers-reduced-motion`, animasi berat dimatikan.

## 7. Kebutuhan non-fungsional

### Performa (wajib)
- **[Keputusan]** Situs harus tetap ringan. Setiap widget 3D atau interaktif baru dianggap risiko performa.
- Hero 3D: render berhenti saat di luar layar dan saat tab tidak aktif. FPS maksimal 30 di HP dan 60 di desktop. Tanpa realtime shadow.
- **[Keputusan]** DPR hero jangan diturunkan di bawah 2 di HP, karena gambar jadi pecah.
- Di perangkat sentuh (`pointer: coarse`), `backdrop-filter` dan efek grain dimatikan.
- Jika HP masih berat, langkah berikutnya: matikan hero WebGL di perangkat sentuh.

### Aksesibilitas
- Navigasi keyboard dan fokus terlihat.
- Kontras teks cukup di mode terang dan gelap.
- Bahasa Arab tampil RTL dengan benar.
- Elemen dekoratif diberi `aria-hidden`.

### Bahasa dan tema
- Tiga bahasa: ID, EN, AR (RTL). Mode terang dan gelap.
- Pilihan bahasa dan tema disimpan di `localStorage`. Script `BOOT` di `layout.tsx` mencegah kedipan saat halaman dimuat.

### SEO
- Title: "Zainul Arkaan | Full-Stack Web & Mobile Developer".
- Metadata diatur di `src/app/layout.tsx`.

## 8. Teknis

| Item | Nilai |
|------|-------|
| Framework | Next.js 16.2.6 (Turbopack, React Compiler aktif) |
| React | 19.2.4 |
| Styling | Tailwind CSS v4 |
| Animasi | GSAP 3, Lenis, Framer Motion 12, Three.js 0.160 |
| Ikon | lucide-react, simple-icons CDN |
| Analytics | `@vercel/analytics` |
| Hosting | Vercel, project `my-portofolio` |

- Next.js versi ini punya perubahan besar. Baca `node_modules/next/dist/docs/` sebelum menulis kode (lihat `AGENTS.md`).
- Env server: `GITHUB_TOKEN` (opsional, fetch repo; belum di-set di Vercel), `GITHUB_WEBHOOK_SECRET` (wajib agar webhook aktif; tanpa ini endpoint menjawab 503).

### Deploy
- Push ke `main` = deploy produksi otomatis di Vercel.
- **[Keputusan]** Jangan push atau deploy tanpa izin pemilik.
- File lokal yang tidak boleh di-commit: lihat `CLAUDE.local.md` (graphify, `gpt.py`, `image.png`, screenshot di `scripts/`).

## 9. Alur kerja revisi

Tujuannya agar revisi tidak berulang-ulang.

### Cara meminta revisi
Sebutkan tiga hal:
1. **Bagian mana**: section atau komponen (misalnya "Work, kartu SIDIK").
2. **Apa yang salah atau kurang**: kalau bisa sertakan screenshot.
3. **Hasil yang diinginkan**: contoh, referensi, atau kata kunci gaya.

### Yang Claude lakukan
1. Baca PRD ini dan cek apakah permintaan bertentangan dengan **[Keputusan]**.
2. Jika bertentangan, tanyakan dulu. Jika tidak, langsung kerjakan.
3. Kerjakan perubahan sekecil mungkin yang menyelesaikan masalah.
4. Verifikasi (lihat Definition of Done).
5. Perbarui PRD jika ada keputusan baru (bagian 5, 6, atau 12).

### Definition of Done
- `npm run lint` lulus.
- `npm run build` lulus.
- Screenshot desktop dan mobile dicek dengan Playwright. Set `reducedMotion: 'no-preference'` agar animasi ikut teruji.
- Tiga bahasa dan mode gelap/terang dicek untuk section yang berubah.
- Tidak ada warna atau efek yang melanggar bagian 6.
- Setelah push (dengan izin), cek deploy Vercel berstatus READY dan situs live sudah berubah.

## 10. Di luar cakupan

- Blog atau CMS.
- Form kontak dengan backend (kontak cukup lewat email, LinkedIn, GitHub).
- Login atau area admin.
- Domain kustom (**[Terbuka]**, lihat backlog).

## 11. Backlog dan pertanyaan terbuka

| # | Item | Status |
|---|------|--------|
| 1 | Route demo `/classic`, `/scroll-demo`, `/skills-demo`, `/skills-grid`, `/about` sudah dihapus beserta komponen yang hanya dipakai route itu. | Selesai (6 Okt 2026) |
| 2 | Webhook `src/app/api/webhooks/github/route.ts` sekarang memverifikasi HMAC-SHA256 dan menolak request jika `GITHUB_WEBHOOK_SECRET` tidak di-set (503). Di Vercel secret belum di-set dan hook GitHub belum dibuat, jadi endpoint tertutup; halaman tetap segar lewat ISR 1 jam. Aktifkan hanya jika perlu refresh instan. | Selesai (6 Okt 2026) |
| 3 | `profile.social.website` (`zainularkaan.dev`) masih ada di data tapi tidak dipakai. Domain ini dimiliki atau tidak? | **[Terbuka]** |
| 4 | Angka statistik (`yearsExperience: 3`, `projectsCompleted: 18`, `technologiesMastered: 12`, `hoursCoding: 1200`) dan persentase skill perlu dikonfirmasi agar tidak termasuk "statistik palsu". | **[Terbuka]** |
| 5 | Pengalaman "Independent Projects" dan "Self-directed Learning" masih ada. Apakah tetap sesuai CV terbaru? | **[Terbuka]** |
| 6 | Field `accent` (gradien) di `featuredProjects` sisa desain lama. Bisa dibersihkan jika tidak dipakai. | **[Terbuka]** |
| 7 | `README.md` masih sangat singkat. | **[Terbuka]** |
| 8 | Konfirmasi audiens utama (bagian 3). | **[Asumsi]** |

## 12. Riwayat keputusan

| Tanggal | Keputusan |
|---------|-----------|
| Jul 2026 | 12 prinsip UX diterapkan di semua section. Situs wajib ringan. |
| Jul 2026 | Hero diganti jadi komputer retro 3D interaktif (`RetroComputer3D`). |
| Jul 2026 | Font Sora, Lora, DM Sans. Unbounded dan Playfair ditolak. |
| Jul 2026 | Tiga bahasa (ID/EN/AR) dan mode gelap/terang. |
| 5 Okt 2026 | Proyek SIDIK ditambahkan sebagai proyek pertama, lengkap dengan cover dan sertifikat asli. |
| 5 Okt 2026 | Palet navy ditolak ("warna AI"). Diganti flat editorial: kertas, tinta, hijau botol. |
| 5 Okt 2026 | Link Website dihapus dari menu. |
| 5 Okt 2026 | CV, pendidikan, dan pengalaman disesuaikan dengan CV terbaru. |
| 6 Okt 2026 | PRD ini dibuat. |
| 6 Okt 2026 | Webhook GitHub memverifikasi HMAC-SHA256 dan tertutup jika secret tidak ada. |
| 6 Okt 2026 | Route demo dan komponen lamanya dihapus (`PortfolioClient`, `components/ui/`, `components/gitstats/`, `data/profile.json`, `getGithubUserStats`). |
