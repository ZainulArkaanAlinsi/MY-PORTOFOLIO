// Real brand logos via the simple-icons CDN (https://simpleicons.org).
// Plain <img> so we don't need next/image remote-domain config.

const SLUG: Record<string, string> = {
  'next.js': 'nextdotjs',
  nextjs: 'nextdotjs',
  react: 'react',
  'react native': 'react',
  typescript: 'typescript',
  javascript: 'javascript',
  'tailwind css': 'tailwindcss',
  tailwind: 'tailwindcss',
  laravel: 'laravel',
  php: 'php',
  'node.js': 'nodedotjs',
  nodejs: 'nodedotjs',
  flutter: 'flutter',
  dart: 'dart',
  firebase: 'firebase',
  'realtime db': 'firebase',
  supabase: 'supabase',
  mysql: 'mysql',
  git: 'git',
  github: 'github',
  figma: 'figma',
};

export function techSlug(name: string): string | null {
  return SLUG[name.trim().toLowerCase()] ?? null;
}

export default function TechIcon({
  name,
  size = 22,
  color,
  className = '',
}: {
  name: string;
  size?: number;
  color?: string; // hex without '#'; omit for the real brand color
  className?: string;
}) {
  const slug = techSlug(name);
  if (!slug) return null;
  const src = `https://cdn.simpleicons.org/${slug}${color ? `/${color}` : ''}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      loading="lazy"
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
