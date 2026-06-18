'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/effect-fade';

const images = [
  '/assets/img-optimized/crestview-hero-02.webp',
  '/assets/img-optimized/crestview-hero-03.webp',
  '/assets/img-optimized/crestview-hero-04.webp',
  '/assets/img-optimized/crestview-hero-05.webp',
  '/assets/img-optimized/crestview-hero-06.webp',
  '/assets/img-optimized/crestview-hero-01.webp',
];

export function HeroCarousel() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop
      speed={800}
      allowTouchMove={false}
      className="w-full h-full"
    >
      {images.map((src, index) => (
        <SwiperSlide key={src} className="relative z-10">
          <Image
            src={src}
            alt="Crest View Academy Hero Image"
            fill
            className="object-cover"
            priority={index === 0} // only eagerly load the first image
            loading={index === 0 || index === 1 ? 'eager' : 'lazy'}
            sizes="100vw"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
