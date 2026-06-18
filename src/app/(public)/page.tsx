import FeatureCard from '@/components/FeatureCard';
import AboutSection from './home/about-us';
import AcademicLevels from './home/academic-levels';
import GallerySection from './home/gallery';
import Hero from './home/hero';
import NewsEvents from './home/news-event';
import WelcomeSection from './home/welcome';

export default function Home() {
  return (
    <>
      <Hero />
      <WelcomeSection />
      <AboutSection />
      <AcademicLevels />
      <NewsEvents />
      <GallerySection />
      <FeatureCard
        image="/assets/img-optimized/crestview-hero-02.webp"
        imageAlt="Crestview Academy founding"
        eyebrow="Our History"
        heading="Three Decades of Shaping Lives"
        description="Founded in 1992, Crestview Academy began as a small nursery school with a powerful belief, that every child deserves a world class education regardless of where they grow up. Today that belief has grown into a full K-12 institution trusted by families across Lagos State and beyond."
        cta={{ label: 'Read Our Story', href: '/about/history' }}
      />
    </>
  );
}
