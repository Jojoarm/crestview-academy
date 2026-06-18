'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

const levels = [
  {
    id: 'kindergarten',
    label: 'Kindergarten',
    ageRange: 'Ages 2 – 4',
    tag: 'K · PRE-NURSERY',
    tagline: 'Where Every Journey Begins',
    description:
      'Our Kindergarten programme provides a warm, play based foundation that nurtures curiosity, creativity, and early social skills. Through structured play, storytelling, and guided discovery, we prepare the youngest learners for a lifelong love of learning.',
    image: '/assets/img-optimized/crestview-hero-01.webp',
    href: '/academics/kindergarten',
  },
  {
    id: 'nursery',
    label: 'Nursery',
    ageRange: 'Ages 4 – 6',
    tag: 'NURSERY',
    tagline: 'Building Blocks of Brilliance',
    description:
      'In our Nursery, children develop foundational literacy, numeracy, and social emotional skills in a vibrant, inclusive environment. Our experienced early years educators follow a structured yet flexible curriculum that meets each child exactly where they are.',
    image: '/assets/img-optimized/crestview-hero-02.webp',
    href: '/academics/nursery',
  },
  {
    id: 'primary',
    label: 'Primary',
    ageRange: 'Primary 1 – 6',
    tag: 'PRIMARY · YEAR 1–6',
    tagline: 'Rooted in Excellence',
    description:
      'Our Primary School delivers a rigorous, broad curriculum aligned with Nigerian national standards and enriched with STEM, arts, and leadership experiences. Students build the academic confidence and character they need to thrive in secondary and beyond.',
    image: '/assets/img-optimized/crestview-hero-03.webp',
    href: '/academics/primary',
  },
  {
    id: 'secondary',
    label: 'Secondary',
    ageRange: 'JSS 1 – SS 3',
    tag: 'SECONDARY · JSS–SS3',
    tagline: 'Prepared for the World',
    description:
      'Our Secondary School offers comprehensive preparation for WAEC, NECO, and tertiary education entrance. Combining academic rigour with co-curricular depth; sports, debate, arts, and student leadership, we develop graduates who are ready not just for exams, but for life.',
    image: '/assets/img-optimized/crestview-hero-04.webp',
    href: '/academics/secondary',
  },
];

export default function AcademicLevels() {
  const [active, setActive] = useState<string>('secondary');

  return (
    <section className="section-pad bg-background">
      {/* ── Section header ── */}
      <div className="mb-12">
        <SectionHeading
          eyebrow="Academic Programmes"
          heading="Education at Every Stage"
          align="center"
        />
        <p className="font-body text-foreground-100 text-base leading-relaxed opacity-75 max-w-6xl mx-auto text-center">
          From first steps to final exams, Crestview Academy offers a seamless,
          world class education across all levels, designed to meet each
          child&apos;s needs at every stage of growth.
        </p>
      </div>

      {/* ── Desktop: expanding panels ── */}
      <div className="hidden lg:flex h-145 gap-0.5 overflow-hidden">
        {levels.map((level) => {
          const isActive = active === level.id;
          return (
            <div
              key={level.id}
              onMouseEnter={() => setActive(level.id)}
              className="relative overflow-hidden cursor-pointer transition-all duration-700 ease-in-out"
              style={{ flex: isActive ? '3.0' : '1.5' }}
            >
              {/* Background image */}
              <Image
                src={level.image}
                alt={level.label}
                fill
                className="object-cover scale-105 transition-transform duration-700 ease-in-out"
                style={{ transform: isActive ? 'scale(1)' : 'scale(1.08)' }}
                sizes="(max-width: 1280px) 50vw, 25vw"
              />

              {/* Always-on dark overlay */}
              <div className="absolute inset-0 bg-foreground/60 transition-opacity duration-500" />

              {/* Collapsed state — rotated label */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <span
                  className="text-white font-body font-bold text-xl tracking-[0.2em] uppercase whitespace-nowrap"
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                  }}
                >
                  {level.label}
                </span>
              </div>

              {/* Expanded state — full content */}
              <div
                className={`absolute inset-0 flex flex-col justify-end p-8 transition-all duration-500 ${
                  isActive
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                {/* Tag pill */}
                <span className="inline-block text-white/60 font-body text-[10px] tracking-[0.25em] uppercase mb-3">
                  {level.tag}
                </span>

                {/* Level name */}
                <h3 className="font-heading text-4xl xl:text-5xl font-bold text-white leading-tight mb-1">
                  {level.label}
                </h3>

                {/* Age range */}
                <span className="font-body text-terracotta-light text-sm font-medium tracking-wide mb-4">
                  {level.ageRange}
                </span>

                {/* Terracotta rule — the signature element */}
                <div className="w-10 h-0.5 bg-primary mb-5" />

                {/* Tagline */}
                <p className="font-accent italic text-white/90 text-lg mb-3 leading-snug">
                  {level.tagline}
                </p>

                {/* Description */}
                <p className="font-body text-white/70 text-sm leading-relaxed mb-7 max-w-sm">
                  {level.description}
                </p>

                {/* CTA */}
                <Link
                  href={level.href}
                  className="self-start inline-flex items-center gap-2 border border-white/50 hover:border-white hover:bg-white/10 text-white font-body font-medium text-xs tracking-[0.15em] uppercase px-5 py-2.5 transition-all duration-200"
                >
                  Discover More
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mobile: vertical accordion ── */}
      <div className="flex flex-col gap-3 lg:hidden">
        {levels.map((level) => {
          const isActive = active === level.id;
          return (
            <div key={level.id} className="overflow-hidden">
              {/* Accordion trigger */}
              <button
                onClick={() => setActive(isActive ? '' : level.id)}
                className="w-full flex items-center justify-between px-5 py-4 bg-background-100 border-l-2 border-primary text-left"
              >
                <div className="flex flex-col">
                  <span className="font-body font-semibold text-foreground text-sm tracking-wide">
                    {level.label}
                  </span>
                  <span className="font-body text-primary text-xs mt-0.5">
                    {level.ageRange}
                  </span>
                </div>
                <span
                  className={`text-primary text-xl font-light transition-transform duration-300 ${
                    isActive ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>

              {/* Accordion content */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isActive ? 'max-h-125' : 'max-h-0'
                }`}
              >
                {/* Image */}
                <div className="relative w-full h-52">
                  <Image
                    src={level.image}
                    alt={level.label}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* Text */}
                <div className="px-5 py-6 bg-background-100">
                  <p className="font-accent italic text-primary text-base mb-3">
                    {level.tagline}
                  </p>
                  <p className="font-body text-foreground-100 text-sm leading-relaxed mb-5 opacity-80">
                    {level.description}
                  </p>
                  <Link
                    href={level.href}
                    className="inline-flex items-center gap-2 text-primary font-body font-semibold text-sm hover:gap-4 transition-all duration-200 group"
                  >
                    Discover More
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
