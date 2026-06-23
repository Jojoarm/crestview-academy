import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import ContactSection from './contact-section';

export const metadata = {
  title: 'Contact Us | Crestview Academy',
  description:
    'Get in touch with the Crestview Academy team for enquiries about admissions, fees, school life, and more.',
};

export default function ContactUsPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/contact-us-page-hero.webp"
        eyebrow="Contact"
        heading="Contact Us"
        description="A question, a concern, or just curious about Crestview, our team is always happy to hear from you."
      />

      <ContactSection />

      <FeatureCard
        image="/assets/img-optimized/contact-us-page-hero.webp"
        imageAlt="Crestview Academy campus tour"
        eyebrow="See It In Person"
        heading="Words Only Go So Far"
        description="The best way to understand Crestview is to walk through our doors. Book a campus visit and let us show you what makes this school different."
        cta={{ label: 'Arrange A Visit', href: '/admissions/arrange-a-visit' }}
        flip
      />
    </main>
  );
}
