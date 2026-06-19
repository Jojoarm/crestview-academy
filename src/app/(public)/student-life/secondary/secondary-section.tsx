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
  { label: 'Levels', value: 'JSS 1–SSS 3' },
  { label: 'Class Size', value: '25 Students' },
  { label: 'Teacher Ratio', value: '1 : 18' },
  { label: 'School Hours', value: '7:45am – 3:30pm' },
];

const subjects = [
  {
    icon: Calculator,
    title: 'Mathematics',
    body: 'From algebra and geometry to statistics and problem solving, students develop the analytical skills required for higher education and future careers.',
  },
  {
    icon: FlaskConical,
    title: 'Sciences',
    body: 'Biology, Chemistry, Physics, and practical laboratory work encourage curiosity, experimentation, and scientific thinking.',
  },
  {
    icon: Languages,
    title: 'English & Literature',
    body: 'Advanced communication, critical reading, composition writing, and literary analysis prepare students for examinations and lifelong learning.',
  },
  {
    icon: Globe2,
    title: 'Humanities & Social Sciences',
    body: 'History, Government, Geography, Economics, and Civic Education help students understand society and their role within it.',
  },
  {
    icon: Music,
    title: 'Creative & Technical Studies',
    body: 'Arts, music, design, and technology subjects allow students to explore talents and develop practical skills alongside academics.',
  },
  {
    icon: Trophy,
    title: 'Leadership & Sports',
    body: 'Student leadership, clubs, competitions, and athletics build confidence, teamwork, resilience, and personal responsibility.',
  },
];

const dailySchedule = [
  {
    time: '7:45am',
    activity: 'Arrival & Assembly',
    detail: 'Morning assembly, announcements, and preparation for the day',
  },
  {
    time: '8:00am',
    activity: 'Period 1',
    detail: 'Core subject instruction',
  },
  {
    time: '8:45am',
    activity: 'Period 2',
    detail: 'Core subject instruction',
  },
  {
    time: '9:30am',
    activity: 'Short Break',
    detail: 'Refreshments and social time',
  },
  {
    time: '9:50am',
    activity: 'Period 3',
    detail: 'Science, humanities, or language studies',
  },
  {
    time: '10:35am',
    activity: 'Period 4',
    detail: 'Subject-specific learning and practical activities',
  },
  {
    time: '11:20am',
    activity: 'Long Break & Lunch',
    detail: 'Lunch and recreation',
  },
  {
    time: '12:15pm',
    activity: 'Period 5',
    detail: 'Laboratory, technical, or elective subjects',
  },
  {
    time: '1:00pm',
    activity: 'Period 6',
    detail: 'Specialised subject instruction',
  },
  {
    time: '1:45pm',
    activity: 'Period 7',
    detail: 'Clubs, leadership programmes, sports, or enrichment',
  },
  {
    time: '2:30pm',
    activity: 'Study & Mentoring',
    detail: 'Guided study, mentoring, and academic support',
  },
  {
    time: '3:30pm',
    activity: 'Dismissal',
    detail: 'End of school day and transition to extracurricular activities',
  },
];

export default function SecondarySection() {
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
                  src="/assets/img-optimized/crestview-hero-03.webp"
                  alt="Secondary school pupils in class"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 65vw, 33vw"
                />
                <div className="absolute top-0 left-0 w-6 h-6 bg-terracotta z-10" />
              </div>
              <div className="absolute bottom-0 right-0 w-[52%] h-[55%] overflow-hidden shadow-xl border-4 border-(--warm-white)">
                <Image
                  src="/assets/img-optimized/crestview-hero-04.webp"
                  alt="Secondary school science activity"
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
                eyebrow="Secondary · JSS 1–SSS 3"
                heading={`Preparing Students\nfor the Future`}
              />

              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80 mb-6">
                Our Secondary School combines academic excellence with
                leadership, character development, and practical learning
                experiences. Students are challenged to think critically,
                communicate confidently, and take increasing responsibility for
                their own success.
              </p>

              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                Through a rigorous curriculum, dedicated teachers, and a culture
                of high expectations, students graduate fully prepared for WAEC,
                NECO, university studies, and the opportunities that await
                beyond school.
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
              heading="Academic Rigour with Real-World Relevance"
              align="center"
            />

            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              Our Secondary curriculum balances strong examination preparation
              with leadership, creativity, technology, and the broader skills
              students need to succeed in a changing world.
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
              heading="A Structured Path to Success"
              align="center"
            />

            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 max-w-2xl mx-auto">
              Each day combines focused academics, practical learning,
              leadership opportunities, and personal development, creating an
              environment where students can excel both inside and outside the
              classroom.
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
