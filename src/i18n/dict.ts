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
    viewProjects: string; contactMe: string; downloadResume: string; buildingWith: string; scroll: string;
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
    categories: string[]; spotlight: string; topSkill: string; toolsTracked: string; operational: string;
  };
  work: {
    kicker: string; headingPre: string; headingEm: string; more: string; all: string;
    spotlight: string; impact: string; viewCode: string; code: string; liveDemo: string;
    categories: string[]; summaries: string[]; impacts: string[];
  };
  journey: {
    kicker: string; headingPre: string; headingEm: string; certifications: string; education: string;
    grades: string[];
  };
  contact: {
    kicker: string; headingPre: string; headingEm: string; paragraph: string; resume: string; footerNote: string;
  };
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
      "Currently studying at IDN Boarding School's Software Engineering program. I focus on building fast, accessible, and well-architected applications — from polished marketing sites to production-grade dashboards and cross-platform mobile apps.",
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
    categories: ['Web · Admin Dashboard', 'Web App', 'Mobile App', 'Mobile App', 'Mobile App'],
    summaries: [
      'A web-based employee attendance system for the J&T Martapura branch. Staff attendance across working days is recorded and monitored by admins through a real-time dashboard.',
      'A hotel room-booking platform built with Laravel — detailed room info, online and offline reservations, and tools that help the business reach more customers.',
      'A Flutter app for a reading room / library — browse the catalogue, borrow books, and keep track of reading in a clean, focused mobile UI.',
      'A Flutter news reader that pulls the latest headlines from selected countries via a live news API — browse, search, and read full articles.',
      'A clean Flutter Qur’an app for reading surahs on mobile, with the interface continually being refined for a calmer reading experience.',
    ],
    impacts: [
      'Replaced manual attendance with a monitored dashboard — admins track daily presence and recaps at a glance.',
      'Turned room booking into a complete online flow while still supporting offline reservations.',
      'Made borrowing and tracking books simple straight from a phone.',
      'Delivered fresh, country-filtered headlines with a smooth, readable flow.',
      'A calm, focused Qur’an reading experience for daily use.',
    ],
  },
  journey: {
    kicker: 'The journey',
    headingPre: 'Experience &',
    headingEm: 'credentials',
    certifications: 'Certifications',
    education: 'Education',
    grades: ['Excellent', 'Completed', 'Completed', 'Completed'],
  },
  contact: {
    kicker: 'Get in touch',
    headingPre: "Let's build something",
    headingEm: 'great together.',
    paragraph:
      'Open to internships, freelance projects, and collaboration. The fastest way to reach me is email — I usually reply within a day.',
    resume: 'Resume',
    footerNote: 'Built with Next.js, Three.js & ☕',
  },
  exp: [
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
    program: 'Software Engineering Specialist Program',
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
      'Saat ini menempuh program Software Engineering di IDN Boarding School. Saya fokus membangun aplikasi yang cepat, aksesibel, dan ber-arsitektur baik — dari situs marketing yang rapi hingga dashboard skala produksi dan aplikasi mobile lintas platform.',
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
    categories: ['Web · Dashboard Admin', 'Aplikasi Web', 'Aplikasi Mobile', 'Aplikasi Mobile', 'Aplikasi Mobile'],
    summaries: [
      'Sistem absensi karyawan berbasis web untuk cabang J&T Martapura. Kehadiran staf di hari kerja dicatat dan dipantau admin lewat dashboard real-time.',
      'Platform pemesanan kamar hotel dengan Laravel — info kamar lengkap, reservasi online & offline, serta fitur yang membantu bisnis menjangkau lebih banyak pelanggan.',
      'Aplikasi Flutter untuk ruang baca / perpustakaan — telusuri katalog, pinjam buku, dan pantau bacaan dalam UI mobile yang bersih dan fokus.',
      'Pembaca berita Flutter yang menarik kabar terbaru dari negara tertentu via API berita live — telusuri, cari, dan baca artikel lengkap.',
      'Aplikasi Qur’an Flutter yang bersih untuk membaca surah di mobile, dengan UI yang terus dipoles agar pengalaman membaca lebih tenang.',
    ],
    impacts: [
      'Mengganti absensi manual dengan dashboard terpantau — admin melihat kehadiran & rekap harian sekilas.',
      'Mengubah pemesanan kamar jadi alur online lengkap sambil tetap mendukung reservasi offline.',
      'Membuat peminjaman dan pemantauan buku jadi mudah langsung dari HP.',
      'Menyajikan berita terbaru tersaring per negara dengan alur baca yang mulus.',
      'Pengalaman membaca Qur’an yang tenang dan fokus untuk dipakai sehari-hari.',
    ],
  },
  journey: {
    kicker: 'Perjalanan',
    headingPre: 'Pengalaman &',
    headingEm: 'kredensial',
    certifications: 'Sertifikat',
    education: 'Pendidikan',
    grades: ['Sangat Baik', 'Selesai', 'Selesai', 'Selesai'],
  },
  contact: {
    kicker: 'Mari terhubung',
    headingPre: 'Mari bangun sesuatu',
    headingEm: 'yang hebat bersama.',
    paragraph:
      'Terbuka untuk magang, proyek freelance, dan kolaborasi. Cara tercepat menghubungi saya lewat email — biasanya saya balas dalam sehari.',
    resume: 'CV',
    footerNote: 'Dibuat dengan Next.js, Three.js & ☕',
  },
  exp: [
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
    program: 'Program Spesialis Rekayasa Perangkat Lunak',
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
      'أدرس حاليًا في برنامج هندسة البرمجيات بمدرسة IDN Boarding School. أركّز على بناء تطبيقات سريعة وسهلة الوصول وحسنة البنية — من مواقع تسويقية أنيقة إلى لوحات تحكم بمستوى الإنتاج وتطبيقات جوال متعددة المنصّات.',
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
    categories: ['ويب · لوحة تحكم', 'تطبيق ويب', 'تطبيق جوال', 'تطبيق جوال', 'تطبيق جوال'],
    summaries: [
      'نظام حضور موظفين عبر الويب لفرع J&T مارتابورا. يُسجَّل حضور الموظفين في أيام العمل ويُراقَب من قِبل المسؤول عبر لوحة تحكم لحظية.',
      'منصّة لحجز غرف الفنادق مبنية بـ Laravel — معلومات تفصيلية عن الغرف، وحجوزات أونلاين وأوفلاين، وأدوات تساعد العمل على الوصول لعملاء أكثر.',
      'تطبيق Flutter لقاعة قراءة / مكتبة — تصفّح الفهرس، واستعارة الكتب، ومتابعة القراءة بواجهة جوال نظيفة ومركّزة.',
      'قارئ أخبار بـ Flutter يجلب آخر العناوين من دول مختارة عبر واجهة أخبار حيّة — تصفّح وبحث وقراءة المقالات كاملة.',
      'تطبيق قرآن بـ Flutter نظيف لقراءة السور على الجوال، مع تحسين مستمرّ للواجهة لتجربة قراءة أهدأ.',
    ],
    impacts: [
      'استبدل الحضور اليدوي بلوحة مراقَبة — يتابع المسؤول الحضور والملخّصات اليومية بنظرة واحدة.',
      'حوّل حجز الغرف إلى مسار أونلاين كامل مع دعم الحجوزات دون اتصال.',
      'جعل استعارة الكتب ومتابعتها سهلة مباشرة من الهاتف.',
      'يقدّم عناوين محدّثة مُصفّاة حسب الدولة بمسار قراءة سلس.',
      'تجربة قراءة قرآن هادئة ومركّزة للاستخدام اليومي.',
    ],
  },
  journey: {
    kicker: 'المسيرة',
    headingPre: 'الخبرة و',
    headingEm: 'الشهادات',
    certifications: 'الشهادات',
    education: 'التعليم',
    grades: ['ممتاز', 'مكتمل', 'مكتمل', 'مكتمل'],
  },
  contact: {
    kicker: 'تواصل معي',
    headingPre: 'لنبنِ شيئًا',
    headingEm: 'رائعًا معًا.',
    paragraph:
      'منفتح على التدريب والمشاريع الحرّة والتعاون. أسرع طريقة للوصول إليّ هي البريد الإلكتروني — عادةً أردّ خلال يوم.',
    resume: 'السيرة الذاتية',
    footerNote: 'بُني بـ Next.js وThree.js و☕',
  },
  exp: [
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
    program: 'برنامج تخصّص هندسة البرمجيات',
    description: 'برنامج مكثّف يركّز على التطوير المتكامل وهندسة الجوال والتفكير المنتَجي.',
  },
  languageNames: ['الإندونيسية', 'العربية', 'الإنجليزية'],
  proficiency: ['لغة أم', 'بطلاقة', 'متوسّط'],
  preloader: 'جارٍ التحميل',
  availability: 'متاح للتدريب والعمل الحر',
};

export const DICT: Record<Lang, AppDict> = { id, en, ar };
