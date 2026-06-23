import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import OverviewSection from './overview-section';

export default function OverviewPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/about-us-hero-02.webp"
        eyebrow="About Us"
        heading="Shaping Futures Since 1992"
        description="Discover the story, values, and people behind one of Lagos State's most trusted academic institutions."
        cta={{ label: 'Our History', href: '/about/history' }}
      />

      <OverviewSection />

      <FeatureCard
        image="/assets/img-optimized/students-relaxing.webp"
        imageAlt="Crestview Academy students"
        eyebrow="Admissions"
        heading="Ready to Join the Crestview Family?"
        description="We welcome applications from families who share our belief in excellence, character, and the potential of every child. Our admissions process is straightforward, and our team is here to guide you every step of the way."
        cta={{ label: 'Apply Now', href: '/admissions/apply' }}
      />
    </main>
  );
}
