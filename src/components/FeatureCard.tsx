import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  heading: string;
  description: string | string[];
  cta?: {
    label: string;
    href: string;
  };
  flip?: boolean;
  light?: boolean;
}

export default function FeatureCard({
  image,
  imageAlt,
  eyebrow,
  heading,
  description,
  cta,
  flip = false,
  light = true,
}: FeatureCardProps) {
  const paragraphs = Array.isArray(description) ? description : [description];

  return (
    <section
      className={`section-pad grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-20 items-center ${
        light ? 'bg-background' : 'bg-charcoal'
      }`}
    >
      {/* ── Image ── */}
      <div
        className={`relative w-full h-64 sm:h-80 lg:h-120 overflow-hidden ${
          flip ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* ── Text ── */}
      <div className={`flex flex-col ${flip ? 'lg:order-1' : 'lg:order-2'}`}>
        {eyebrow && (
          <span
            className={`text-[10px] font-body font-semibold tracking-[0.25em] uppercase mb-4 ${
              light ? 'text-primary' : 'text-terracotta-light'
            }`}
          >
            {eyebrow}
          </span>
        )}

        <h2
          className={`font-heading text-3xl md:text-4xl font-bold leading-tight mb-6 ${
            light ? 'text-foreground' : 'text-white'
          }`}
        >
          {heading}
        </h2>

        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-8 h-0.5 ${light ? 'bg-primary' : 'bg-terracotta-light'}`}
          />
          <div
            className={`w-1.5 h-1.5 rounded-full opacity-40 ${light ? 'bg-primary' : 'bg-terracotta-light'}`}
          />
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className={`font-body text-base leading-relaxed ${
                light ? 'text-foreground-100 opacity-75' : 'text-white/65'
              }`}
            >
              {para}
            </p>
          ))}
        </div>

        {cta && (
          <Link
            href={cta.href}
            className={`self-start inline-flex items-center gap-3 font-body font-medium text-sm tracking-wide px-6 py-3 transition-colors duration-200 ${
              light
                ? 'bg-foreground text-background hover:bg-primary hover:text-white'
                : 'bg-white/10 text-white border border-white/20 hover:bg-primary hover:border-primary'
            }`}
          >
            {cta.label}
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </section>
  );
}
