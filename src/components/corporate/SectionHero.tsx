import React from 'react';

interface SectionHeroProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  cta?: { label: string; href: string };
}

export function SectionHero({ title, subtitle, kicker, cta }: SectionHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-red-900">
      <div className="absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-500 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-rose-500 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {kicker && <p className="text-red-200 text-sm tracking-widest uppercase mb-3">{kicker}</p>}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-red-100 max-w-3xl">
            {subtitle}
          </p>
        )}
        {cta && (
          <div className="mt-8">
            <a
              href={cta.href}
              className="inline-flex items-center px-5 py-3 rounded-md bg-white/10 text-white hover:bg-white/20 transition"
            >
              {cta.label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
