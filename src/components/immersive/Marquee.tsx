'use client';

import TechIcon from './TechIcon';

const ITEMS = [
  'Flutter',
  'Next.js',
  'React',
  'Laravel',
  'Firebase',
  'MySQL',
  'Tailwind CSS',
  'TypeScript',
  'Dart',
];

function Row({ reverse }: { reverse?: boolean }) {
  const content = [...ITEMS, ...ITEMS];
  return (
    <div className="flex w-max">
      <div
        className={`flex w-max shrink-0 ${
          reverse ? 'animate-marquee-right' : 'animate-marquee-left'
        }`}
      >
        {content.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display flex items-center gap-3 whitespace-nowrap px-7 text-2xl font-extrabold tracking-tight text-[color:var(--rebel)] sm:text-4xl"
          >
            <TechIcon name={item} size={30} />
            {item}
            <span className="pl-7 text-cyan-600">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section
      aria-hidden="true"
      className="overflow-hidden border-y border-[rgba(69,29,7,0.12)] bg-linear-to-r from-[#f5ebe2] via-[#fffaf3] to-[#f1e6d8] py-7"
    >
      <Row />
      <div className="mt-4">
        <Row reverse />
      </div>
    </section>
  );
}
