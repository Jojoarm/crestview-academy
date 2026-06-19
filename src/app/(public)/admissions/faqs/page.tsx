import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import FaqsSection from './faqs-section';

export default function FaqsPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-04.webp"
        eyebrow="Admissions"
        heading="Frequently Asked Questions"
        description="Straight answers to the questions Lagos families ask us most, organised by topic so you can find what you need quickly."
      />

      <FaqsSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-06.webp"
        imageAlt="Crestview Academy admissions team"
        eyebrow="Still Have Questions"
        heading="Talk to Our Admissions Team Directly"
        description="Some questions need a real conversation. Reach out and our team will respond within one business day, or book a campus visit to see everything for yourself."
        cta={{ label: 'Contact Admissions', href: '/contact/contact-us' }}
      />
    </main>
  );
}
