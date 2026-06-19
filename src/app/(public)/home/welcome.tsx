import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { ValuesCard } from './_components/ValuesCard';

export default function WelcomeSection() {
  return (
    <section className="section-pad bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
        {/* ── Left column: welcome message ── */}
        <div className="flex flex-col">
          <SectionHeading
            eyebrow="A Word From Our Principal"
            heading="Welcome Message"
          />

          {/* Quote block — large decorative mark */}
          <div className="relative mb-6">
            <span className="absolute -top-4 -left-3 font-accent text-8xl text-primary opacity-10 leading-none select-none">
              &ldquo;
            </span>
            <p className="relative font-body text-base md:text-lg text-foreground-100 leading-relaxed mb-5">
              It is a privilege to welcome you to Crestview Academy. We believe
              every child carries within them the seeds of greatness, our role
              is simply to nurture the right conditions for those seeds to
              flourish.
            </p>
            <p className="font-body text-base text-foreground-100 leading-relaxed mb-5 opacity-80">
              As we mark another exciting chapter in our school&apos;s history,
              our commitment remains unchanged: to provide a rigorous, joyful
              education that builds not just scholars, but young people of
              integrity, empathy, and ambition.
            </p>
            <p className="font-body text-base text-foreground-100 leading-relaxed opacity-80">
              We warmly invite you to explore what makes Crestview Academy the
              school of choice for families across Lagos.
            </p>
          </div>

          {/* Principal signature area */}
          <div className="flex items-center gap-4 mb-10 pt-2">
            <div className="w-10 h-10 rounded-full bg-terracotta-pale flex items-center justify-center shrink-0">
              <span className="font-heading text-primary font-bold text-sm">
                AO
              </span>
            </div>
            <div>
              <p className="font-body font-semibold text-foreground text-sm">
                Mrs. Adaeze Okonkwo
              </p>
              <p className="font-body text-foreground-100 text-xs opacity-60 tracking-wide">
                Principal, Crestview Academy
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/about/welcome-address"
            className="self-start inline-flex items-center gap-2 bg-primary hover:bg-accent text-white font-body font-medium text-sm px-7 py-3.5 transition-colors duration-200 tracking-wide"
          >
            Read More
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* ── Right column: values grid + image ── */}
        <div className="flex flex-col gap-8">
          <ValuesCard />

          {/* Image below values grid */}
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
            {/* Terracotta corner accent */}
            <div className="absolute top-0 left-0 w-8 h-8 bg-primary z-10" />
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary z-10" />
            <Image
              src="/assets/img-optimized/crestview-hero-05.webp"
              alt="Crestview Academy students"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
