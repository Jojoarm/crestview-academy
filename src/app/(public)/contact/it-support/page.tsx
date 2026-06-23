// app/contact/it-support/page.tsx

import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import ITSupportSection from './it-support-section';

export const metadata = {
  title: 'IT Support | Crestview Academy',
  description:
    'Report a technical issue with the Crestview Academy portal, school app, email, or fee payment systems. Our IT team responds within 4 working hours.',
};

export default function ITSupportPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/IT-support-page-hero.webp"
        eyebrow="Contact"
        heading="IT Support"
        description="Having trouble with the parent portal, school app, or fee payment system? Let us know and we'll get it sorted."
      />

      <ITSupportSection />

      <FeatureCard
        image="/assets/img-optimized/admission-process-hero.webp"
        imageAlt="Crestview Academy contact"
        eyebrow="General Enquiries"
        heading="Not a Technical Issue?"
        description="For questions about admissions, fees, school life, or anything else, our general contact form is the right place to start."
        cta={{ label: 'Contact Us', href: '/contact/contact-us' }}
      />
    </main>
  );
}
