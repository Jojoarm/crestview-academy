import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import WelcomeAddressSection from './welcome-address-section';

export default function WelcomeAddressPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-06.webp"
        eyebrow="About Us"
        heading="A Word From Our Principal"
        description="Mrs. Adaeze Okonkwo shares her vision for Crestview Academy and the values that guide everything we do."
      />

      <WelcomeAddressSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-02.webp"
        imageAlt="Crestview Academy students"
        eyebrow="Admissions"
        heading="Ready to Join the Crestview Family?"
        description="We welcome applications from families who share our belief in excellence, character, and the potential of every child. Our admissions process is straightforward, and our team is here to guide you every step of the way."
        cta={{ label: 'Apply Now', href: '/admissions/apply' }}
      />
    </main>
  );
}
