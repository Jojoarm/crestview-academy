'use client';

import { useState } from 'react';
import SectionHeading from '@/components/SectionHeading';
import { CATEGORIES, Category, CATEGORY_STYLES, years } from './_lib/assets';

export default function SchoolCalendarSection() {
  const [yearIndex, setYearIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const year = years[yearIndex];

  const allEvents = year.terms.flatMap((t) => t.events);
  const filtered =
    activeCategory === 'all'
      ? allEvents
      : allEvents.filter((e) => e.category === activeCategory);

  return (
    <>
      {/* ── Intro ── */}
      <section className="section-pad bg-(--warm-white)">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 xl:gap-24 items-start">
            <SectionHeading
              eyebrow="Academic Calendar"
              heading={'Term Dates & Key Events'}
            />
            <div className="lg:pt-10 space-y-4">
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                Crestview Academy follows the Nigerian standard three term
                calendar. Each term includes a mid-term break, and the academic
                year runs from September through July.
              </p>
              <p className="font-body text-(--charcoal-100) text-base leading-relaxed opacity-80">
                Dates below are confirmed for the current year and indicative
                for the following year. Parents will receive official
                confirmation of the next academic year&apos;s dates before the
                Third Term closes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Term summary strip ── */}
      <section className="bg-background-100 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-10 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {year.terms.map((term) => (
              <div key={term.number} className="px-6 py-8 flex flex-col gap-1">
                <span className="font-body text-[10px] uppercase tracking-[0.14em] text-(--charcoal-100) opacity-50 mb-1">
                  {term.name}
                </span>
                <span className="font-heading text-base text-(--charcoal)">
                  {term.start} – {term.end}
                </span>
                <span className="font-body text-sm text-(--charcoal-100) opacity-60">
                  Mid-term: {term.midTermBreak}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive calendar ── */}
      <section className="section-pad bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Controls row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            {/* Year switcher */}
            <div className="flex items-center gap-px border border-(--border-sand) w-fit">
              {years.map((y, i) => (
                <button
                  key={y.label}
                  onClick={() => setYearIndex(i)}
                  className={`font-body text-sm px-5 py-2.5 transition-colors ${
                    yearIndex === i
                      ? 'bg-foreground text-white'
                      : 'bg-background text-foreground-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  {y.label}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`font-body text-xs px-4 py-2 border transition-colors ${
                    activeCategory === cat.key
                      ? 'border-terracotta bg-terracotta text-white'
                      : 'border-(--border-sand) text-(--charcoal-100) opacity-70 hover:opacity-100 bg-(--warm-white)'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events list — grouped by term */}
          <div className="flex flex-col gap-10">
            {year.terms.map((term) => {
              const termEvents = filtered.filter((e) => e.term === term.number);
              if (termEvents.length === 0) return null;
              return (
                <div key={term.number}>
                  {/* Term label */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-body text-[10px] uppercase tracking-[0.16em] text-(--charcoal-100) opacity-50">
                      {term.name} · {year.label}
                    </span>
                    <div className="flex-1 h-px bg-(--border-sand)" />
                  </div>

                  {/* Events */}
                  <div className="flex flex-col">
                    {termEvents.map((event, i) => (
                      <div
                        key={`${event.date}-${event.label}`}
                        className={`grid grid-cols-[7rem_auto_1fr] sm:grid-cols-[9rem_auto_1fr] items-baseline gap-4 sm:gap-6 py-4 ${
                          i !== termEvents.length - 1
                            ? 'border-b border-(--border-sand)'
                            : ''
                        }`}
                      >
                        {/* Date */}
                        <span className="font-heading text-sm text-terracotta">
                          {event.endDate
                            ? `${event.date} – ${event.endDate}`
                            : event.date}
                        </span>

                        {/* Category dot */}
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${CATEGORY_STYLES[event.category].dot}`}
                        />

                        {/* Label */}
                        <span className="font-body text-sm text-(--charcoal) leading-snug">
                          {event.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-5 mt-10 pt-8 border-t border-(--border-sand)">
            {CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
              <div key={cat.key} className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${CATEGORY_STYLES[cat.key as Category].dot}`}
                />
                <span className="font-body text-xs text-(--charcoal-100) opacity-60">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notice ── */}
      <section className="bg-(--warm-white-dark) border-t border-(--border-sand)">
        <div className="max-w-4xl mx-auto px-6 md:px-10 xl:px-16 py-10">
          <p className="font-body text-sm text-(--charcoal-100) opacity-60 text-center leading-relaxed">
            All dates are subject to change in line with official government
            directives or unforeseen circumstances. Parents will be notified of
            any changes via the school portal and SMS at least two weeks in
            advance where possible.
          </p>
        </div>
      </section>
    </>
  );
}
