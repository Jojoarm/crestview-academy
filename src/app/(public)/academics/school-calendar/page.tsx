import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import SchoolCalendarSection from './school-calendar-section';

export const metadata: Metadata = {
  title: 'School Calendar | Crestview Academy',
  description:
    'Term dates, mid-term breaks, examinations, and key events for the current and upcoming academic year at Crestview Academy.',
};

export default function SchoolCalendarPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-02.webp"
        eyebrow="Academics"
        heading="School Calendar"
        description="Term dates, mid-term breaks, examinations, and key events — everything you need to plan the academic year ahead."
      />

      <SchoolCalendarSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-03.webp"
        imageAlt="Crestview Academy school gallery"
        eyebrow="Life at Crestview"
        heading="See the School in Action"
        description="From classroom moments to sports days and graduation, browse photos from life at Crestview Academy throughout the academic year."
        cta={{ label: 'View the Gallery', href: '/gallery' }}
      />
    </main>
  );
}
