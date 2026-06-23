'use client';

import Image from 'next/image';
import { useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ArrowLeft, ArrowRight, X, ZoomIn } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

import 'swiper/css';
import { Perforations } from '../home/_components/Perforations';
import { allImages } from './_lib/assets';

const categories = [
  'ALL',
  'ACADEMICS',
  'SPORTS',
  'ARTS',
  'EVENTS',
  'CULTURE',
] as const;
type Category = (typeof categories)[number];

export default function GalleryPageSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [featuredActive, setFeaturedActive] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === 'ALL'
      ? allImages
      : allImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + filtered.length) % filtered.length,
    );
  }, [filtered.length]);
  const nextLightbox = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  return (
    <>
      {/* ── Featured filmstrip ── */}
      <section className="bg-(--charcoal) overflow-hidden pt-10">
        <div className="section-pad pt-0">
          <div className="flex items-center justify-between mb-6">
            <SectionHeading
              eyebrow="Featured Moments"
              heading="Highlights"
              light
            />
            <div className="flex items-center gap-4 pb-8">
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-white text-2xl font-bold leading-none">
                  {String(featuredActive + 1).padStart(2, '0')}
                </span>
                <span className="text-white/30 text-xs font-body">
                  / {String(allImages.slice(0, 9).length).padStart(2, '0')}
                </span>
              </div>
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
        </div>

        <div className="bg-(--charcoal-100) py-1.5 overflow-hidden">
          <Perforations />
        </div>

        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setFeaturedActive(swiper.realIndex)}
          slidesPerView={1}
          centeredSlides
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          speed={600}
          breakpoints={{
            768: { slidesPerView: 1.4 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full"
        >
          {allImages.slice(0, 9).map((item, i) => (
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

        <div className="bg-(--charcoal-100) py-1.5 overflow-hidden">
          <Perforations />
        </div>

        {/* Thumbnail row */}
        <div className="section-pad pt-4 pb-10">
          <div className="flex justify-center gap-2 overflow-x-auto pb-1">
            {allImages.slice(0, 9).map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  swiperRef.current?.slideToLoop(i);
                  setFeaturedActive(i);
                }}
                className="relative shrink-0 w-20 h-14 overflow-hidden focus:outline-none"
                style={{
                  opacity: i === featuredActive ? 1 : 0.45,
                  filter: i === featuredActive ? 'none' : 'grayscale(60%)',
                }}
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className="object-cover transition-all duration-500"
                  sizes="80px"
                />
                {i === featuredActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full filterable grid ── */}
      <section className="section-pad bg-background">
        <div className="mb-10">
          <SectionHeading
            eyebrow="Full Collection"
            heading="Browse All Photographs"
          />

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-body text-xs font-semibold tracking-[0.15em] px-4 py-2 transition-colors duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'border border-border text-foreground-100 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
          {filtered.map((img, i) => (
            <div
              key={`${activeCategory}-${i}`}
              className="group relative break-inside-avoid overflow-hidden cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <Image
                src={img.src}
                alt={img.caption}
                width={600}
                height={400}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                <ZoomIn className="size-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Caption bar */}
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/80 px-3 py-2 flex items-center justify-between">
                <span className="text-white font-body text-xs truncate">
                  {img.caption}
                </span>
                <span className="text-[9px] font-body font-bold tracking-[0.2em] px-1.5 py-0.5 bg-primary text-white shrink-0 ml-2">
                  {img.category}
                </span>
              </div>

              {/* Terracotta bottom bar */}
              <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-primary transition-all duration-500" />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="font-body text-foreground-100 text-sm opacity-50 text-center py-20">
            No images found in this category.
          </p>
        )}
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X className="size-7" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            className="absolute left-5 text-white/40 hover:text-white text-5xl font-thin leading-none transition-all duration-200 hover:-translate-x-1 select-none z-10"
            aria-label="Previous"
          >
            ←
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[80vh] w-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].caption}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain"
              sizes="100vw"
            />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-5 py-3 flex items-center justify-between">
              <span className="text-white font-body text-sm">
                {filtered[lightboxIndex].caption}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[9px] font-body font-bold tracking-[0.2em] px-2 py-1 bg-primary text-white">
                  {filtered[lightboxIndex].category}
                </span>
                <span className="text-white/40 font-body text-xs">
                  {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                  {String(filtered.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            className="absolute right-5 text-white/40 hover:text-white text-5xl font-thin leading-none transition-all duration-200 hover:translate-x-1 select-none z-10"
            aria-label="Next"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
