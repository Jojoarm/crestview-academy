import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import WelcomeAddressSection from './welcome-address-section';

export default function WelcomeAddressPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/welcome-page-hero.webp"
        eyebrow="About Us"
        heading="A Word From Our Principal"
        description="Mrs. Adaeze Okonkwo shares her vision for Crestview Academy and the values that guide everything we do."
      />

      <WelcomeAddressSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-06.webp"
        imageAlt="Crestview Academy building"
        eyebrow="Our History"
        heading="Three Decades of Shaping Lives"
        description="Founded in 1994, Crestview Academy began as a small nursery school with a powerful belief, that every child deserves a world class education regardless of where they grow up. Today that belief has grown into a full K-12 institution trusted by families across Lagos."
        cta={{ label: 'Read Our Story', href: '/about/history' }}
        flip
      />
    </main>
  );
}
