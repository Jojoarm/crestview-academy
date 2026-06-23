'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

import 'swiper/css';
import { Perforations } from './_components/Perforations';

const gallery = [
  {
    src: '/assets/img-optimized/Students-in-physics-lab.webp',
    caption: 'Science Lab Excellence',
    category: 'ACADEMICS',
    year: '2025',
  },
  {
    src: '/assets/img-optimized/interhouse-sport-competition-01.webp',
    caption: 'Inter-House Sports Day',
    category: 'SPORTS',
    year: '2025',
  },
  {
    src: '/assets/img-optimized/crestview-hero-04.webp',
    caption: 'Student Art Exhibition',
    category: 'ARTS',
    year: '2024',
  },
  {
    src: '/assets/img-optimized/graduation-day.webp',
    caption: 'Graduation Day 2025',
    category: 'EVENTS',
    year: '2025',
  },
  {
    src: '/assets/img-optimized/cultural-day.webp',
    caption: 'Cultural Heritage Day',
    category: 'CULTURE',
    year: '2024',
  },
  {
    src: '/assets/img-optimized/students-in-computer-lab.webp',
    caption: 'Coding bootcamp',
    category: 'TECH',
    year: '2025',
  },
  {
    src: '/assets/img-optimized/student-learning-04.webp',
    caption: 'National Debate Finals',
    category: 'ACADEMICS',
    year: '2024',
  },
  {
    src: '/assets/img-optimized/graduation-day.webp',
    caption: 'Annual Prize Giving Ceremony',
    category: 'EVENTS',
    year: '2025',
  },
  {
    src: '/assets/img-optimized/crestview-hero-03.webp',
    caption: "Founders' Day Parade",
    category: 'EVENTS',
    year: '2025',
  },
];

export default function GallerySection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [active, setActive] = useState(0);

  return (
    <section className="section-pad bg-(--charcoal) overflow-hidden">
      {/* ── Section heading + counter + arrows ── */}
      <div className="mb-12">
        <SectionHeading
          eyebrow="School Gallery"
          heading="Life at Crestview"
          light
          align="center"
        />

        <p className="font-body text-background-100 text-base leading-relaxed opacity-75 max-w-6xl mx-auto text-center">
          Every photograph tells a story of curious minds, proud achievements,
          and the vibrant community that makes Crestview Academy a place
          students are proud to call home.
        </p>
      </div>

      {/* ── Perforations above ── */}
      <div className="bg-(--charcoal-100) py-1.5 overflow-hidden mb-0 w-full">
        <Perforations />
      </div>

      {/* ── Swiper ── */}
      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        slidesPerView={1}
        centeredSlides
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        speed={600}
        breakpoints={{
          768: { slidesPerView: 1.4 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full m-2"
      >
        {gallery.map((item, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <div
                className="relative overflow-hidden transition-all duration-500"
                style={{
                  height: '380px',
                  opacity: isActive ? 1 : 0.45,
                  transform: isActive ? 'scale(1)' : 'scale(0.92)',
                  filter: isActive ? 'none' : 'grayscale(60%)',
                  transition: 'opacity 0.5s, transform 0.5s, filter 0.5s',
                }}
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 33vw"
                />
                {/* Caption overlay on active only */}
                {isActive && (
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex items-end px-4 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-body font-bold tracking-[0.25em] px-2 py-1 bg-primary text-white">
                        {item.category}
                      </span>
                      <span className="text-white font-body text-sm font-medium truncate">
                        {item.caption}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Perforations below ── */}
      <div className="bg-(--charcoal-100) py-1.5 overflow-hidden mt-0">
        <Perforations />
      </div>

      <div className="flex items-center justify-between gap-4 py-8">
        <div className="flex items-baseline gap-1 mr-2">
          <span className="font-heading text-white text-2xl font-bold leading-none">
            {String(active + 1).padStart(2, '0')}
          </span>
          <span className="text-white/30 text-xs font-body">
            / {String(gallery.length).padStart(2, '0')}
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous"
            className="flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:border-primary hover:text-primary transition-colors duration-200"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next"
            className="flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:border-primary hover:text-primary transition-colors duration-200"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
        <p className="font-body text-white/35 text-xs tracking-wide">
          Capturing moments that define the Crestview experience.
        </p>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-terracotta-light font-body text-xs font-semibold tracking-[0.15em] uppercase hover:gap-4 transition-all duration-200 group"
        >
          Full Gallery
          <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </section>
  );
}
