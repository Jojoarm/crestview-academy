import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';
import {
  Sparkles,
  Heart,
  MessageCircle,
  Palette,
  Sun,
  Users,
} from 'lucide-react';

const keyFacts = [
  { label: 'Age Range', value: 'Ages 2–4' },
  { label: 'Class Size', value: '12 Children' },
  { label: 'Teacher Ratio', value: '1 : 6' },
  { label: 'School Hours', value: '8am – 1:30pm' },
];

const learningDomains = [
  {
    icon: Heart,
    title: 'Social & Emotional Growth',
    body: 'Children learn to share, take turns, name their feelings, and build their first real friendships in a safe, supervised setting.',
  },
  {
    icon: MessageCircle,
    title: 'Language & Communication',
    body: 'Daily storytelling, songs, and conversation build vocabulary and confidence in speaking up; the foundation for all future literacy.',
  },
  {
    icon: Sparkles,
    title: 'Curiosity & Discovery',
    body: 'Guided sensory play and simple experiments nurture a natural love of asking "why?"; the most important habit we can build early.',
  },
  {
    icon: Palette,
    title: 'Creativity & Expression',
    body: 'Art, music, and imaginative play give every child a way to express themselves long before they have all the words.',
  },
  {
    icon: Sun,
    title: 'Movement & Motor Skills',
    body: 'Outdoor play and structured movement activities build coordination, balance, and the fine motor skills needed for writing later on.',
  },
  {
    icon: Users,
    title: 'Independence & Routine',
    body: 'Simple daily routines like washing hands, tidying up, lining up build the self sufficiency children need as they grow.',
  },
];

const dailySchedule = [
  {
    time: '8:00am',
    activity: 'Arrival & Free Play',
    detail: 'Warm welcome, settling in, quiet toys and puzzles',
  },
  {
    time: '8:30am',
    activity: 'Morning Circle',
    detail: 'Songs, calendar, weather, and the day ahead',
  },
  {
    time: '9:00am',
    activity: 'Guided Learning',
    detail: 'Letters, numbers, and shapes through hands-on play',
  },
  {
    time: '10:00am',
    activity: 'Snack Time',
    detail: 'Healthy snack and social conversation',
  },
  {
    time: '10:30am',
    activity: 'Outdoor Play',
    detail: 'Movement, climbing, and fresh air on our playground',
  },
  {
    time: '11:15am',
    activity: 'Creative Studio',
    detail: 'Art, music, or imaginative play (rotates daily)',
  },
  {
    time: '12:00pm',
    activity: 'Lunch',
    detail: 'Shared mealtime, building table manners and conversation',
  },
  {
    time: '12:45pm',
    activity: 'Story Time & Rest',
    detail: 'Read-aloud followed by a quiet wind-down',
  },
  {
    time: '1:30pm',
    activity: 'Dismissal',
    detail: 'Pick-up and a recap of the day for parents',
  },
];

export default function KindergartenSection() {
  return (
    <>
      {/* ── Intro + key facts ── */}
      <section className="section-pad bg-(--warm-white)">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center mb-20">
            {/* Photos */}
            <div className="relative h-105 md:h-125">
              <div className="absolute top-0 left-0 w-[45%] h-[72%] overflow-hidden shadow-lg">
                <Image
                  src="/assets/img-optimized/crestview-hero-01.webp"
                  alt="Kindergarten children at play"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 65vw, 33vw"
                />
                <div className="absolute top-0 left-0 w-6 h-6 bg-terracotta z-10" />
              </div>
              <div className="absolute bottom-0 right-0 w-[52%] h-[55%] overflow-hidden shadow-xl border-4 border-(--warm-white)">
                <Image
                  src="/assets/img-optimized/crestview-hero-02.webp"
                  alt="Kindergarten classroom activity"
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
                eyebrow="Kindergarten · Ages 2–4"
                heading={`Where Every Journey Begins`}
              />
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80 mb-6">
                Our Kindergarten programme provides a warm, play based
                foundation that nurtures curiosity, creativity, and early social
                skills. Through structured play, storytelling, and guided
                discovery, we prepare the youngest learners for a lifelong love
                of learning.
              </p>
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                This is often a child&rsquo;s very first experience away from
                home so everything about our Kindergarten classroom is designed
                around comfort, warmth, and gentle structure. Small class sizes
                mean our teachers know every child by name, by personality, and
                by what makes them light up.
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
              heading="Growing in Every Direction"
              align="center"
            />
            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              Kindergarten is not just preparation for &ldquo;real
              school&rdquo;, it is its own vital stage of growth. Here is how we
              nurture the whole child, every single day.
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
              Predictable routines help young children feel safe and confident.
              Here is a sample of how our Kindergarten day unfolds.
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
