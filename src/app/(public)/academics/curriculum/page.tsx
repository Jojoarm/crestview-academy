import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import CurriculumSection from './curriculum-section';

export const metadata: Metadata = {
  title: 'Our Curriculum | Crestview Academy',
  description:
    'Crestview Academy follows the NERDC curriculum across all levels, delivering consistent results in WAEC, NECO, and university placement through small classes, specialist teachers, and rigorous continuous assessment.',
};

export default function CurriculumPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-03.webp"
        eyebrow="Academics"
        heading="Our Curriculum"
        description="A NERDC aligned curriculum taught with rigour, assessed continuously, and proven in results; from Kindergarten through SSS 3."
      />

      <CurriculumSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-04.webp"
        imageAlt="Crestview Academy quality assurance"
        eyebrow="How We Maintain Standards"
        heading="Quality Assurance"
        description="Strong results don't happen by accident. Learn how Crestview monitors teaching quality, tracks student progress, and holds itself accountable to the standards parents expect."
        cta={{
          label: 'See Our Approach',
          href: '/academics/quality-assurance',
        }}
      />
    </main>
  );
}
