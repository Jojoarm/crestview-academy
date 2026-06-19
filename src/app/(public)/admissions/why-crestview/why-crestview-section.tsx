import SectionHeading from '@/components/SectionHeading';

const reasons = [
  {
    number: '01',
    title: 'Proven Academic Results',
    description:
      'A consistent record of strong WAEC and NECO outcomes, with graduates gaining admission into top universities across Nigeria and abroad.',
  },
  {
    number: '02',
    title: 'Experienced, Caring Educators',
    description:
      'Our teachers are not just qualified, they are mentors who know every child by name and invest in their individual growth.',
  },
  {
    number: '03',
    title: 'Holistic Development',
    description:
      'Beyond academics, we nurture character, leadership, sports, and the arts, raising well-rounded young people prepared for life.',
  },
  {
    number: '04',
    title: 'Safe, Modern Facilities',
    description:
      'A secure campus equipped with modern classrooms, science labs, and recreational spaces designed for every stage of learning.',
  },
  {
    number: '05',
    title: 'Strong Parent Partnership',
    description:
      "We believe education is a partnership. Regular communication keeps families informed and involved in every step of their child's journey.",
  },
  {
    number: '06',
    title: 'A Legacy of Excellence',
    description:
      'For over three decades, Crestview Academy has built a reputation Lagos families trust, generation after generation.',
  },
];

export default function WhyCrestviewSection() {
  return (
    <section className="section-pad bg-background">
      <div className="max-w-7xl mx-auto mb-16">
        <SectionHeading
          eyebrow="The Crestview Difference"
          heading="Six Reasons Families Choose Us"
          align="center"
        />
        <p className="font-body text-foreground-100 text-base leading-relaxed text-center opacity-75">
          Choosing a school is one of the most important decisions a family
          makes. Here is what generations of Crestview parents say sets us
          apart.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {reasons.map((reason) => (
          <div key={reason.number} className="flex flex-col">
            <span className="font-heading text-primary text-3xl font-bold leading-none mb-4 opacity-90">
              {reason.number}
            </span>
            <div className="w-8 h-0.5 bg-primary mb-5" />
            <h3 className="font-heading text-foreground text-lg font-semibold leading-snug mb-3">
              {reason.title}
            </h3>
            <p className="font-body text-foreground-100 text-sm leading-relaxed opacity-75">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
