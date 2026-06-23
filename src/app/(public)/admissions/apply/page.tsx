import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import ApplySection from './apply-section';

export default function ApplyPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/apply-page-hero.webp"
        eyebrow="Admissions"
        heading="Apply Online"
        description="Begin your child's journey at Crestview Academy. Complete the form below and our admissions team will reach out within 48 hours."
      />

      <ApplySection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-02.webp"
        imageAlt="Crestview Academy campus visit"
        eyebrow="Not Ready to Apply Yet"
        heading="Visit Our Campus Before You Decide"
        description="Some decisions are easier in person. Book a tour, meet our teachers, and see classrooms in session before you submit your application."
        cta={{ label: 'Arrange A Visit', href: '/admissions/arrange-a-visit' }}
      />
    </main>
  );
}
