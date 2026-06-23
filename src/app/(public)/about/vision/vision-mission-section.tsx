import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';
import { cn } from '@/lib/utils';

const blocks = [
  {
    id: 'vision',
    eyebrow: 'Our Vision',
    heading: 'A Future Built on\nExcellence',
    body: [
      'To be the leading centre of academic and character excellence in Nigeria, producing graduates who are not only intellectually equipped, but morally grounded, globally aware, and ready to lead with integrity in every sphere of life.',
      'We envision a Crestview community where curiosity is celebrated, potential is limitless, and every student leaves not just with qualifications, but with purpose. This is a vision we hold ourselves to deliberately, year after year, not a slogan, but a standard against which we measure every curriculum decision, every hire, and every investment we make in our campus.',
      'We see a future where a Crestview graduate is instantly recognisable: confident without arrogance, principled under pressure, and equipped to thrive whether they pursue medicine in Lagos, engineering abroad, or entrepreneurship of their own making. That is the future we are building, one student at a time.',
    ],
    images: [
      {
        src: '/assets/img-optimized/crestview-hero-03.webp',
        alt: 'Crestview Academy students in class',
      },
      {
        src: '/assets/img-optimized/crestview-hero-04.webp',
        alt: 'Crestview Academy students walking in campus',
      },
    ],
    flip: false,
  },
  {
    id: 'mission',
    eyebrow: 'Our Mission',
    heading: 'Nurturing Minds,\nBuilding Character',
    body: [
      'To provide a rigorous, inclusive, and inspiring education that develops the whole child: intellectually, socially, morally, and physically.',
      'Through exceptional teaching, a rich co-curricular life, and a culture of high expectations, we equip every student with the knowledge, skills, and values needed to thrive in a rapidly changing world. Our classrooms are places of genuine inquiry, where questions are welcomed and mistakes are treated as part of learning rather than something to fear.',
      'At Crestview, we do not just prepare students for examinations, we prepare them for life. That means teaching a child to read fluently, but also teaching them to listen with empathy. It means mastering mathematics, but also learning to lose gracefully on the sports field. Every part of the Crestview experience is designed with this fuller picture of the child in mind.',
    ],
    images: [
      {
        src: '/assets/img-optimized/pupils-playing-02.webp',
        alt: 'Pupils of Crestview Academy playing together',
      },
      {
        src: '/assets/img-optimized/crestview-hero-06.webp',
        alt: 'A view of Crestview Academy',
      },
    ],
    flip: true,
  },
];

const values = [
  {
    number: '01',
    title: 'Excellence',
    body: 'We hold ourselves and our students to high standards, believing that every child is capable of far more than they imagine.',
  },
  {
    number: '02',
    title: 'Integrity',
    body: 'We act honestly and consistently, teaching our students that character is what you do when no one is watching.',
  },
  {
    number: '03',
    title: 'Community',
    body: 'We believe education is a partnership between teachers, parents, and students; stronger together than any one part alone.',
  },
  {
    number: '04',
    title: 'Curiosity',
    body: 'We nurture a genuine love of learning, encouraging students to ask questions and explore ideas beyond the syllabus.',
  },
  {
    number: '05',
    title: 'Respect',
    body: 'We treat every member of our community with dignity, valuing diverse perspectives and individual differences.',
  },
  {
    number: '06',
    title: 'Resilience',
    body: 'We teach students to meet setbacks with persistence, viewing failure as a necessary part of growth.',
  },
];

export default function VisionMissionSection() {
  return (
    <>
      {/* ── Vision & Mission blocks ── */}
      <section className="section-pad bg-(--warm-white)">
        <div className="w-full flex flex-col gap-24 md:gap-32">
          {blocks.map((block, index) => (
            <div
              id={block.id}
              key={index}
              className={cn(
                'grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center',
                block.flip ? 'lg:[&>*:first-child]:order-2' : '',
              )}
            >
              {/* Photos side */}
              <div className="relative h-105 md:h-125">
                <div className="absolute top-0 left-0 w-[45%] h-[72%] overflow-hidden shadow-lg">
                  <Image
                    src={block.images[0].src}
                    alt={block.images[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 65vw, 33vw"
                  />
                  <div className="absolute top-0 left-0 w-6 h-6 bg-terracotta z-10" />
                </div>

                <div className="absolute bottom-0 right-0 w-[52%] h-[55%] overflow-hidden shadow-xl border-4 border-(--warm-white)">
                  <Image
                    src={block.images[1].src}
                    alt={block.images[1].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 52vw, 26vw"
                  />
                </div>

                <div
                  className="absolute bottom-6 left-6 w-24 h-24 -z-10 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, var(--terracotta) 1.5px, transparent 1.5px)',
                    backgroundSize: '10px 10px',
                  }}
                />
              </div>

              {/* Text side */}
              <div
                className={cn(
                  'flex flex-col gap-5',
                  block.flip ? 'xl:ml-30' : 'xl:mr-30',
                )}
              >
                <SectionHeading
                  eyebrow={block.eyebrow}
                  heading={block.heading.replace('\\n', '\n')}
                />
                {block.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Core Values grid ── */}
      <section className="section-pad bg-(--warm-white-dark)">
        <div className="w-full">
          <div className="text-center mb-16">
            <SectionHeading
              eyebrow="Core Values"
              heading="What We Stand For"
              align="center"
            />
            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 max-w-6xl mx-auto">
              Six principles guide every decision we make, from the classroom to
              the boardroom. They are not posters on a wall; they are how we
              operate every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-(--border-sand)">
            {values.map((value) => (
              <div
                key={value.number}
                className="group bg-(--warm-white) hover:bg-terracotta p-8 flex flex-col transition-colors duration-200"
              >
                <span className="font-heading text-4xl text-terracotta-light group-hover:text-white/40 transition-colors duration-200 mb-4">
                  {value.number}
                </span>
                <h3 className="font-heading text-xl text-(--charcoal) group-hover:text-white transition-colors duration-200 mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-(--charcoal-100) group-hover:text-white/80 opacity-80 group-hover:opacity-100 leading-relaxed transition-colors duration-200">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
