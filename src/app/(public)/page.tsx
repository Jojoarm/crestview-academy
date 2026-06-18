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
        description="Founded in 1994, Crestview Academy began as a small nursery school with a powerful belief that every child deserves a world-class education."
        cta={{ label: 'Learn More', href: '/about/history' }}
      />
    </>
  );
}
