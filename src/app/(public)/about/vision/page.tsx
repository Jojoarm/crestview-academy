import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import VisionMissionSection from './vision-mission-section';

export default function VisionPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/vision-mission-page-hero.webp"
        eyebrow="About Us"
        heading="Vision, Mission & Core Values"
        description="The beliefs that have guided Crestview Academy for three decades and that will continue to guide us for the next thirty years."
      />

      <VisionMissionSection />

      <FeatureCard
        image="/assets/img-optimized/students-in-computer-lab.webp"
        imageAlt="Crestview Academy students in computer lab"
        eyebrow="Why Choose Us"
        heading="An Education Built Around Every Child"
        description="At Crestview Academy, we combine academic excellence with character development, a safe learning environment, and dedicated educators who are committed to helping every child reach their full potential."
        cta={{
          label: 'Discover What Sets Us Apart',
          href: '/admissions/why-crestview',
        }}
      />
    </main>
  );
}
