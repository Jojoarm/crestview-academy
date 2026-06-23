import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import NurserySection from './nursery-section';

export const metadata = {
  title: 'Nursery | Crestview Academy',
  description:
    'Our Nursery programme for ages 4-6 builds foundational literacy, numeracy, and social-emotional skills, preparing children with confidence for Primary School.',
};

export default function NurseryPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/student-life-nursery-hero.webp"
        eyebrow="Student Life"
        heading="Nursery"
        description="Building blocks of brilliance — foundational literacy, numeracy, and social skills for ages 4 to 6."
      />

      <NurserySection />

      <FeatureCard
        image="/assets/img-optimized/pupils-playing-02.webp"
        imageAlt="Crestview Academy Primary programme"
        eyebrow="Next Stage"
        heading="What Comes After Nursery"
        description="As children move into formal academics, our Primary School builds on these early foundations with a rigorous curriculum spanning core subjects, STEM, arts, and leadership."
        cta={{ label: 'Explore Primary', href: '/student-life/primary' }}
      />
    </main>
  );
}
