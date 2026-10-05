// All translatable content for the portfolio, in Indonesian / English / Arabic.
// Proper nouns (name, company/school names, tech names, project repo names)
// stay as-is; only descriptive text + UI labels are translated.

export type Lang = 'id' | 'en' | 'ar';

export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: 'id', label: 'ID', name: 'Bahasa Indonesia' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
];

export interface AppDict {
  nav: { about: string; skills: string; work: string; journey: string; contact: string; resume: string };
  hero: {
    greeting: string; role: string; subheadline: string;
    viewProjects: string; contactMe: string; downloadResume: string; buildingWith: string; scroll: string; dragRotate: string;
  };
  about: {
    volume: string; est: string; edition: string; tags: string;
    frontPage: string; headline: string; bylinePre: string; reportingFrom: string;
    standfirst: string; body: string[];
    factFile: string; labels: { based: string; role: string; focus: string; experience: string; status: string };
    experienceValue: string;
    pullQuote: string; dailyTools: string; recentDispatches: string; kickers: string[]; dragMe: string;
    statYears: string; statProjects: string; statTech: string;
  };
  skills: {
    kicker: string; headingPre: string; headingEm: string; note: string;
    categories: string[]; spotlight: string; topSkill: string; toolsTracked: string; operational: string; dragCard: string;
  };
  work: {
    kicker: string; headingPre: string; headingEm: string; more: string; all: string;
    spotlight: string; impact: string; viewCode: string; code: string; liveDemo: string;
    categories: string[]; summaries: string[]; impacts: string[];
  };
  journey: {
    kicker: string; headingPre: string; headingEm: string; certifications: string; education: string;
    grades: string[]; photoSlot: string; current: string;
    certsSub: string; eduSub: string; focus: string; eduFocus: string[];
  };
  contact: {
    kicker: string; headingPre: string; headingEm: string; paragraph: string; resume: string; footerNote: string; copy: string; copied: string;
    emailDirect: string; sendEmail: string; available: string;
  };
  statsBand: { years: string; projects: string; tech: string; certs: string };
  // shared dynamic content (by index, matching portfolio.ts arrays)
  exp: { role: string; description: string }[];
  edu: { program: string; description: string };
  languageNames: string[];
  proficiency: string[];
  preloader: string;
  availability: string;
}

const en: AppDict = {
  nav: { about: 'About', skills: 'Skills', work: 'Work', journey: 'Journey', contact: 'Contact', resume: 'Resume' },
  hero: {
    greeting: "Hi, I'm",
    role: 'Full-Stack & Mobile Developer',
    subheadline:
      'I build production-ready mobile and web applications — from Flutter apps with real-time Firebase backends to fast Next.js & Laravel platforms — crafting polished, reliable products from first sketch to deployment.',
    viewProjects: 'View Projects',
    contactMe: 'Contact Me',
    downloadResume: 'Download Resume',
    buildingWith: 'Building with',
    scroll: 'Scroll',
    dragRotate: 'Drag to rotate',
  },
  about: {
    volume: 'Vol. I — About',
    est: '★ Est. 2023 ★',
    edition: 'Portfolio Edition',
    tags: 'Full-Stack · Mobile · Web',
    frontPage: 'Front Page · About the Developer',
    headline: 'Turning ideas into products that actually ship.',
    bylinePre: 'By',
    reportingFrom: 'reporting from',
    standfirst: "Hi — I'm a developer who likes turning rough ideas into real, working software.",
    body: [
      "Currently studying Software and Game Development (PPLG) at SMK IDN Bogor. I focus on building fast, accessible, and well-architected applications — from polished marketing sites to production-grade dashboards and cross-platform mobile apps.",
      'My journey runs from teaching the fundamentals of the web to junior students, to building cross-platform mobile apps and full-stack dashboards used in the real world — attendance systems, booking flows, reader apps, and admin panels.',
      'I care about clean architecture, smooth interaction, and the unglamorous details — error states, offline sync, performance — that decide whether a product feels trustworthy. I work end to end: design, build, deploy, iterate.',
    ],
    factFile: 'Fact File',
    labels: { based: 'Based in', role: 'Role', focus: 'Focus', experience: 'Experience', status: 'Status' },
    experienceValue: '3+ years',
    pullQuote: 'Shipping things that actually work beats shipping things that merely look done.',
    dailyTools: 'Daily tools of the trade',
    recentDispatches: 'Recent Dispatches',
    kickers: ['Career', 'Teaching', 'Craft'],
    dragMe: 'drag me ✦',
    statYears: 'Years coding',
    statProjects: 'Projects built',
    statTech: 'Technologies',
  },
  skills: {
    kicker: 'Toolkit',
    headingPre: 'Skills &',
    headingEm: 'technologies',
    note: 'Pick a category on the laptop — the phone reacts with the top skill.',
    categories: ['Frontend', 'Backend', 'Mobile'],
    spotlight: 'Spotlight',
    topSkill: 'Top skill',
    toolsTracked: 'Tools tracked',
    operational: 'operational',
    dragCard: 'Drag or tap to flip',
  },
  work: {
    kicker: 'Selected work',
    headingPre: 'Featured',
    headingEm: 'projects',
    more: '+{n} more on GitHub',
    all: 'All on GitHub',
    spotlight: 'Spotlight',
    impact: 'Impact — ',
    viewCode: 'View Code',
    code: 'Code',
    liveDemo: 'Live demo',
    categories: ['Internship · Laravel API + Flutter', 'Mobile + Web · Attendance System', 'Web App', 'Mobile App', 'Mobile App', 'Mobile App'],
    summaries: [
      'The calibration system for PT Sidik, an ISO/IEC 17025-accredited lab. Technicians fill digital worksheets on a Flutter app; a Laravel + Filament API recomputes every figure (GUM uncertainty, ILAC-G8 decision rules) from raw readings, routes it through review, and issues PDF certificates with a public QR verification page.',
      'A face-recognition and GPS attendance system for JNE, built with a team of three. Staff clock in from a Flutter Android app that verifies their face and location, while HR follows the day live on a Next.js dashboard — all on a Firebase Firestore + Cloud Functions backend.',
      'A hotel room-booking platform built with Laravel — detailed room info, online and offline reservations, and tools that help the business reach more customers.',
      "A Flutter app for a library / reading room — create an account, browse the catalogue, borrow a title and read it in the app's own reader, with the catalogue and accounts served over a REST API.",
      'A Flutter news reader pulling live headlines from selected countries — trending and latest feeds, search, saved favourites, and the full article one tap away.',
      'A Flutter Qur’an app for reading and listening — surah text alongside audio recitation, with search and bookmarks, in a calm interface that keeps being refined.',
    ],
    impacts: [
      'Replaced Excel workbooks and hand-made certificates with one audited flow — output was checked against the lab’s master data and every figure matched.',
      'Turned attendance into something provable rather than reported — a check-in has to match a face and a place, and HR gets the daily recap without chasing anyone.',
      'Turned room booking into a complete online flow while still supporting offline reservations.',
      'Put the whole loop — find a book, borrow it, read it — on a phone, with nothing to hand back at a counter.',
      'Delivered fresh, country-filtered headlines with a smooth, readable flow — and a place to keep the ones worth coming back to.',
      'A quiet place to read or listen daily, and to pick up exactly where the last session ended.',
    ],
  },
  journey: {
    kicker: 'The journey',
    headingPre: 'Experience &',
    headingEm: 'credentials',
    certifications: 'Certifications',
    education: 'Education',
    grades: ['Excellent', 'Verified', 'Completed', 'Completed', 'Completed', 'Completed', 'Completed'],
    photoSlot: 'Photo coming soon',
    current: 'Ongoing',
    certsSub: 'Verified courses & credentials I have earned',
    eduSub: 'Where I am sharpening the craft',
    focus: 'Focus areas',
    eduFocus: ['Full-stack development', 'Mobile engineering', 'Product thinking'],
  },
  contact: {
    kicker: 'Get in touch',
    headingPre: "Let's build something",
    headingEm: 'great together.',
    paragraph:
      'Open to internships, freelance projects, and collaboration. The fastest way to reach me is email — I usually reply within a day.',
    resume: 'Resume',
    footerNote: 'Built with Next.js, Three.js & ☕',
    copy: 'Copy',
    copied: 'Copied!',
    emailDirect: 'Email me directly',
    sendEmail: 'Send email',
    available: 'Available',
  },
  statsBand: { years: 'Years building', projects: 'Projects shipped', tech: 'Technologies', certs: 'Certifications' },
  exp: [
    {
      role: 'Software Development Intern',
      description:
        'Building CertiCal for an ISO/IEC 17025-accredited calibration lab: a Laravel + Filament API and a Flutter app that record calibrations, compute measurement uncertainty (GUM) and issue QR-verified PDF certificates, shipped through a tested GitHub Actions pipeline.',
    },
    {
      role: 'Workshop Instructor',
      description:
        'Designed and taught a hands-on programming curriculum (HTML, CSS, JavaScript) for junior-high students, including live coding demos and small group projects.',
    },
    {
      role: 'Full-Stack Developer',
      description:
        'Shipped multiple production-style projects across Next.js, Laravel, and Flutter — from admin dashboards to mobile attendance apps with offline sync.',
    },
    {
      role: 'Mobile Engineering',
      description:
        'Completed a certified Flutter & Firebase track, re-implementing ride-sharing patterns (inDrive / Uber clones) with real-time location, auth, and payment flows.',
    },
  ],
  edu: {
    program: 'Software and Game Development (PPLG)',
    description: 'Intensive program focused on full-stack development, mobile engineering, and product thinking.',
  },
  languageNames: ['Indonesian', 'Arabic', 'English'],
  proficiency: ['Native', 'Fluent', 'Intermediate'],
  preloader: 'Loading experience',
  availability: 'Available for internships & freelance',
};

const id: AppDict = {
  nav: { about: 'Tentang', skills: 'Skill', work: 'Karya', journey: 'Perjalanan', contact: 'Kontak', resume: 'CV' },
  hero: {
    greeting: 'Halo, saya',
    role: 'Developer Full-Stack & Mobile',
    subheadline:
      'Saya membangun aplikasi mobile dan web siap produksi — dari aplikasi Flutter dengan backend Firebase real-time hingga platform Next.js & Laravel yang cepat — merancang produk yang rapi dan andal dari sketsa pertama sampai deployment.',
    viewProjects: 'Lihat Proyek',
    contactMe: 'Hubungi Saya',
    downloadResume: 'Unduh CV',
    buildingWith: 'Dibangun dengan',
    scroll: 'Gulir',
    dragRotate: 'Geser untuk memutar',
  },
  about: {
    volume: 'Vol. I — Tentang',
    est: '★ Sejak 2023 ★',
    edition: 'Edisi Portofolio',
    tags: 'Full-Stack · Mobile · Web',
    frontPage: 'Halaman Utama · Tentang Developer',
    headline: 'Mengubah ide menjadi produk yang benar-benar rilis.',
    bylinePre: 'Oleh',
    reportingFrom: 'melaporkan dari',
    standfirst: 'Halo — saya developer yang suka mengubah ide kasar menjadi software nyata yang berfungsi.',
    body: [
      'Saat ini menempuh jurusan Pengembangan Perangkat Lunak dan Gim (PPLG) di SMK IDN Bogor. Saya fokus membangun aplikasi yang cepat, aksesibel, dan ber-arsitektur baik — dari situs marketing yang rapi hingga dashboard skala produksi dan aplikasi mobile lintas platform.',
      'Perjalanan saya bermula dari mengajar dasar-dasar web ke siswa SMP, hingga membangun aplikasi mobile lintas platform dan dashboard full-stack yang dipakai nyata — sistem absensi, alur booking, aplikasi pembaca, dan panel admin.',
      'Saya peduli pada arsitektur yang bersih, interaksi yang mulus, dan detail tak mencolok — error state, sinkronisasi offline, performa — yang menentukan apakah produk terasa tepercaya. Saya bekerja menyeluruh: desain, bangun, deploy, iterasi.',
    ],
    factFile: 'Profil Singkat',
    labels: { based: 'Berbasis di', role: 'Peran', focus: 'Fokus', experience: 'Pengalaman', status: 'Status' },
    experienceValue: '3+ tahun',
    pullQuote: 'Merilis sesuatu yang benar-benar berfungsi lebih baik daripada yang sekadar terlihat selesai.',
    dailyTools: 'Alat andalan sehari-hari',
    recentDispatches: 'Catatan Terbaru',
    kickers: ['Karier', 'Mengajar', 'Keahlian'],
    dragMe: 'tarik aku ✦',
    statYears: 'Tahun ngoding',
    statProjects: 'Proyek dibuat',
    statTech: 'Teknologi',
  },
  skills: {
    kicker: 'Perkakas',
    headingPre: 'Skill &',
    headingEm: 'teknologi',
    note: 'Pilih kategori di laptop — HP menampilkan skill teratasnya.',
    categories: ['Frontend', 'Backend', 'Mobile'],
    spotlight: 'Sorotan',
    topSkill: 'Skill teratas',
    toolsTracked: 'Jumlah tools',
    operational: 'operasional',
    dragCard: 'Geser atau ketuk untuk ganti',
  },
  work: {
    kicker: 'Karya pilihan',
    headingPre: 'Proyek',
    headingEm: 'unggulan',
    more: '+{n} lagi di GitHub',
    all: 'Semua di GitHub',
    spotlight: 'Sorotan',
    impact: 'Dampak — ',
    viewCode: 'Lihat Kode',
    code: 'Kode',
    liveDemo: 'Demo',
    categories: ['Magang · Laravel API + Flutter', 'Mobile + Web · Sistem Absensi', 'Aplikasi Web', 'Aplikasi Mobile', 'Aplikasi Mobile', 'Aplikasi Mobile'],
    summaries: [
      'Sistem kalibrasi untuk PT Sidik, laboratorium terakreditasi ISO/IEC 17025. Teknisi mengisi lembar kerja digital di aplikasi Flutter; API Laravel + Filament menghitung ulang setiap angka (ketidakpastian GUM, aturan keputusan ILAC-G8) dari data mentah, meneruskannya ke pemeriksaan, lalu menerbitkan sertifikat PDF dengan halaman verifikasi QR publik.',
      'Sistem absensi JNE berbasis face recognition dan GPS, digarap bertiga. Karyawan absen lewat aplikasi Android Flutter yang memverifikasi wajah dan lokasinya, sementara HR memantau harinya secara langsung dari dashboard Next.js — semuanya di atas backend Firebase Firestore + Cloud Functions.',
      'Platform pemesanan kamar hotel dengan Laravel — info kamar lengkap, reservasi online & offline, serta fitur yang membantu bisnis menjangkau lebih banyak pelanggan.',
      'Aplikasi Flutter untuk perpustakaan / ruang baca — buat akun, telusuri katalog, pinjam buku, lalu baca langsung di reader bawaan aplikasinya; katalog dan akun dilayani lewat REST API.',
      'Pembaca berita Flutter yang menarik kabar terbaru dari negara tertentu — feed trending dan terbaru, pencarian, simpan favorit, dan artikel lengkap sekali ketuk.',
      'Aplikasi Qur’an Flutter untuk membaca sekaligus mendengarkan — teks surah berdampingan dengan murottal, dilengkapi pencarian dan bookmark, dalam UI tenang yang terus dipoles.',
    ],
    impacts: [
      'Menggantikan workbook Excel dan sertifikat manual dengan satu alur yang teraudit — hasilnya dicocokkan dengan data master lab dan semua angkanya sama.',
      'Mengubah absensi dari sekadar dilaporkan jadi bisa dibuktikan — satu absen harus cocok wajah dan lokasinya, dan HR dapat rekap harian tanpa perlu menagih.',
      'Mengubah pemesanan kamar jadi alur online lengkap sambil tetap mendukung reservasi offline.',
      'Memindahkan seluruh alurnya — cari buku, pinjam, baca — ke HP, tanpa perlu balik ke meja perpustakaan.',
      'Menyajikan berita terbaru tersaring per negara dengan alur baca yang mulus — plus tempat menyimpan yang layak dibaca ulang.',
      'Tempat yang tenang untuk membaca atau mendengarkan tiap hari, dan melanjutkan tepat dari bacaan terakhir.',
    ],
  },
  journey: {
    kicker: 'Perjalanan',
    headingPre: 'Pengalaman &',
    headingEm: 'kredensial',
    certifications: 'Sertifikat',
    education: 'Pendidikan',
    grades: ['Sangat Baik', 'Terverifikasi', 'Selesai', 'Selesai', 'Selesai', 'Selesai', 'Selesai'],
    photoSlot: 'Foto menyusul',
    current: 'Berjalan',
    certsSub: 'Kursus & kredensial terverifikasi yang saya raih',
    eduSub: 'Tempat saya mengasah keahlian',
    focus: 'Bidang fokus',
    eduFocus: ['Pengembangan full-stack', 'Rekayasa mobile', 'Pola pikir produk'],
  },
  contact: {
    kicker: 'Mari terhubung',
    headingPre: 'Mari bangun sesuatu',
    headingEm: 'yang hebat bersama.',
    paragraph:
      'Terbuka untuk magang, proyek freelance, dan kolaborasi. Cara tercepat menghubungi saya lewat email — biasanya saya balas dalam sehari.',
    resume: 'CV',
    footerNote: 'Dibuat dengan Next.js, Three.js & ☕',
    copy: 'Salin',
    copied: 'Tersalin!',
    emailDirect: 'Email langsung ke saya',
    sendEmail: 'Kirim email',
    available: 'Tersedia',
  },
  statsBand: { years: 'Tahun berkarya', projects: 'Proyek dirilis', tech: 'Teknologi', certs: 'Sertifikat' },
  exp: [
    {
      role: 'Software Development Intern',
      description:
        'Membangun CertiCal untuk laboratorium kalibrasi terakreditasi ISO/IEC 17025: API Laravel + Filament dan aplikasi Flutter yang mencatat kalibrasi, menghitung ketidakpastian pengukuran (GUM), dan menerbitkan sertifikat PDF berverifikasi QR, dirilis lewat pipeline GitHub Actions yang teruji.',
    },
    {
      role: 'Instruktur Workshop',
      description:
        'Merancang dan mengajar kurikulum pemrograman praktik (HTML, CSS, JavaScript) untuk siswa SMP, termasuk demo live coding dan proyek kelompok kecil.',
    },
    {
      role: 'Developer Full-Stack',
      description:
        'Merilis beberapa proyek bergaya produksi dengan Next.js, Laravel, dan Flutter — dari dashboard admin hingga aplikasi absensi mobile dengan sinkronisasi offline.',
    },
    {
      role: 'Rekayasa Mobile',
      description:
        'Menyelesaikan jalur tersertifikasi Flutter & Firebase, membangun ulang pola ride-sharing (klon inDrive / Uber) dengan lokasi real-time, autentikasi, dan alur pembayaran.',
    },
  ],
  edu: {
    program: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
    description: 'Program intensif yang berfokus pada pengembangan full-stack, rekayasa mobile, dan pola pikir produk.',
  },
  languageNames: ['Indonesia', 'Arab', 'Inggris'],
  proficiency: ['Asli', 'Lancar', 'Menengah'],
  preloader: 'Memuat pengalaman',
  availability: 'Terbuka untuk magang & freelance',
};

const ar: AppDict = {
  nav: { about: 'نبذة', skills: 'المهارات', work: 'الأعمال', journey: 'المسيرة', contact: 'تواصل', resume: 'السيرة الذاتية' },
  hero: {
    greeting: 'مرحبًا، أنا',
    role: 'مطوّر Full-Stack وتطبيقات الجوال',
    subheadline:
      'أبني تطبيقات جوال وويب جاهزة للإنتاج — من تطبيقات Flutter بخلفية Firebase لحظية إلى منصّات Next.js وLaravel سريعة — أصنع منتجات أنيقة وموثوقة من أول فكرة حتى النشر.',
    viewProjects: 'عرض المشاريع',
    contactMe: 'تواصل معي',
    downloadResume: 'تحميل السيرة الذاتية',
    buildingWith: 'أبني باستخدام',
    scroll: 'مرّر',
    dragRotate: 'اسحب للتدوير',
  },
  about: {
    volume: 'العدد الأول — نبذة',
    est: '★ منذ 2023 ★',
    edition: 'إصدار المعرض',
    tags: 'Full-Stack · جوال · ويب',
    frontPage: 'الصفحة الأولى · عن المطوّر',
    headline: 'أحوّل الأفكار إلى منتجات تُطلَق فعلًا.',
    bylinePre: 'بقلم',
    reportingFrom: 'من',
    standfirst: 'مرحبًا — أنا مطوّر أحبّ تحويل الأفكار الأوّلية إلى برمجيات حقيقية تعمل.',
    body: [
      'أدرس حاليًا تخصص تطوير البرمجيات والألعاب (PPLG) في SMK IDN Bogor. أركّز على بناء تطبيقات سريعة وسهلة الوصول وحسنة البنية — من مواقع تسويقية أنيقة إلى لوحات تحكم بمستوى الإنتاج وتطبيقات جوال متعددة المنصّات.',
      'تمتدّ مسيرتي من تدريس أساسيات الويب للطلاب الصغار، إلى بناء تطبيقات جوال متعددة المنصّات ولوحات تحكم متكاملة تُستخدم فعليًا — أنظمة حضور ومسارات حجز وتطبيقات قراءة ولوحات إدارة.',
      'أهتمّ بالبنية النظيفة والتفاعل السلس والتفاصيل غير اللامعة — حالات الخطأ والمزامنة دون اتصال والأداء — التي تحدّد مدى موثوقية المنتج. أعمل من البداية للنهاية: تصميم، بناء، نشر، تحسين.',
    ],
    factFile: 'بطاقة تعريف',
    labels: { based: 'المقر', role: 'الدور', focus: 'التركيز', experience: 'الخبرة', status: 'الحالة' },
    experienceValue: '+3 سنوات',
    pullQuote: 'إطلاق ما يعمل فعلًا أفضل من إطلاق ما يبدو منجزًا فحسب.',
    dailyTools: 'أدواتي اليومية',
    recentDispatches: 'آخر الأخبار',
    kickers: ['المسيرة', 'تدريس', 'حِرفة'],
    dragMe: 'اسحبني ✦',
    statYears: 'سنوات برمجة',
    statProjects: 'مشاريع منجزة',
    statTech: 'تقنيات',
  },
  skills: {
    kicker: 'الأدوات',
    headingPre: 'المهارات و',
    headingEm: 'التقنيات',
    note: 'اختر فئة على اللابتوب — يعرض الهاتف أعلى مهارة.',
    categories: ['الواجهة', 'الخلفية', 'الجوال'],
    spotlight: 'الأبرز',
    topSkill: 'أعلى مهارة',
    toolsTracked: 'عدد الأدوات',
    operational: 'يعمل',
    dragCard: 'اسحب أو انقر للتبديل',
  },
  work: {
    kicker: 'أعمال مختارة',
    headingPre: 'مشاريع',
    headingEm: 'مميّزة',
    more: '+{n} على GitHub',
    all: 'الكل على GitHub',
    spotlight: 'الأبرز',
    impact: 'الأثر — ',
    viewCode: 'عرض الكود',
    code: 'الكود',
    liveDemo: 'عرض حي',
    categories: ['تدريب عملي · Laravel API + Flutter', 'جوال وويب · نظام حضور', 'تطبيق ويب', 'تطبيق جوال', 'تطبيق جوال', 'تطبيق جوال'],
    summaries: [
      'نظام المعايرة لشركة PT Sidik، وهو مختبر معتمد وفق ISO/IEC 17025. يملأ الفنيون أوراق العمل الرقمية في تطبيق Flutter، وتعيد واجهة Laravel + Filament حساب كل رقم (عدم اليقين وفق GUM وقواعد القرار ILAC-G8) من القراءات الخام، ثم تمرره للمراجعة وتصدر شهادات PDF مع صفحة تحقق عامة عبر رمز QR.',
      'نظام حضور لـ JNE يعتمد على التعرّف على الوجه وتحديد الموقع، أنجزناه بفريق من ثلاثة. يسجّل الموظفون حضورهم من تطبيق أندرويد بـ Flutter يتحقّق من وجوههم وموقعهم، بينما تتابع الموارد البشرية اليوم لحظيًا عبر لوحة تحكم بـ Next.js — كل ذلك على خلفية Firebase Firestore وCloud Functions.',
      'منصّة لحجز غرف الفنادق مبنية بـ Laravel — معلومات تفصيلية عن الغرف، وحجوزات أونلاين وأوفلاين، وأدوات تساعد العمل على الوصول لعملاء أكثر.',
      'تطبيق Flutter لمكتبة / قاعة قراءة — أنشئ حسابًا، وتصفّح الفهرس، واستعر كتابًا واقرأه داخل قارئ التطبيق نفسه، مع فهرس وحسابات تُقدَّم عبر واجهة REST.',
      'قارئ أخبار بـ Flutter يجلب العناوين الحيّة من دول مختارة — قوائم الأكثر تداولًا والأحدث، وبحث، وحفظ للمفضّلة، والمقال كاملًا بنقرة واحدة.',
      'تطبيق قرآن بـ Flutter للقراءة والاستماع — نصّ السور إلى جانب التلاوة الصوتية، مع بحث وعلامات مرجعية، بواجهة هادئة يتواصل تحسينها.',
    ],
    impacts: [
      'استبدل ملفات Excel والشهادات اليدوية بمسار واحد خاضع للتدقيق — وطوبقت النتائج مع بيانات المختبر المرجعية فتطابقت كل الأرقام.',
      'حوّل الحضور من مجرّد بلاغ إلى أمر قابل للإثبات — كل تسجيل يجب أن يطابق وجهًا ومكانًا، وتحصل الموارد البشرية على الملخّص اليومي دون مطالبة أحد.',
      'حوّل حجز الغرف إلى مسار أونلاين كامل مع دعم الحجوزات دون اتصال.',
      'نقل المسار كاملًا — البحث عن كتاب واستعارته وقراءته — إلى الهاتف، دون العودة إلى مكتب المكتبة.',
      'يقدّم عناوين محدّثة مُصفّاة حسب الدولة بمسار قراءة سلس — مع مكان لحفظ ما يستحقّ العودة إليه.',
      'مكان هادئ للقراءة أو الاستماع يوميًا، ومتابعة من حيث انتهت آخر جلسة.',
    ],
  },
  journey: {
    kicker: 'المسيرة',
    headingPre: 'الخبرة و',
    headingEm: 'الشهادات',
    certifications: 'الشهادات',
    education: 'التعليم',
    grades: ['ممتاز', 'موثّق', 'مكتمل', 'مكتمل', 'مكتمل', 'مكتمل', 'مكتمل'],
    photoSlot: 'الصورة قريبًا',
    current: 'مستمر',
    certsSub: 'دورات وشهادات موثّقة حصلت عليها',
    eduSub: 'حيث أصقل مهاراتي',
    focus: 'مجالات التركيز',
    eduFocus: ['تطوير متكامل', 'هندسة الجوال', 'التفكير المنتَجي'],
  },
  contact: {
    kicker: 'تواصل معي',
    headingPre: 'لنبنِ شيئًا',
    headingEm: 'رائعًا معًا.',
    paragraph:
      'منفتح على التدريب والمشاريع الحرّة والتعاون. أسرع طريقة للوصول إليّ هي البريد الإلكتروني — عادةً أردّ خلال يوم.',
    resume: 'السيرة الذاتية',
    footerNote: 'بُني بـ Next.js وThree.js و☕',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    emailDirect: 'راسلني مباشرة',
    sendEmail: 'إرسال بريد',
    available: 'متاح',
  },
  statsBand: { years: 'سنوات بناء', projects: 'مشاريع منجزة', tech: 'تقنيات', certs: 'شهادات' },
  exp: [
    {
      role: 'متدرب تطوير برمجيات',
      description:
        'بناء نظام CertiCal لمختبر معايرة معتمد وفق ISO/IEC 17025: واجهة Laravel + Filament وتطبيق Flutter لتسجيل المعايرات وحساب عدم اليقين (GUM) وإصدار شهادات PDF موثقة برمز QR، عبر خط GitHub Actions مُختبَر.',
    },
    {
      role: 'مدرّب ورشة',
      description:
        'صمّمت ودرّست منهجًا عمليًا في البرمجة (HTML وCSS وJavaScript) لطلاب المرحلة الإعدادية، شمل عروضًا حيّة للبرمجة ومشاريع جماعية صغيرة.',
    },
    {
      role: 'مطوّر Full-Stack',
      description:
        'أطلقت عدّة مشاريع بأسلوب إنتاجي باستخدام Next.js وLaravel وFlutter — من لوحات إدارة إلى تطبيقات حضور للجوال بمزامنة دون اتصال.',
    },
    {
      role: 'هندسة تطبيقات الجوال',
      description:
        'أتممت مسارًا معتمدًا في Flutter وFirebase، وأعدت بناء أنماط مشاركة الركوب (نسخ inDrive / Uber) مع تحديد الموقع اللحظي والمصادقة ومسارات الدفع.',
    },
  ],
  edu: {
    program: 'تطوير البرمجيات والألعاب (PPLG)',
    description: 'برنامج مكثّف يركّز على التطوير المتكامل وهندسة الجوال والتفكير المنتَجي.',
  },
  languageNames: ['الإندونيسية', 'العربية', 'الإنجليزية'],
  proficiency: ['لغة أم', 'بطلاقة', 'متوسّط'],
  preloader: 'جارٍ التحميل',
  availability: 'متاح للتدريب والعمل الحر',
};

export const DICT: Record<Lang, AppDict> = { id, en, ar };
