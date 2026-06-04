import type { Metadata } from "next";
import { Space_Grotesk, Sora, DM_Sans, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppProviders } from "@/i18n/provider";
import "./globals.css";

// Runs before paint to apply saved theme + language → avoids a flash.
const BOOT = `(function(){try{var t=localStorage.getItem('theme');if(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)t='dark';if(t==='dark')document.documentElement.classList.add('dark');var l=localStorage.getItem('lang');if(l==='id'||l==='en'||l==='ar'){document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';}}catch(e){}})();`;

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Clean, modern geometric sans for display / headings (replaces Unbounded)
const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Calm, readable serif for the newspaper headings (replaces Playfair)
const lora = Lora({
  variable: "--font-serif-src",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Zainul Arkaan | Full-Stack Web & Mobile Developer",
  description: "Zainul Arkaan Al Insi's professional portfolio. React, Next.js, Laravel, and Flutter developer based in Bekasi, Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${sora.variable} ${dmSans.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
