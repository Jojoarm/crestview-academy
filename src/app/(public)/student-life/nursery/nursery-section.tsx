import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';
import {
  BookOpen,
  Calculator,
  Users2,
  Brush,
  Footprints,
  PuzzleIcon,
} from 'lucide-react';

const keyFacts = [
  { label: 'Age Range', value: 'Ages 4–6' },
  { label: 'Class Size', value: '15 Children' },
  { label: 'Teacher Ratio', value: '1 : 8' },
  { label: 'School Hours', value: '8am – 2:00pm' },
];

const learningDomains = [
  {
    icon: BookOpen,
    title: 'Early Literacy',
    body: 'Phonics, letter recognition, and guided reading build the foundation children need before they enter Primary 1 as confident early readers.',
  },
  {
    icon: Calculator,
    title: 'Early Numeracy',
    body: 'Counting, number recognition, simple addition, and pattern-work introduce mathematical thinking through hands-on, concrete activities.',
  },
  {
    icon: Users2,
    title: 'Social & Emotional Skills',
    body: 'Children practise cooperation, conflict resolution, and emotional regulation as their friendships and independence deepen.',
  },
  {
    icon: Brush,
    title: 'Creative Expression',
    body: 'Art, drama, and music remain central — giving children a structured outlet for imagination as their fine motor control improves.',
  },
  {
    icon: Footprints,
    title: 'Physical Development',
    body: 'Structured P.E. and outdoor play build coordination, stamina, and the gross motor skills needed for more demanding Primary activities.',
  },
  {
    icon: PuzzleIcon,
    title: 'Problem Solving',
    body: 'Puzzles, sorting games, and simple science exploration build early logical reasoning and a habit of working through challenges.',
  },
];

const dailySchedule = [
  {
    time: '8:00am',
    activity: 'Arrival & Morning Tasks',
    detail: 'Settling in with a self-directed table activity',
  },
  {
    time: '8:30am',
    activity: 'Morning Circle',
    detail: 'Calendar, weather, news sharing, and the day ahead',
  },
  {
    time: '9:00am',
    activity: 'Literacy Block',
    detail: 'Phonics, letter sounds, and guided reading in small groups',
  },
  {
    time: '10:00am',
    activity: 'Snack & Break',
    detail: 'Healthy snack and supervised free play',
  },
  {
    time: '10:30am',
    activity: 'Numeracy Block',
    detail: 'Counting, shapes, and number activities',
  },
  {
    time: '11:15am',
    activity: 'Outdoor Play',
    detail: 'Structured games and free play on our playground',
  },
  {
    time: '12:00pm',
    activity: 'Lunch',
    detail: 'Shared mealtime with independence in self-feeding and tidying',
  },
  {
    time: '12:45pm',
    activity: 'Creative Studio',
    detail: 'Art, music, or drama (rotates daily)',
  },
  {
    time: '1:30pm',
    activity: 'Story Time & Reflection',
    detail: 'Read-aloud and a recap of what was learned',
  },
  {
    time: '2:00pm',
    activity: 'Dismissal',
    detail: 'Pick-up and a short note home on the day',
  },
];

export default function NurserySection() {
  return (
    <>
      {/* ── Intro + key facts ── */}
      <section className="section-pad bg-(--warm-white)">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center mb-20 lg:[&>*:first-child]:order-2">
            {/* Photos */}
            <div className="relative h-105 md:h-125">
              <div className="absolute top-0 left-0 w-[45%] h-[72%] overflow-hidden shadow-lg">
                <Image
                  src="/assets/img-optimized/crestview-hero-02.webp"
                  alt="Nursery children in class"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 65vw, 33vw"
                />
                <div className="absolute top-0 left-0 w-6 h-6 bg-terracotta z-10" />
              </div>
              <div className="absolute bottom-0 right-0 w-[52%] h-[55%] overflow-hidden shadow-xl border-4 border-(--warm-white)">
                <Image
                  src="/assets/img-optimized/crestview-hero-03.webp"
                  alt="Nursery reading activity"
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

            {/* Text */}
            <div className="flex flex-col">
              <SectionHeading
                eyebrow="Nursery · Ages 4–6"
                heading={`Building Blocks of Brilliance`}
              />
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80 mb-6">
                In our Nursery, children develop foundational literacy,
                numeracy, and social emotional skills in a vibrant, inclusive
                environment. Our experienced early years educators follow a
                structured yet flexible curriculum that meets each child exactly
                where they are.
              </p>
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                This is the year children begin to see themselves as learners,
                sounding out their first words, counting beyond ten, and forming
                the friendships that will carry them into Primary School. We
                treat this transition with the care it deserves: building
                confidence alongside competence.
              </p>
            </div>
          </div>

          {/* Key facts strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-(--border-sand)">
            {keyFacts.map((fact) => (
              <div
                key={fact.label}
                className="bg-(--warm-white-dark) px-6 py-7 flex flex-col items-center text-center"
              >
                <span className="font-heading text-2xl md:text-3xl text-terracotta mb-1">
                  {fact.value}
                </span>
                <span className="font-body text-[10px] uppercase tracking-[0.16em] text-(--charcoal-100) opacity-60">
                  {fact.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What your child will learn ── */}
      <section className="section-pad bg-(--warm-white-dark)">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionHeading
              eyebrow="What They'll Learn"
              heading="Confidence Before Primary 1"
              align="center"
            />
            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              Nursery is where the building blocks of formal learning take
              shape; academically, socially, and physically. Here is how we
              prepare every child for what comes next.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-(--border-sand)">
            {learningDomains.map((domain) => {
              const Icon = domain.icon;
              return (
                <div
                  key={domain.title}
                  className="bg-(--warm-white) p-8 flex flex-col"
                >
                  <div className="w-11 h-11 rounded-full bg-terracotta-pale image-border flex items-center justify-center mb-5">
                    <Icon className="size-5 text-terracotta" />
                  </div>
                  <h3 className="font-heading text-xl text-(--charcoal) mb-3">
                    {domain.title}
                  </h3>
                  <p className="font-body text-sm text-(--charcoal-100) opacity-75 leading-relaxed">
                    {domain.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── A day in the life ── */}
      <section className="section-pad bg-(--warm-white)">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionHeading
              eyebrow="A Day in the Life"
              heading="What a Typical Day Looks Like"
              align="center"
            />
            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              Our Nursery day balances focused learning blocks with play and
              rest, giving children the structure they need without losing the
              joy of being young.
            </p>
          </div>

          <div className="flex flex-col">
            {dailySchedule.map((item, i) => (
              <div
                key={item.time}
                className={`flex gap-6 sm:gap-10 py-5 ${
                  i !== dailySchedule.length - 1
                    ? 'border-b border-(--border-sand)'
                    : ''
                }`}
              >
                <span className="font-heading text-base sm:text-lg text-terracotta w-20 sm:w-24 shrink-0">
                  {item.time}
                </span>
                <div className="flex flex-col">
                  <h3 className="font-body font-semibold text-(--charcoal) text-sm sm:text-base mb-0.5">
                    {item.activity}
                  </h3>
                  <p className="font-body text-(--charcoal-100) text-sm opacity-70">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
