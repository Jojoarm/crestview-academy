import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { HeroCarousel } from './_components/HeroCarousel';
import { FeaturesCarousel } from './_components/FeaturesCarousel';

export default function Hero() {
  return (
    <div className="section-pad-header relative w-full min-h-screen flex flex-col">
      {/* ── Carousel background ── */}
      <div className="absolute inset-0 z-0">
        <HeroCarousel />
      </div>

      {/* <div className="absolute inset-0 z-10 bg-linear-to-b from-foreground/65 via-foreground/45 to-foreground/72" /> */}
      <div className="absolute inset-0 bg-linear-to-t from-foreground/85 via-foreground/65 to-foreground/15 z-0" />

      {/* ── Top content ── */}
      <div className="relative z-20 flex flex-col flex-1">
        {/* Hero headline section  */}
        <section className="flex-1 flex flex-col items-center justify-center text-center pb-10 pt-10">
          <Badge
            variant="outline"
            className="inline-block text-background-100 font-body tracking-[0.2em] font-medium mb-6"
          >
            Welcome to Crestview Academy
          </Badge>

          {/* Main headline */}
          <h1 className="font-heading text-[40px] md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight w-full max-w-8xl mb-6">
            Building Tomorrow&apos;s{' '}
            <span className="font-accent text-(--sand) font-normal">
              Leaders
            </span>
          </h1>

          {/* Subtext */}
          <p className="font-body text-white/80 text-base md:text-lg max-w-4xl leading-relaxed mb-10">
            At CrestView Academy, we provide a nurturing environment where
            learners develop academic excellence, strong character, and the
            confidence to excel in life.
          </p>

          {/* Two CTAs */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admissions/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-accent text-white font-body font-medium text-sm px-8 py-3.5 transition-colors duration-200 tracking-wide"
            >
              Apply Now
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/about/overview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/60 hover:border-white text-white font-body font-medium text-sm px-8 py-3.5 transition-colors duration-200 tracking-wide hover:bg-white/10"
            >
              Discover More
            </Link>
          </div>
        </section>

        {/* ── Thin rule dividing headline from feature strip ── */}
        <div className="w-full h-px bg-white/25" />

        {/* Features strip */}
        <FeaturesCarousel />
      </div>
    </div>
  );
}
