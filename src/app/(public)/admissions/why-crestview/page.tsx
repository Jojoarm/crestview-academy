import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import WhyCrestviewSection from './why-crestview-section';

export default function WhyCrestviewPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-02.webp"
        eyebrow="Admissions"
        heading="Why Choose Crestview"
        description="Discover what sets a Crestview education apart and why generations of families across Lagos continue to trust us with their children's future."
      />

      <WhyCrestviewSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-05.webp"
        imageAlt="Crestview Academy admission process"
        eyebrow="Next Step"
        heading="Ready to Begin the Admission Process"
        description="Now that you know what makes Crestview different, let us walk you through how simple it is to secure your child's place with us."
        cta={{ label: 'View Admission Process', href: '/admissions/process' }}
      />
    </main>
  );
}
