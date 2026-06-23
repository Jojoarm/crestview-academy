import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import PrimarySection from './primary-section';

export const metadata = {
  title: 'Primary School | Crestview Academy',
  description:
    'Our Primary School (Primary 1-6) delivers a rigorous curriculum aligned with Nigerian national standards, enriched with STEM, arts, and leadership.',
};

export default function PrimaryPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/student-life-primary-hero.webp"
        eyebrow="Student Life"
        heading="Primary School"
        description="Rooted in excellence; a rigorous, well rounded curriculum for Primary 1 through 6."
      />

      <PrimarySection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-04.webp"
        imageAlt="Crestview Academy Secondary programme"
        eyebrow="Next Stage"
        heading="What Comes After Primary"
        description="As pupils move into Secondary School, our curriculum sharpens its focus toward WAEC and NECO preparation, deeper subject specialisation, and real leadership opportunity."
        cta={{ label: 'Explore Secondary', href: '/student-life/secondary' }}
        flip
      />
    </main>
  );
}
