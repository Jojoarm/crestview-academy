import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import KindergartenSection from './kindergarten-section';

export const metadata = {
  title: 'Kindergarten | Crestview Academy',
  description:
    'A warm, play-based Kindergarten programme for ages 2-4 at Crestview Academy — nurturing curiosity, creativity, and early social skills in Lagos.',
};

export default function KindergartenPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-01.webp"
        eyebrow="Student Life"
        heading="Kindergarten"
        description="Where every journey begins — a warm, play-based foundation for our youngest learners, ages 2 to 4."
      />

      <KindergartenSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-02.webp"
        imageAlt="Crestview Academy Nursery programme"
        eyebrow="Next Stage"
        heading="What Comes After Kindergarten"
        description="As children grow in confidence and independence, our Nursery programme builds on that foundation with structured early literacy, numeracy, and social-emotional learning."
        cta={{ label: 'Explore Nursery', href: '/student-life/nursery' }}
        flip
      />
    </main>
  );
}
