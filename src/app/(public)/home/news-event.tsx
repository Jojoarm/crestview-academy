'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

import 'swiper/css';

// ── Dummy data — replace with DB fetch later ──────────────────────────────────
const items = [
  {
    id: 1,
    type: 'NEWS',
    day: '14',
    month: 'JAN',
    year: '2026',
    title: "Principal's Welcome Address — New Academic Session 2025/2026",
    excerpt:
      'As we begin a new chapter, our Principal Mrs. Adaeze Okonkwo shares her vision for the year ahead and what every family can look forward to.',
    image: '/assets/img-optimized/crestview-hero-05.webp',
    href: '/news/principals-address-2026',
  },
  {
    id: 2,
    type: 'EVENT',
    day: '22',
    month: 'FEB',
    year: '2026',
    title: 'Open Day 2026 — Visit Crestview Academy',
    excerpt:
      'Parents and prospective families are warmly invited to tour our campus, meet our staff, and discover what makes Crestview the school of choice in Lagos.',
    image: '/assets/img-optimized/crestview-hero-06.webp',
    href: '/events/open-day-2026',
  },
  {
    id: 3,
    type: 'NEWS',
    day: '05',
    month: 'MAR',
    year: '2026',
    title: 'Crestview Students Shine at 2026 Lagos State Science Olympiad',
    excerpt:
      'Three of our Secondary students brought home gold medals at the annual Lagos State Science Olympiad, placing Crestview in the top five schools statewide.',
    image: '/assets/img-optimized/crestview-hero-03.webp',
    href: '/news/science-olympiad-2026',
  },
  {
    id: 4,
    type: 'EVENT',
    day: '28',
    month: 'MAR',
    year: '2026',
    title: 'Inter-House Sports Day — Celebrating Teamwork and Talent',
    excerpt:
      'Our annual Inter-House Sports Day brings together students, staff, and families for a day of friendly competition, music, and community spirit.',
    image: '/assets/img-optimized/crestview-hero-02.webp',
    href: '/events/sports-day-2026',
  },
  {
    id: 5,
    type: 'NEWS',
    day: '10',
    month: 'APR',
    year: '2026',
    title: 'WAEC 2025 Results — Crestview Records 98% Five-Credit Pass Rate',
    excerpt:
      'We are proud to announce that Crestview Academy SS3 graduates achieved a 98% five-credit pass rate including English and Mathematics in the 2025 WAEC examinations.',
    image: '/assets/img-optimized/crestview-hero-01.webp',
    href: '/news/waec-results-2025',
  },
  {
    id: 6,
    type: 'EVENT',
    day: '16',
    month: 'MAY',
    year: '2026',
    title: "Founders' Day Celebration — 32 Years of Excellence",
    excerpt:
      "Join us as we celebrate 32 years of shaping futures at Crestview Academy's annual Founders' Day ceremony and cultural showcase.",
    image: '/assets/img-optimized/crestview-hero-03.webp',
    href: '/events/founders-day-2026',
  },
];

export default function NewsEvents() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <section className="pt-16 pb-6 md:pt-20 md:pb-10 lg:pt-28 lg:pb-18 bg-background-100">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 xl:gap-20 items-start">
        {/* ── Left: static heading column ── */}
        <div className="flex flex-col lg:sticky lg:top-28 px-6 md:px-10 lg:px-16">
          <SectionHeading
            eyebrow="News & Events"
            heading={`What's Happening\nat Crestview`}
          />

          <p className="font-body text-foreground-100 text-base leading-relaxed opacity-75 mb-10">
            From prize-giving ceremonies to open days and sporting fixtures,
            there is always something happening at Crestview Academy. Stay
            connected with our school community.
          </p>

          <Link
            href="/news"
            className="self-start inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white font-body font-medium text-sm px-6 py-3 transition-colors duration-200 tracking-wide"
          >
            All News & Events
            <ArrowRight className="size-4" />
          </Link>

          {/* Prev / Next arrows — desktop */}
          <div className="hidden lg:flex items-center gap-3 mt-12">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              aria-label="Previous"
              className="flex items-center justify-center w-11 h-11 border border-border text-foreground hover:border-primary hover:text-primary transition-colors duration-200"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              aria-label="Next"
              className="flex items-center justify-center w-11 h-11 border border-border text-foreground hover:border-primary hover:text-primary transition-colors duration-200"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* ── Right: Swiper carousel ── */}
        <div className="min-w-0 pl-6 md:pl-10 lg:pl-0 overflow-hidden">
          <Swiper
            modules={[Navigation]}
            onSwiper={setSwiperInstance}
            slidesPerView={1.5}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 2.5, spaceBetween: 24 },
            }}
            className="w-full"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <article className="group flex flex-col bg-background border border-border hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full">
                  {/* Image with category pill */}
                  <div className="relative w-full h-52 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 90vw, 45vw"
                    />
                    <span
                      className={`absolute top-4 left-4 z-10 text-[10px] font-body font-semibold tracking-[0.18em] uppercase px-3 py-1 ${
                        item.type === 'EVENT'
                          ? 'bg-primary text-white'
                          : 'bg-white/90 text-foreground'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Date block */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex flex-col items-center border-l-2 border-primary pl-3 shrink-0">
                        <span className="font-body text-primary text-[10px] font-semibold tracking-widest uppercase">
                          {item.month}
                        </span>
                        <span className="font-heading text-foreground text-3xl font-bold leading-none">
                          {item.day}
                        </span>
                        <span className="font-body text-foreground-100 text-[10px] opacity-50">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="font-body font-semibold text-foreground text-sm leading-snug pt-0.5 line-clamp-3">
                        {item.title}
                      </h3>
                    </div>

                    {/* Excerpt */}
                    <p className="font-body text-foreground-100 text-sm leading-relaxed opacity-70 mb-5 line-clamp-3">
                      {item.excerpt}
                    </p>

                    {/* Read More */}
                    <Link
                      href={item.href}
                      className="mt-auto self-start inline-flex items-center gap-1.5 text-primary font-body font-semibold text-xs tracking-wide uppercase hover:gap-3 transition-all duration-200 group/link"
                    >
                      Read More
                      <ArrowRight className="size-3.5 group-hover/link:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Mobile arrows */}
          <div className="flex items-center gap-3 mt-6 lg:hidden">
            <button
              onClick={() => swiperInstance?.slidePrev()}
              aria-label="Previous"
              className="flex items-center justify-center w-11 h-11 border border-border text-foreground hover:border-primary hover:text-primary transition-colors duration-200"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => swiperInstance?.slideNext()}
              aria-label="Next"
              className="flex items-center justify-center w-11 h-11 border border-border text-foreground hover:border-primary hover:text-primary transition-colors duration-200"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
