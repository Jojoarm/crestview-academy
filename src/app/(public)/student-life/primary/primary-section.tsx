import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';
import {
  Calculator,
  FlaskConical,
  Globe2,
  Music,
  Trophy,
  Languages,
} from 'lucide-react';

const keyFacts = [
  { label: 'Levels', value: 'Primary 1–6' },
  { label: 'Class Size', value: '22 Pupils' },
  { label: 'Teacher Ratio', value: '1 : 15' },
  { label: 'School Hours', value: '7:45am – 3:00pm' },
];

const subjects = [
  {
    icon: Calculator,
    title: 'Mathematics',
    body: 'A spiral curriculum building from arithmetic fluency to early problem solving and logical reasoning, aligned with Nigerian national standards.',
  },
  {
    icon: Languages,
    title: 'English Studies',
    body: 'Reading comprehension, grammar, and composition writing, with a strong emphasis on confident verbal and written expression.',
  },
  {
    icon: FlaskConical,
    title: 'Basic Science & STEM',
    body: 'Hands-on experiments and introductory coding build scientific curiosity and the analytical habits students carry into Secondary.',
  },
  {
    icon: Globe2,
    title: 'Social Studies & Civic Education',
    body: 'Nigerian history, geography, and citizenship education, helping pupils understand their place in their community and country.',
  },
  {
    icon: Music,
    title: 'Creative & Performing Arts',
    body: 'Music, visual art, and drama remain part of the weekly timetable, not an afterthought; creativity is taken seriously here.',
  },
  {
    icon: Trophy,
    title: 'Physical & Health Education',
    body: 'Structured sports, games, and health education build fitness, teamwork, and the discipline of organised competition.',
  },
];

const dailySchedule = [
  {
    time: '7:45am',
    activity: 'Arrival & Assembly',
    detail: 'Morning assembly with announcements, prayers, and the day ahead',
  },
  {
    time: '8:00am',
    activity: 'Period 1 – Core Subject',
    detail: 'Mathematics or English, alternating by day',
  },
  {
    time: '8:45am',
    activity: 'Period 2 – Core Subject',
    detail: 'English or Mathematics, alternating by day',
  },
  {
    time: '9:30am',
    activity: 'Short Break',
    detail: 'Snack and supervised outdoor play',
  },
  {
    time: '9:50am',
    activity: 'Period 3 – Basic Science / STEM',
    detail: 'Hands-on experiments and applied learning',
  },
  {
    time: '10:35am',
    activity: 'Period 4 – Social Studies',
    detail: 'History, geography, and civic education',
  },
  {
    time: '11:20am',
    activity: 'Long Break & Lunch',
    detail: 'Lunch, rest, and free play',
  },
  {
    time: '12:15pm',
    activity: 'Period 5 – Creative Arts',
    detail: 'Music, art, or drama (rotates by day)',
  },
  {
    time: '1:00pm',
    activity: 'Period 6 – P.E. / Library',
    detail: 'Physical education or guided reading (alternates)',
  },
  {
    time: '1:45pm',
    activity: 'Period 7 – Enrichment',
    detail: 'Coding club, debate, chess, or remedial support',
  },
  {
    time: '2:30pm',
    activity: 'Closing Assembly',
    detail: 'Reflection on the day and dismissal preparation',
  },
  {
    time: '3:00pm',
    activity: 'Dismissal',
    detail: 'Pick up or after-school club transition',
  },
];

export default function PrimarySection() {
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
                  src="/assets/img-optimized/pupils-playing-02.webp"
                  alt="Primary school pupils at the playground"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 65vw, 33vw"
                />
                <div className="absolute top-0 left-0 w-6 h-6 bg-terracotta z-10" />
              </div>
              <div className="absolute bottom-0 right-0 w-[52%] h-[55%] overflow-hidden shadow-xl border-4 border-(--warm-white)">
                <Image
                  src="/assets/img-optimized/student-life-primary-hero.webp"
                  alt="Primary school science activity"
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
                eyebrow="Primary · Primary 1–6"
                heading={`Rooted in\nExcellence`}
              />
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80 mb-6">
                Our Primary School delivers a rigorous, broad curriculum aligned
                with Nigerian national standards and enriched with STEM, arts,
                and leadership experiences. Students build the academic
                confidence and character they need to thrive in Secondary and
                beyond.
              </p>
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                This is where structured subjects, exams, and report cards begin
                in earnest but we hold firmly to the belief that rigour and joy
                are not opposites. Pupils leave Primary 6 not just academically
                prepared, but genuinely excited about what comes next.
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

      {/* ── Curriculum / subjects ── */}
      <section className="section-pad bg-(--warm-white-dark)">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionHeading
              eyebrow="Our Curriculum"
              heading="A Broad, Balanced Education"
              align="center"
            />
            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              We believe a well rounded pupil is built across many subjects, not
              just the ones tested on report cards. Here is what fills the
              Primary timetable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-(--border-sand)">
            {subjects.map((subject) => {
              const Icon = subject.icon;
              return (
                <div
                  key={subject.title}
                  className="bg-(--warm-white) p-8 flex flex-col"
                >
                  <div className="w-11 h-11 rounded-full bg-terracotta-pale image-border flex items-center justify-center mb-5">
                    <Icon className="size-5 text-terracotta" />
                  </div>
                  <h3 className="font-heading text-xl text-(--charcoal) mb-3">
                    {subject.title}
                  </h3>
                  <p className="font-body text-sm text-(--charcoal-100) opacity-75 leading-relaxed">
                    {subject.body}
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
              A full academic timetable balanced with breaks, enrichment, and
              movement, structured enough to build discipline, varied enough to
              hold a child&rsquo;s attention.
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
