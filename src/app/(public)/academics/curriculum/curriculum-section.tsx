import SectionHeading from '@/components/SectionHeading';
import {
  BarChart3,
  BookOpenCheck,
  FlaskConical,
  GraduationCap,
  Layers,
  Users,
} from 'lucide-react';

// ── Data ───────────────────────────────────────────────────────

const results = [
  {
    value: '94%',
    label: 'WAEC credit pass rate',
    sub: 'five subjects or more',
  },
  { value: '98%', label: 'NECO pass rate', sub: 'last three years' },
  { value: '100%', label: 'university placement', sub: 'graduating class' },
  { value: '18+', label: 'years of results', sub: 'consistent track record' },
];

const pillars = [
  {
    icon: BookOpenCheck,
    title: 'NERDC-Aligned Core',
    body: 'Every subject from Primary 1 to SSS 3 follows the Nigerian Educational Research and Development Council framework, ensuring full alignment with national examinations and tertiary entrance requirements.',
  },
  {
    icon: FlaskConical,
    title: 'STEM Integration',
    body: 'Science, Technology, Engineering, and Mathematics are woven across all levels, from introductory coding in Primary to full laboratory practicals in Senior Secondary.',
  },
  {
    icon: Layers,
    title: 'Structured Progression',
    body: 'Our curriculum is designed as a continuous ladder. What a child learns in Nursery connects deliberately to Primary, which connects to JSS, then SSS. Every year builds on the last.',
  },
  {
    icon: Users,
    title: 'Small-Group Instruction',
    body: 'Low teacher-to-student ratios mean our teachers identify gaps early and close them before they compound, not at exam season.',
  },
  {
    icon: BarChart3,
    title: 'Continuous Assessment',
    body: 'Regular tests, class assignments, and termly mock examinations give students repeated exposure to examination conditions and give teachers the data to adjust in real time.',
  },
  {
    icon: GraduationCap,
    title: 'Examination Preparation',
    body: 'From BECE in JSS 3 to WAEC and NECO in SSS 3, students receive structured preparation, past-question practice, and one-on-one support in the terms that matter most.',
  },
];

const levels = [
  { level: 'Kindergarten', ages: 'Ages 2–4', exams: 'Internal assessment' },
  { level: 'Nursery', ages: 'Ages 4–6', exams: 'Internal assessment' },
  { level: 'Primary 1–6', ages: 'Ages 6–12', exams: 'Common Entrance · NPSE' },
  { level: 'JSS 1–3', ages: 'Ages 12–15', exams: 'BECE' },
  { level: 'SSS 1–3', ages: 'Ages 15–18', exams: 'WAEC · NECO · UTME' },
];

const approaches = [
  {
    step: '01',
    title: 'Teach',
    body: 'Concepts introduced with worked examples and real world context to anchor new knowledge in something students already understand.',
  },
  {
    step: '02',
    title: 'Practise',
    body: 'Guided exercises, group work, and hands-on activities give students time to apply before moving on.',
  },
  {
    step: '03',
    title: 'Assess',
    body: 'Regular short assessments tell teachers exactly where each student stands. Results inform the next lesson, not just the report card.',
  },
  {
    step: '04',
    title: 'Support',
    body: 'Students who need more time get it, through targeted small group sessions and holiday revision before major examinations.',
  },
];

export default function CurriculumSection() {
  return (
    <>
      <section className="section-pad bg-(--charcoal)">
        <div className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {results.map((r) => (
              <div key={r.label} className="px-6 py-12 md:py-16 flex flex-col">
                <span className="font-heading text-5xl md:text-6xl xl:text-7xl text-terracotta leading-none mb-3">
                  {r.value}
                </span>
                <span className="font-body text-sm text-white opacity-80 leading-snug mb-1">
                  {r.label}
                </span>
                <span className="font-body text-[10px] uppercase tracking-[0.14em] text-white opacity-35">
                  {r.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-(--warm-white)">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
            <div className="w-full">
              <SectionHeading
                eyebrow="Our Framework"
                heading={'A NERDC Curriculum\nTaught Without Compromise'}
              />
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80 mb-5">
                Crestview Academy follows the Nigerian Educational Research and
                Development Council curriculum across all levels. The NERDC
                framework, taught well, produces students who are fully prepared
                for WAEC, NECO, and Nigerian university entrance. Our results
                prove it.
              </p>
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                What separates us is not the framework, it is how we deliver it:
                specialist teachers at every level, a culture of continuous
                assessment, and an uncompromising standard for what
                &ldquo;prepared&rdquo; means before a student sits an external
                examination.
              </p>
            </div>

            {/* Level ladder — quiet, data-forward */}
            <div className="lg:w-96 w-full border border-(--border-sand) divide-y divide-(--border-sand) shrink-0">
              <div className="grid grid-cols-3 px-5 py-3 bg-(--warm-white-dark)">
                <span className="font-body text-[10px] uppercase tracking-[0.14em] text-(--charcoal-100) opacity-50">
                  Level
                </span>
                <span className="font-body text-[10px] uppercase tracking-[0.14em] text-(--charcoal-100) opacity-50">
                  Ages
                </span>
                <span className="font-body text-[10px] uppercase tracking-[0.14em] text-(--charcoal-100) opacity-50 text-right">
                  Examination
                </span>
              </div>
              {levels.map((row) => (
                <div key={row.level} className="grid grid-cols-3 px-5 py-4">
                  <span className="font-body font-semibold text-sm text-(--charcoal)">
                    {row.level}
                  </span>
                  <span className="font-body text-sm text-(--charcoal-100) opacity-60">
                    {row.ages}
                  </span>
                  <span className="font-body text-xs text-(--charcoal-100) opacity-50 text-right">
                    {row.exams}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. PILLARS — ruled index list, no cards ── */}
      <section className="section-pad bg-(--warm-white-dark)">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 xl:gap-20 mb-16">
            <SectionHeading
              eyebrow="What Makes It Work"
              heading="Six Things We Do Differently"
            />
            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 lg:pt-10">
              Following a national curriculum is the baseline. These are the
              decisions on top of it that actually move the needle on results.
            </p>
          </div>

          <div className="flex flex-col">
            {pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="grid grid-cols-[3rem_1fr] md:grid-cols-[3rem_1fr_2fr] gap-x-8 md:gap-x-12 py-8 border-t border-(--border-sand) items-baseline"
              >
                {/* Index */}
                <span className="font-heading text-sm text-terracotta opacity-50 pt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Title */}
                <h3 className="font-heading text-xl md:text-2xl text-(--charcoal) mb-3 md:mb-0">
                  {pillar.title}
                </h3>

                {/* Body — hidden on mobile under title */}
                <p className="col-start-2 md:col-start-3 font-body text-sm text-(--charcoal-100) opacity-70 leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            ))}
            <div className="border-t border-(--border-sand)" />
          </div>
        </div>
      </section>

      {/* ── 4. TEACHING METHOD — minimal, wide, breathing room ── */}
      <section className="section-pad bg-(--warm-white)">
        <div className="w-full">
          {/* Header pinned left, deliberately asymmetric */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 xl:gap-20">
            <div>
              <SectionHeading
                eyebrow="Our Teaching Method"
                heading={'How Every\nLesson Works'}
              />
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                Every lesson at Crestview follows the same four part structure.
                Simple methods, applied consistently, are what produce
                consistent results.
              </p>
            </div>

            {/* Steps in a 2×2 grid rather than a list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-(--border-sand)">
              {approaches.map((item) => (
                <div key={item.step} className="bg-(--warm-white) p-8">
                  <span className="font-heading text-4xl text-terracotta opacity-20 leading-none block mb-4">
                    {item.step}
                  </span>
                  <h3 className="font-heading text-xl text-(--charcoal) mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-(--charcoal-100) opacity-75 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
