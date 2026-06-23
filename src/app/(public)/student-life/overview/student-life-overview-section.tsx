import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

const journey = [
  {
    id: 'kindergarten',
    label: 'Kindergarten',
    ageRange: 'Ages 2–4',
    focus: 'Play & Discovery',
    classSize: '12 children',
    href: '/student-life/kindergarten',
  },
  {
    id: 'nursery',
    label: 'Nursery',
    ageRange: 'Ages 4–6',
    focus: 'Early Literacy & Numeracy',
    classSize: '15 children',
    href: '/student-life/nursery',
  },
  {
    id: 'primary',
    label: 'Primary',
    ageRange: 'Primary 1–6',
    focus: 'Core Academics & STEM',
    classSize: '22 children',
    href: '/student-life/primary',
  },
  {
    id: 'secondary',
    label: 'Secondary',
    ageRange: 'JSS1–SS3',
    focus: 'Exam Prep & Leadership',
    classSize: '25 students',
    href: '/student-life/secondary',
  },
];

const dailyMoments = [
  {
    time: '7:45 AM',
    title: 'Morning Assembly',
    description:
      'Every day begins together, songs, announcements, and a shared moment of focus before lessons start.',
  },
  {
    time: '9:00 AM',
    title: 'Core Lessons',
    description:
      'Focused academic blocks, kept short enough to hold attention and structured around how children actually learn best.',
  },
  {
    time: '12:30 PM',
    title: 'Lunch & Free Play',
    description:
      'A proper break to eat, run, and socialise, because well-rested minds learn better than tired ones.',
  },
  {
    time: '2:00 PM',
    title: 'Clubs & Co-curriculars',
    description:
      'Sports, arts, debate, coding, music. Every child finds something that is entirely their own.',
  },
];

export default function StudentLifeOverviewSection() {
  return (
    <>
      {/* ── Journey timeline ── */}
      <section className="section-pad bg-background">
        <div className="max-w-7xl mx-auto mb-14">
          <SectionHeading
            eyebrow="One School, One Journey"
            heading="From First Steps to Final Exams"
            align="center"
          />
          <p className="font-body text-foreground-100 text-base text-center leading-relaxed opacity-75">
            A child who joins us in Kindergarten can graduate from the same
            school in SS3, taught by people who have known them the whole way.
            Here is what that journey looks like.
          </p>
        </div>

        {/* Connected horizontal timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-border" />

          <div className="grid grid-cols-1 min-[370px]:grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {journey.map((stage, i) => (
              <Link
                key={stage.id}
                href={stage.href}
                className="group relative flex flex-col"
              >
                {/* Node */}
                <div className="relative z-10 mb-5 flex items-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <span className="font-heading text-primary group-hover:text-white text-sm font-bold transition-colors duration-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-heading text-foreground text-xl font-semibold mb-1 group-hover:text-primary transition-colors duration-200">
                  {stage.label}
                </h3>
                <span className="font-body text-primary text-xs font-semibold tracking-wide uppercase mb-3">
                  {stage.ageRange}
                </span>
                <p className="font-body text-foreground-100 text-sm leading-relaxed opacity-75 mb-4">
                  {stage.focus}
                </p>
                <span className="inline-flex items-center gap-1.5 text-foreground text-xs font-body font-medium tracking-wide group-hover:gap-3 transition-all duration-200">
                  Learn More
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── A day at Crestview ── */}
      <section className="section-pad bg-background-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          {/* Left: heading + image */}
          <div className="flex flex-col">
            <SectionHeading
              eyebrow="A Typical Day"
              heading="What Your Child's Day Actually Looks Like"
            />
            <p className="font-body text-foreground-100 text-base leading-relaxed opacity-75 mb-8">
              Every level has its own rhythm, but every day at Crestview follows
              the same philosophy: structure that feels natural, and enough room
              for a child to be a child.
            </p>
            <div className="relative w-full h-72 overflow-hidden">
              <Image
                src="/assets/img-optimized/student-learning-03.webp"
                alt="A day at Crestview Academy"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right: timeline of moments */}
          <div className="flex flex-col">
            {dailyMoments.map((moment, i) => (
              <div
                key={i}
                className="flex gap-5 pb-8 last:pb-0 border-b border-border last:border-0"
              >
                <span className="font-heading text-primary text-sm font-bold tracking-wide shrink-0 w-20 pt-0.5">
                  {moment.time}
                </span>
                <div>
                  <h4 className="font-body font-semibold text-foreground text-base mb-1.5">
                    {moment.title}
                  </h4>
                  <p className="font-body text-foreground-100 text-sm leading-relaxed opacity-70">
                    {moment.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── At a glance comparison ── */}
      <section className="section-pad bg-background">
        <div className="max-w-2xl mb-12">
          <SectionHeading
            eyebrow="At a Glance"
            heading="Every Level, Side by Side"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-160 border-collapse">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="text-left font-body text-xs font-semibold tracking-[0.15em] uppercase text-foreground-100 opacity-60 pb-4 pr-6">
                  Level
                </th>
                <th className="text-left font-body text-xs font-semibold tracking-[0.15em] uppercase text-foreground-100 opacity-60 pb-4 pr-6">
                  Age Range
                </th>
                <th className="text-left font-body text-xs font-semibold tracking-[0.15em] uppercase text-foreground-100 opacity-60 pb-4 pr-6">
                  Core Focus
                </th>
                <th className="text-left font-body text-xs font-semibold tracking-[0.15em] uppercase text-foreground-100 opacity-60 pb-4">
                  Class Size
                </th>
              </tr>
            </thead>
            <tbody>
              {journey.map((stage) => (
                <tr key={stage.id} className="border-b border-border group">
                  <td className="py-5 pr-6">
                    <Link
                      href={stage.href}
                      className="font-heading text-foreground text-base font-semibold group-hover:text-primary transition-colors duration-200"
                    >
                      {stage.label}
                    </Link>
                  </td>
                  <td className="py-5 pr-6 font-body text-foreground-100 text-sm opacity-75">
                    {stage.ageRange}
                  </td>
                  <td className="py-5 pr-6 font-body text-foreground-100 text-sm opacity-75">
                    {stage.focus}
                  </td>
                  <td className="py-5 font-body text-foreground-100 text-sm opacity-75">
                    {stage.classSize}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
