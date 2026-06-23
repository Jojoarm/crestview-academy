import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import SecondarySection from './secondary-section';

export const metadata = {
  title: 'Secondary School | Crestview Academy',
  description:
    'Our Secondary School prepares students for WAEC and NECO examinations through academic rigour, leadership opportunities, STEM education, and character development.',
};

export default function SecondaryPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/student-life-secondary-hero.webp"
        eyebrow="Student Life"
        heading="Secondary School"
        description="Preparing students for excellence in WAEC, NECO, higher education, and life beyond the classroom."
      />

      <SecondarySection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-03.webp"
        imageAlt="Crestview Academy Primary programme"
        eyebrow="Earlier Years"
        heading="Where the Journey Begins"
        description="Our Primary School lays the academic and personal foundations that prepare pupils for the greater independence, responsibility, and opportunities of Secondary School."
        cta={{ label: 'Explore Primary', href: '/student-life/primary' }}
      />
    </main>
  );
}
