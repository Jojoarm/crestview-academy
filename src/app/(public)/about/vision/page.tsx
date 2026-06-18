import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import VisionMissionSection from './vision-mission-section';

export default function VisionPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-04.webp"
        eyebrow="About Us"
        heading="Vision, Mission & Core Values"
        description="The beliefs that have guided Crestview Academy for three decades and that will continue to guide us for the next thirty years."
      />

      <VisionMissionSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-01.webp"
        imageAlt="Crestview Academy history"
        eyebrow="Our History"
        heading="See How These Values Took Shape"
        description="Our vision and values were not written overnight, they were forged over three decades of growth, challenges, and an unwavering commitment to every child who walked through our gates."
        cta={{ label: 'Explore Our History', href: '/about/history' }}
      />
    </main>
  );
}
