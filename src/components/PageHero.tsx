import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PageHeroProps {
  image: string;
  eyebrow?: string;
  heading: string;
  description?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export default function PageHero({
  image,
  eyebrow,
  heading,
  description,
  cta,
}: PageHeroProps) {
  return (
    <section className="relative w-full section-pad-header flex items-end overflow-hidden">
      {/* Background image */}
      <Image
        src={image}
        alt={heading}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-tr from-foreground via-foreground/90 to-foreground/15 z-0" />

      {/* Content */}
      <div className="relative z-10 w-full">
        {/* Subtitle */}
        {eyebrow && (
          <p
            className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-white/80 mb-3"
            style={{
              borderLeft: '2px solid var(--terracotta)',
              paddingLeft: '10px',
            }}
          >
            {eyebrow}
          </p>
        )}

        {/* Heading */}
        <h1 className="font-heading text-white text-4xl md:text-5xl lg:text-6xl leading-tight max-w-2xl mb-4">
          {heading}
        </h1>

        {/* Description */}
        {description && (
          <p className="font-body text-white/75 text-base md:text-lg leading-relaxed max-w-xl mb-6">
            {description}
          </p>
        )}

        {/* CTA */}
        {cta && (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 px-6 py-3 font-body font-semibold text-sm text-white tracking-wide border border-white/30 hover:bg-white hover:text-(--charcoal) transition-all duration-200 group"
          >
            {cta.label}
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        )}
      </div>
    </section>
  );
}
