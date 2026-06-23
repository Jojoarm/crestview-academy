import PageHero from '@/components/PageHero';
import FeatureCard from '@/components/FeatureCard';
import GalleryPageSection from './gallery-section';

export default function GalleryPage() {
  return (
    <main>
      <PageHero
        image="/assets/img-optimized/crestview-hero-06.webp"
        eyebrow="Gallery"
        heading="Life in Pictures"
        description="Every photograph tells a story of curious minds, proud achievements, and the vibrant community that makes Crestview Academy a place students are proud to call home."
      />

      <GalleryPageSection />

      <FeatureCard
        image="/assets/img-optimized/crestview-hero-03.webp"
        imageAlt="Crestview Academy admissions team"
        eyebrow="Get in Touch"
        heading="Want to See Crestview in Person?"
        description="Pictures tell part of the story. Come and see the rest for yourself. Our admissions team is ready to welcome you and your family to campus."
        cta={{ label: 'Contact Us', href: '/contact/contact-us' }}
      />
    </main>
  );
}
