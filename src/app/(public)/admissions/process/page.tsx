import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import AdmissionProcessSection from './admission-process-section';

export default function AdmissionProcessPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-03.webp"
        eyebrow="Admissions"
        heading="Admission Process"
        description="A clear, guided path from your first enquiry to your child's first day at Crestview Academy."
      />

      <AdmissionProcessSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-06.webp"
        imageAlt="Crestview Academy application form"
        eyebrow="Ready to Apply"
        heading="Begin Your Child's Journey With Us Today"
        description="Now that you know what to expect, take the first step. Our admissions team is ready to guide you through every part of the process."
        cta={{ label: 'Apply Online', href: '/admissions/apply' }}
        flip={true}
      />
    </main>
  );
}
