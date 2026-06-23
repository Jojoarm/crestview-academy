import SectionHeading from '@/components/SectionHeading';

const cycle = [
  {
    phase: 'Plan',
    period: 'Start of term',
    description:
      "Every department submits a term plan aligned to the NERDC syllabus and the school's internal assessment calendar. Heads of department review each plan before teaching begins, not after.",
  },
  {
    phase: 'Deliver',
    period: 'Throughout term',
    description:
      'Teachers deliver lessons against the approved plan. Unannounced lesson observations by the academic director and department heads take place each term. Feedback is written, specific, and acted on within the same week.',
  },
  {
    phase: 'Assess',
    period: 'Mid and end of term',
    description:
      'Students sit formal mid-term and end-of-term assessments under examination conditions. Results are entered into our tracking system within 48 hours and reviewed at department level before report cards are issued.',
  },
  {
    phase: 'Review',
    period: 'End of term',
    description:
      'A full academic review meeting examines class-by-class results, flags any student falling below expected progress, and produces a written action plan for the following term. No cohort leaves a term without a documented plan.',
  },
  {
    phase: 'Improve',
    period: 'Between terms',
    description:
      'Teachers whose classes underperformed receive targeted professional development before the next term begins. Students who need intervention are contacted directly, with remedial programmes offered before resumption.',
  },
];

const standards = [
  {
    area: 'Lesson Quality',
    criteria: [
      'Clear learning objective communicated at the start of every lesson',
      'Differentiated tasks for students working above and below grade level',
      'Exit checks confirming understanding before topic progression',
      'Marked classwork returned within five school days',
    ],
  },
  {
    area: 'Assessment Integrity',
    criteria: [
      'All assessments set and moderated by at least two teachers',
      'Marking schemes approved before papers are distributed',
      'Student scripts retained for one full academic year',
      'Grade queries resolved within three school days',
    ],
  },
  {
    area: 'Teacher Standards',
    criteria: [
      'Minimum of one formal observation per term per teacher',
      'Written performance review at the end of every academic year',
      'Mandatory CPD hours met before annual contract renewal',
      'New teachers complete a structured induction programme',
    ],
  },
  {
    area: 'Reporting to Parents',
    criteria: [
      'Written report cards issued at the end of every term',
      'Parent-teacher meetings held once per term',
      'Academic concerns communicated within 48 hours of identification',
      'End-of-year summary includes recommended actions for the holiday',
    ],
  },
];

const cpd = [
  {
    index: '01',
    title: 'Subject Mastery',
    body: 'Every teacher completes annual subject specific professional development to stay current with WAEC and NECO syllabus updates and marking scheme expectations.',
  },
  {
    index: '02',
    title: 'Pedagogical Training',
    body: 'Whole school training each term covers evidence based teaching methods: formative assessment, retrieval practice, and differentiation, with direct application to classroom delivery.',
  },
  {
    index: '03',
    title: 'Peer Observation',
    body: 'Teachers observe colleagues once per term as a structured professional exercise, not an evaluation. Written reflections feed into department discussions.',
  },
  {
    index: '04',
    title: 'External Accreditation',
    body: 'Senior staff hold or are working toward nationally recognised teaching qualifications. Professional development records are maintained and available to parents on request.',
  },
];

export default function QualityAssuranceSection() {
  return (
    <>
      <section className="section-pad bg-(--warm-white)">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 xl:gap-24 items-start">
            <SectionHeading
              eyebrow="Our Commitment"
              heading={'Accountability Built Into Every Term'}
            />
            <div className="lg:pt-10 space-y-5">
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                Quality assurance at Crestview is not an annual exercise or an
                external compliance requirement. It is a termly cycle embedded
                into how we plan, teach, assess, and report at every level, in
                every subject, for every student.
              </p>
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                We believe parents deserve to know not just what we teach, but
                how we verify that it is being taught well, what happens when it
                is not, and how we ensure that every teacher in this school
                meets the standard we have set. This page answers those
                questions directly.
              </p>
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                Every process described here is documented, reviewed, and
                audited. We do not ask parents to take our word for it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-(--warm-white-dark)">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 xl:gap-20 mb-16">
            <SectionHeading
              eyebrow="The QA Cycle"
              heading="How We Monitor Quality Every Term"
            />
            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 lg:pt-10">
              Our quality assurance cycle runs continuously across the academic
              year. Each phase feeds into the next, there is no point in the
              calendar where standards are not being actively monitored.
            </p>
          </div>

          <div className="flex flex-col">
            {cycle.map((item, i) => (
              <div
                key={item.phase}
                className={`grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-4 md:gap-12 py-8 border-t border-(--border-sand) ${
                  i === cycle.length - 1
                    ? 'border-b border-(--border-sand)'
                    : ''
                }`}
              >
                <div className="flex md:flex-col gap-3 md:gap-1">
                  <span className="font-heading text-xl text-(--charcoal)">
                    {item.phase}
                  </span>
                  <span className="font-body text-xs uppercase tracking-[0.14em] text-terracotta opacity-70 md:mt-1">
                    {item.period}
                  </span>
                </div>
                <p className="font-body text-sm md:text-base text-(--charcoal-100) opacity-75 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. STANDARDS — two-column definition list ── */}
      <section className="section-pad bg-(--warm-white)">
        <div className="w-full">
          <div className="mb-16">
            <SectionHeading
              eyebrow="Our Standards"
              heading="What We Hold Ourselves To"
            />
            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 max-w-7xl">
              These are not aspirational values. They are operational
              requirements; documented, monitored, and reported on every term.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-(--border-sand)">
            {standards.map((block) => (
              <div key={block.area} className="bg-(--warm-white) p-8 md:p-10">
                <h3 className="font-heading text-lg text-(--charcoal) mb-6 pb-4 border-b border-(--border-sand)">
                  {block.area}
                </h3>
                <ul className="flex flex-col gap-3">
                  {block.criteria.map((criterion) => (
                    <li key={criterion} className="flex gap-3 items-baseline">
                      <span className="w-1 h-1 rounded-full bg-terracotta shrink-0 mt-2" />
                      <span className="font-body text-sm text-(--charcoal-100) opacity-75 leading-relaxed">
                        {criterion}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TEACHER DEVELOPMENT — ruled index, varied from above ── */}
      <section className="section-pad bg-(--warm-white-dark)">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 xl:gap-20 mb-16">
            <SectionHeading
              eyebrow="Teacher Development"
              heading="Investing in the People in the Classroom"
            />
            <p className="font-body text-(--charcoal-100) text-base md:text-lg leading-relaxed opacity-80 lg:pt-10">
              The single greatest factor in student outcomes is teacher quality.
              We invest in our teachers continuously, not as a perk but as a non
              negotiable condition of the standard we hold ourselves to.
            </p>
          </div>

          <div className="flex flex-col">
            {cpd.map((item, i) => (
              <div
                key={item.index}
                className="grid grid-cols-[3rem_1fr] md:grid-cols-[3rem_1fr_2fr] gap-x-8 md:gap-x-12 py-8 border-t border-(--border-sand) items-baseline"
              >
                <span className="font-heading text-sm text-terracotta opacity-50 pt-0.5">
                  {item.index}
                </span>
                <h3 className="font-heading text-xl md:text-2xl text-(--charcoal) mb-3 md:mb-0">
                  {item.title}
                </h3>
                <p className="col-start-2 md:col-start-3 font-body text-sm text-(--charcoal-100) opacity-70 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
            <div className="border-t border-(--border-sand)" />
          </div>
        </div>
      </section>
    </>
  );
}
