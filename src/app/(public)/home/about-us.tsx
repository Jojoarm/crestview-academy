import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { cn } from '@/lib/utils';

const blocks = [
  {
    eyebrow: 'Our History',
    heading: 'Three Decades of\nShaping Lives',
    body: 'Founded in 1994 by a group of passionate educators, Crestview Academy began as a small nursery school in the heart of Lagos with a simple but powerful belief that every child deserves a world class education. Over three decades, we have grown from a single classroom to a full Nursery, Primary, and Secondary institution, earning the trust of thousands of families across Lagos and beyond. Our journey is one of unwavering commitment to excellence, rooted in the values our founders instilled from the very first day.',
    images: [
      {
        src: '/assets/img-optimized/crestview-hero-01.webp',
        alt: 'Crestview Academy founding days',
      },
      {
        src: '/assets/img-optimized/crestview-hero-02.webp',
        alt: 'Crestview Academy early years',
      },
    ],
    link: '/about/history',
    flip: false,
  },
  {
    eyebrow: 'Our Vision',
    heading: 'A Future Built on\nExcellence',
    body: 'To be the leading centre of academic and character excellence in Nigeria, producing graduates who are not only intellectually equipped, but morally grounded, globally aware, and ready to lead with integrity in every sphere of life. We envision a Crestview community where curiosity is celebrated, potential is limitless, and every student leaves not just with qualifications, but with purpose.',
    images: [
      {
        src: '/assets/img-optimized/crestview-hero-03.webp',
        alt: 'Crestview Academy students in class',
      },
      {
        src: '/assets/img-optimized/crestview-hero-04.webp',
        alt: 'Crestview Academy campus',
      },
    ],
    link: '/about/vision',
    flip: true,
  },
  {
    eyebrow: 'Our Mission',
    heading: 'Nurturing Minds,\nBuilding Character',
    body: 'To provide a rigorous, inclusive, and inspiring education that develops the whole child; intellectually, socially, morally, and physically. Through exceptional teaching, a rich co-curricular life, and a culture of high expectations, we equip every student with the knowledge, skills, and values needed to thrive in a rapidly changing world. At Crestview, we do not just prepare students for examinations, we prepare them for life.',
    images: [
      {
        src: '/assets/img-optimized/crestview-hero-05.webp',
        alt: 'Crestview Academy sports day',
      },
      {
        src: '/assets/img-optimized/crestview-hero-06.webp',
        alt: 'Crestview Academy graduation',
      },
    ],
    link: '/about/mission',
    flip: false,
  },
];

export default function AboutSection() {
  return (
    <section className="section-pad bg-background-100">
      {/* ── Top: About Us intro ── */}
      <div className=" w-full max-w-7xl mx-auto text-center mb-20">
        <SectionHeading
          eyebrow="About Us"
          heading="Who We Are"
          align="center"
        />
        <p className="font-body  text-foreground-100 text-base md:text-lg leading-relaxed mb-4 opacity-80">
          Crestview Academy is a premier private school in Lekki, Lagos,
          offering world class education from Nursery through Secondary. For
          over three decades, we have been a place where academic rigour meets
          genuine care, where every child is known by name, challenged to grow,
          and inspired to lead.
        </p>
        <p className="font-body text-foreground-100 text-base leading-relaxed opacity-70">
          We are proud of the community we have built: one that brings together
          dedicated teachers, engaged parents, and ambitious young people united
          by a shared belief in the transformative power of education.
        </p>
      </div>

      {/* ── Content blocks ── */}
      <div className="flex flex-col gap-24 md:gap-32">
        {blocks.map((block, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center ${
              block.flip ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            {/* Photos side */}
            <div className="relative h-105 md:h-125">
              {/* Main image — larger, positioned top-left */}
              <div className="absolute top-0 left-0 w-[45%] h-[72%] overflow-hidden shadow-lg">
                <Image
                  src={block.images[0].src}
                  alt={block.images[0].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 65vw, 33vw"
                />
                {/* Terracotta corner pin */}
                <div className="absolute top-0 left-0 w-6 h-6 bg-primary z-10" />
              </div>

              {/* Secondary image — smaller, offset bottom-right, overlaps main */}
              <div className="absolute bottom-0 right-0 w-[52%] h-[55%] overflow-hidden shadow-xl border-4 border-background">
                <Image
                  src={block.images[1].src}
                  alt={block.images[1].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 52vw, 26vw"
                />
              </div>

              {/* Decorative dot grid — sits behind images */}
              <div
                className="absolute bottom-6 left-6 w-24 h-24 -z-10 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, var(--primary) 1.5px, transparent 1.5px)',
                  backgroundSize: '10px 10px',
                }}
              />
            </div>

            {/* Text side */}
            <div
              className={cn(
                'flex flex-col',
                block.flip ? 'xl:ml-30' : 'xl:mr-30',
              )}
            >
              <SectionHeading
                eyebrow={block.eyebrow}
                heading={block.heading.replace('\\n', '\n')}
              />
              <p className="font-body text-foreground-100 text-base leading-relaxed opacity-80 mb-8">
                {block.body}
              </p>
              <Link
                href={block.link}
                className="self-start inline-flex items-center gap-2 text-primary font-body font-semibold text-sm tracking-wide hover:gap-4 transition-all duration-200 group"
              >
                Read More
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
