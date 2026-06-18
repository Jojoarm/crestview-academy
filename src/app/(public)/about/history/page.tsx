import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import HistorySection from './history-section';

export default function HistoryPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-01.webp"
        eyebrow="About Us"
        heading="Our History"
        description="Three decades of growth, resilience, and an unwavering commitment to excellence, explore the journey that shaped who we are today."
      />

      <HistorySection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-04.webp"
        imageAlt="Crestview Academy vision and values"
        eyebrow="Vision & Values"
        heading="The Beliefs That Guide Every Decision We Make"
        description="Our history is the story of how we got here. Our vision and values are the story of where we are going and the principles that will never change along the way."
        cta={{ label: 'Explore Our Vision', href: '/about/vision' }}
      />
    </main>
  );
}
