import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import StudentLifeOverviewSection from './student-life-overview-section';

export default function StudentLifeOverviewPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/student-life-overview-hero.webp"
        eyebrow="Student Life"
        heading="Life at Crestview"
        description="From a child's first day in Kindergarten to their final exams in SS3, every stage of the Crestview journey is designed to nurture, challenge, and inspire."
      />

      <StudentLifeOverviewSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-03.webp"
        imageAlt="Crestview Academy admissions"
        eyebrow="Find Your Child's Place"
        heading="Ready to Begin the Journey"
        description="Explore our admission process and discover how simple it is to secure your child's place at Crestview Academy."
        cta={{ label: 'View Admission Process', href: '/admissions/process' }}
      />
    </main>
  );
}
