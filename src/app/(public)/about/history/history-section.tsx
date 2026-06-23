import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';

const milestones = [
  {
    year: '1994',
    title: 'A Single Classroom, A Powerful Belief',
    body: 'Crestview Academy is founded by a group of passionate educators in the heart of Lagos, opening its doors as a small nursery school. With just one classroom and a handful of pupils, the founders set out with a simple but powerful belief: that every child deserves a world-class education, regardless of where they begin.',
    image: '/assets/img-optimized/Teacher-Parents-meeting.webp',
  },
  {
    year: '1999',
    title: 'Our First Primary Graduating Class',
    body: 'Five years after opening, Crestview celebrates its first cohort of Primary 6 graduates. What began as a nursery school has already proven its model: small class sizes, attentive teachers, and a curriculum that takes each child seriously from the very start.',
    image: '/assets/img-optimized/crestview-hero-02.webp',
  },
  {
    year: '2005',
    title: 'The Secondary School Opens',
    body: 'Responding to demand from families who wanted their children to continue their Crestview education, the school expands to include a full Secondary section. The campus grows to accommodate new laboratories, a library, and dedicated sports facilities.',
    image: '/assets/img-optimized/crestview-hero-03.webp',
  },
  {
    year: '2012',
    title: 'A New Generation of Leadership',
    body: "Crestview welcomes a new generation of school leadership committed to building on the founders' legacy while modernising teaching methods, introducing technology in the classroom, and strengthening our pastoral care system.",
    image: '/assets/img-optimized/crestview-hero-04.webp',
  },
  {
    year: '2018',
    title: 'Recognised Among Lagos Top Schools',
    body: 'Crestview is recognised as one of the top performing private schools in Lagos State, with WAEC pass rates consistently above 95%. Our alumni begin to make their mark in universities and careers across Nigeria and abroad.',
    image: '/assets/img-optimized/students-in-library.webp',
  },
  {
    year: '2024',
    title: 'Three Decades of Excellence',
    body: 'Crestview Academy marks thirty years of shaping lives; having grown from a single classroom into a full Nursery, Primary, and Secondary institution trusted by thousands of families across Lagos and beyond. Our journey continues, rooted in the same values our founders instilled from the very first day.',
    image: '/assets/img-optimized/crestview-hero-06.webp',
  },
];

export default function HistorySection() {
  return (
    <section className="section-pad bg-(--warm-white)">
      <div className="w-full">
        <div className="text-center mb-20">
          <SectionHeading
            eyebrow="Our History"
            heading="Three Decades of Shaping Lives"
            align="center"
          />
          <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 w-full max-w-6xl mx-auto">
            From a single classroom in 1994 to a full Nursery, Primary, and
            Secondary institution every chapter of our story has been shaped by
            one unwavering commitment: excellence in service of every child who
            walks through our gates.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-(--border-sand)"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-16 md:gap-0">
            {milestones.map((milestone, i) => {
              const isRight = i % 2 === 1;
              return (
                <div
                  key={milestone.year}
                  className="relative md:grid md:grid-cols-2 md:gap-x-16 md:py-12"
                >
                  {/* Year dot on spine */}
                  <div className="hidden md:flex absolute left-1/2 top-12 -translate-x-1/2 w-3 h-3 rounded-full bg-terracotta ring-4 ring-(--warm-white) z-10" />

                  {/* Image */}
                  <div
                    className={`relative h-64 md:h-80 overflow-hidden mb-6 md:mb-0 ${
                      isRight ? 'md:order-2' : 'md:order-1'
                    }`}
                  >
                    <Image
                      src={milestone.image}
                      alt={milestone.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Text */}
                  <div
                    className={`flex flex-col justify-center ${
                      isRight
                        ? 'md:order-1 md:items-end md:text-right md:pr-4'
                        : 'md:order-2 md:items-start md:text-left md:pl-4'
                    }`}
                  >
                    <span className="font-heading text-5xl md:text-6xl text-terracotta opacity-90 leading-none mb-3">
                      {milestone.year}
                    </span>
                    <h3 className="font-heading text-2xl md:text-3xl text-(--charcoal) leading-snug mb-3">
                      {milestone.title}
                    </h3>
                    <p className="font-body text-(--charcoal-100) text-sm md:text-base leading-relaxed opacity-80 max-w-md">
                      {milestone.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
