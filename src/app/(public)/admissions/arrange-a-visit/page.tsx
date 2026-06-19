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
        imageAlt="Student life at Crestview Academy"
        eyebrow="Student Life"
        heading="More Than a Classroom Experience"
        description="From sports and creative arts to leadership opportunities and school events, student life at Crestview Academy is designed to help every learner build confidence, discover their talents, and create lasting memories."
        cta={{
          label: 'Explore Student Life',
          href: '/student-life/overview',
        }}
        flip={true}
      />
    </main>
  );
}
