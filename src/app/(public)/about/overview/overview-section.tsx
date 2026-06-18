import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { LinksCard } from '@/components/LinksCard';

const pillars = [
  {
    ghost: '30+',
    eyebrow: 'Years of Excellence',
    heading: 'A School Built on Conviction',
    body: "Crestview Academy was founded on a single belief: that every child in Lagos deserves the same quality of education found in the world's finest schools. Since 1994, that conviction has shaped every classroom, every policy, and every teacher we hire.",
    stat: { value: '30+', label: 'Years serving Lagos families' },
  },
  {
    ghost: '98%',
    eyebrow: 'Academic Record',
    heading: 'Results That Speak Plainly',
    body: 'Our SS3 graduates consistently achieve a 98% five-credit pass rate in WAEC — including English and Mathematics. We do not achieve this through pressure, but through an environment where curiosity is rewarded and every student is seen as an individual.',
    stat: { value: '98%', label: 'WAEC five-credit pass rate, 2025' },
  },
  {
    ghost: '4,200',
    eyebrow: 'Our Community',
    heading: 'More Than a Student Body',
    body: 'Over 4,200 alumni have passed through our gates — doctors, engineers, artists, and entrepreneurs who continue to carry the Crestview name with pride. Our community does not end at graduation; it deepens with every passing year.',
    stat: { value: '4,200+', label: 'Alumni across Nigeria and beyond' },
  },
];

export default function OverviewSection() {
  return (
    <section className="section-pad bg-(--warm-white)">
      <div className="w-full">
        {/* Top: intro two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 xl:gap-24 mb-20 md:mb-28">
          {/* Left — sticky pull quote */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Who We Are"
              heading="A Place Where Children Become Their Best Selves"
              align="left"
            />

            <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80 mb-8">
              Nestled in Lekki, Lagos, Crestview Academy has spent over three
              decades building something rare, a school where academic rigour
              and genuine warmth are not in tension, but inseparable. We prepare
              children not just for examinations, but for life.
            </p>
            <Link
              href="/about/history"
              className="inline-flex items-center gap-2 font-body font-semibold text-sm tracking-wide group"
              style={{ color: 'var(--terracotta)' }}
            >
              Explore our history
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Right — three pillars with ghost numerals */}
          <div
            className="flex flex-col divide-y"
            style={{ borderColor: 'var(--border-sand)' }}
          >
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="relative py-10 first:pt-0 last:pb-0 overflow-hidden"
              >
                {/* Ghost numeral */}
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 font-heading font-bold select-none pointer-events-none leading-none"
                  style={{
                    fontSize: 'clamp(5rem, 10vw, 8rem)',
                    color: 'var(--terracotta)',
                    opacity: 0.045,
                  }}
                >
                  {pillar.ghost}
                </span>

                {/* Content */}
                <p
                  className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
                  style={{ color: 'var(--terracotta-light)' }}
                >
                  {pillar.eyebrow}
                </p>
                <h3 className="font-heading text-(--charcoal) text-2xl md:text-3xl leading-snug mb-3">
                  {pillar.heading}
                </h3>
                <p className="font-body text-(--charcoal-100) text-sm leading-relaxed opacity-75 mb-5 max-w-lg">
                  {pillar.body}
                </p>

                {/* Stat */}
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-heading text-3xl font-bold"
                    style={{ color: 'var(--terracotta)' }}
                  >
                    {pillar.stat.value}
                  </span>
                  <span
                    className="font-body text-xs uppercase tracking-widest"
                    style={{ color: 'var(--charcoal-100)', opacity: 0.6 }}
                  >
                    {pillar.stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: quick-nav links to other About pages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-(--border-sand)">
          {[
            {
              label: 'Welcome Address',
              sub: 'A word from our Principal',
              href: '/about/welcome-address',
            },
            {
              label: 'Our History',
              sub: 'Three decades in the making',
              href: '/about/history',
            },
            {
              label: 'Vision & Values',
              sub: 'What drives everything we do',
              href: '/about/vision',
            },
          ].map((item, i) => (
            <LinksCard
              key={i}
              href={item.href}
              label={item.label}
              sub={item.sub}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
