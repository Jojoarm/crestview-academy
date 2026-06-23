import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import QualityAssuranceSection from './quality-assurance-section';

export const metadata: Metadata = {
  title: 'Quality Assurance | Crestview Academy',
  description:
    'Every term at Crestview Academy, teaching quality is observed, assessed, and reviewed. Learn how our QA cycle, teacher development programme, and published standards keep us accountable.',
};

export default function QualityAssurancePage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-04.webp"
        eyebrow="Academics"
        heading="Quality Assurance"
        description="How we monitor teaching quality, hold our staff accountable, and ensure every student receives the standard of education we promise."
      />

      <QualityAssuranceSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-01.webp"
        imageAlt="Crestview Academy school calendar"
        eyebrow="Plan Ahead"
        heading="School Calendar"
        description="Term dates, examination timetables, public holidays, and key academic events; everything parents and students need to plan the year ahead."
        cta={{ label: 'View the Calendar', href: '/academics/school-calendar' }}
        flip
      />
    </main>
  );
}
