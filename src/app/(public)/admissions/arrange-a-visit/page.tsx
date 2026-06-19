import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import ArrangeVisitSection from './visit-section';

export const metadata = {
  title: 'Arrange A Visit | Crestview Academy',
  description:
    'Book a campus tour at Crestview Academy. Meet our teachers, explore our classrooms, and see for yourself what makes Crestview the school of choice in Lagos.',
};

export default function ArrangeVisitPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-03.webp"
        eyebrow="Admissions"
        heading="Arrange A Visit"
        description="The best way to know if Crestview is right for your child is to experience it in person. Book a tour today."
      />

      <ArrangeVisitSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-05.webp"
        imageAlt="Crestview Academy admissions"
        eyebrow="Admissions"
        heading="Ready to Take the Next Step?"
        description="Once you've had a chance to visit and ask your questions, applying is simple. Start your child's application online in just a few minutes."
        cta={{ label: 'Apply Online', href: '/admissions/apply' }}
        flip={true}
      />
    </main>
  );
}
