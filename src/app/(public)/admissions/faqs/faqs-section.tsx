'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

const categories = [
  {
    id: 'admissions',
    label: 'Admissions',
    questions: [
      {
        q: 'What age does my child need to be to apply?',
        a: "Kindergarten admits from age 2, Nursery from age 4, Primary 1 from age 6, and JSS1 from age 11. We assess each child individually, so exact cut-off dates may vary slightly, your admissions officer can confirm eligibility for your child's specific birth month.",
      },
      {
        q: 'Is there an entrance assessment for every level?',
        a: 'Kindergarten and early Nursery admissions are play-based observations rather than formal tests. From Primary 1 upward, candidates take an age-appropriate literacy and numeracy assessment designed to understand readiness, not to gatekeep entry.',
      },
      {
        q: 'Can my child join mid-session?',
        a: 'Yes, subject to space availability in the relevant class. Mid-session joiners go through the same assessment and documentation process, and our team works with you to help your child settle in smoothly.',
      },
      {
        q: 'Do you offer transfer admissions from other schools?',
        a: "Yes. We request the candidate's most recent report card and a brief reference from their previous school, alongside our standard entrance assessment, to ensure proper class placement.",
      },
    ],
  },
  {
    id: 'fees',
    label: 'Fees & Payment',
    questions: [
      {
        q: 'What does the school fee cover?',
        a: 'Tuition, instructional materials, continuous assessment, and access to school facilities. Uniforms, textbooks, excursions, and the school bus service are billed separately and itemised on your invoice.',
      },
      {
        q: 'Do you offer a payment plan?',
        a: 'Yes, fees can be paid in full at the start of term or split into two instalments. Speak with our bursary office to set up an instalment plan that works for your family.',
      },
      {
        q: 'Is the acceptance fee refundable?',
        a: "The acceptance fee secures your child's place and is non-refundable once paid, as it reserves a seat that would otherwise be offered to another candidate.",
      },
      {
        q: 'Are there sibling discounts available?',
        a: 'Yes. Families enrolling more than one child receive a discount on tuition for the second and subsequent children. Ask our admissions team for current rates.',
      },
    ],
  },
  {
    id: 'academics',
    label: 'Academics',
    questions: [
      {
        q: 'What curriculum does Crestview follow?',
        a: 'We follow the Nigerian national curriculum, enriched with additional STEM, coding, and creative arts components. Secondary students are prepared specifically for WAEC and NECO examinations.',
      },
      {
        q: 'What is your average class size?',
        a: 'We cap class sizes at 25 students to ensure every child receives individual attention from their teachers, smaller still in Kindergarten and Nursery.',
      },
      {
        q: 'Do you provide extra support for struggling students?',
        a: 'Yes. Our teachers identify learning gaps early through continuous assessment, and students who need additional support receive small-group remediation sessions at no extra cost.',
      },
      {
        q: 'What languages are taught?',
        a: 'English is our medium of instruction. French and an indigenous Nigerian language are taught from Primary 1, with options to continue either through Secondary school.',
      },
    ],
  },
  {
    id: 'general',
    label: 'General',
    questions: [
      {
        q: 'What are the school hours?',
        a: 'Classes run from 7:45am to 3:00pm, Monday to Friday. After-school clubs and the homework club run until 4:30pm for families who need extended care.',
      },
      {
        q: 'Do you provide school transport?',
        a: 'Yes, our school bus service covers major routes across Lekki and its environs. Routes and pickup points are shared with parents at the start of each session.',
      },
      {
        q: 'What is your policy on visiting the school before applying?',
        a: 'We encourage every family to visit before applying. Book a campus tour through our admissions page and see classrooms in session, meet staff, and get a true feel for life at Crestview.',
      },
      {
        q: 'How do you communicate with parents during the term?',
        a: 'Through our parent portal, termly reports, and a dedicated WhatsApp broadcast for urgent updates. Class teachers are also available for scheduled one-on-one meetings each term.',
      },
    ],
  },
];

export default function FaqsSection() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    `${categories[0].id}-0`,
  );

  const currentCategory = categories.find((c) => c.id === activeCategory)!;

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setOpenQuestion(`${id}-0`);
  };

  return (
    <section className="section-pad bg-background">
      <div className="max-w-7xl mx-auto mb-12 lg:mb-16">
        <SectionHeading
          eyebrow="Got Questions?"
          heading="Frequently Asked Questions"
          align="center"
        />
        <p className="font-body text-foreground-100 text-base text-center leading-relaxed opacity-75">
          Browse answers by topic below, or reach out to our admissions team
          directly if you cannot find what you are looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
        {/* ── Category tabs ── */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`relative shrink-0 lg:shrink text-left px-4 py-3 font-body text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive
                    ? 'text-primary bg-terracotta-pale'
                    : 'text-foreground-100 opacity-70 hover:opacity-100 hover:bg-background-100'
                }`}
              >
                {/* Active left bar on desktop */}
                {isActive && (
                  <span className="hidden lg:block absolute left-0 top-0 bottom-0 w-0.75 bg-primary" />
                )}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── Questions accordion ── */}
        <div className="flex flex-col">
          {currentCategory.questions.map((item, i) => {
            const key = `${activeCategory}-${i}`;
            const isOpen = openQuestion === key;
            return (
              <div key={key} className="border-b border-border">
                <button
                  onClick={() => setOpenQuestion(isOpen ? null : key)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                >
                  <span
                    className={`font-heading text-lg md:text-xl font-semibold leading-snug transition-colors duration-200 ${
                      isOpen
                        ? 'text-primary'
                        : 'text-foreground group-hover:text-primary'
                    }`}
                  >
                    {item.q}
                  </span>
                  <Plus
                    className={`size-5 shrink-0 text-primary transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  />
                </button>

                {/* Answer panel */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex gap-4 pb-6 pr-10">
                      {/* Growing left border */}
                      <div className="w-0.5 bg-primary shrink-0" />
                      <p className="font-body text-foreground-100 text-sm md:text-base leading-relaxed opacity-80">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
