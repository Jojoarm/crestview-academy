import SectionHeading from '@/components/SectionHeading';

const steps = [
  {
    number: '01',
    title: 'Submit Your Enquiry',
    description:
      "Complete our online enquiry form or visit the school office with your child's basic details. Our admissions team will respond within 48 hours.",
    detail: 'Takes 5 minutes',
  },
  {
    number: '02',
    title: 'Schedule a Visit',
    description:
      'Tour the campus, meet our teachers, and see classrooms in session. This helps you and your child get a true feel for life at Crestview.',
    detail: 'By appointment',
  },
  {
    number: '03',
    title: 'Entrance Assessment',
    description:
      "Candidates take an age-appropriate assessment in literacy and numeracy, designed to understand each child's starting point, not to gatekeep.",
    detail: 'Saturday mornings',
  },
  {
    number: '04',
    title: 'Submit Documentation',
    description:
      'Provide birth certificate, passport photographs, previous school report (where applicable), and immunisation records.',
    detail: 'Checklist provided',
  },
  {
    number: '05',
    title: 'Offer & Acceptance',
    description:
      "Successful candidates receive an official offer letter. Secure your child's place by accepting and paying the acceptance fee.",
    detail: 'Within 2 weeks',
  },
  {
    number: '06',
    title: 'Welcome to Crestview',
    description:
      "Attend our new family orientation, receive your resumption checklist, and meet your child's class teacher ahead of their first day.",
    detail: 'Before resumption',
  },
];

export default function AdmissionProcessSection() {
  return (
    <section className="section-pad bg-background">
      <div className="max-w-7xl mx-auto mb-16 lg:mb-24">
        <SectionHeading
          eyebrow="How It Works"
          heading="Your Path to Crestview, in Six Steps"
          align="center"
        />
        <p className="font-body text-foreground-100 text-base text-center leading-relaxed opacity-75">
          We have kept admissions simple and transparent. Here is exactly what
          to expect, from your first enquiry to your child&apos;s first day with
          us.
        </p>
      </div>

      {/* ── Desktop: connected vertical timeline ── */}
      <div className="hidden lg:block relative">
        {/* Connecting line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

        <div className="flex flex-col gap-0">
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={step.number}
                className="relative grid grid-cols-2 gap-20 py-12 first:pt-0 last:pb-0"
              >
                {/* Left column */}
                <div className={isLeft ? 'flex justify-end text-right' : ''}>
                  {isLeft && <StepContent step={step} />}
                </div>

                {/* Right column */}
                <div className={!isLeft ? '' : ''}>
                  {!isLeft && <StepContent step={step} />}
                </div>

                {/* Center node */}
                <div className="absolute left-1/2 top-12 -translate-x-1/2 z-10">
                  <NumberBadge number={step.number} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile / tablet: stacked sequence ── */}
      <div className="flex flex-col lg:hidden">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="relative flex gap-5 pb-10 last:pb-0"
          >
            {/* Connector line + node */}
            <div className="flex flex-col items-center shrink-0">
              <NumberBadge number={step.number} small />
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-border mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="pb-2">
              <span className="font-body text-primary text-[10px] font-semibold tracking-[0.2em] uppercase">
                {step.detail}
              </span>
              <h3 className="font-heading text-foreground text-xl font-semibold leading-snug mt-2 mb-2">
                {step.title}
              </h3>
              <p className="font-body text-foreground-100 text-sm leading-relaxed opacity-75">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Step content block (desktop) ──────────────────────────────────────────────
function StepContent({ step }: { step: (typeof steps)[number] }) {
  return (
    <div className="max-w-md">
      <span className="font-body text-primary text-[10px] font-semibold tracking-[0.2em] uppercase">
        {step.detail}
      </span>
      <h3 className="font-heading text-foreground text-2xl font-semibold leading-snug mt-2 mb-3">
        {step.title}
      </h3>
      <p className="font-body text-foreground-100 text-sm leading-relaxed opacity-75">
        {step.description}
      </p>
    </div>
  );
}

// ── Notched number badge — signature element ──────────────────────────────────
function NumberBadge({
  number,
  small = false,
}: {
  number: string;
  small?: boolean;
}) {
  const size = small ? 44 : 56;
  return (
    <div
      className="relative flex items-center justify-center bg-primary"
      style={{
        width: size,
        height: size,
        clipPath:
          'polygon(0% 15%, 15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%)',
      }}
    >
      <span
        className={`font-heading text-white font-bold ${small ? 'text-sm' : 'text-base'}`}
      >
        {number}
      </span>
    </div>
  );
}
