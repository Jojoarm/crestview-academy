'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface featureProps {
  title: string;
  description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: 'Academic Excellence',
    description:
      'A rigorous curriculum designed to inspire curiosity, critical thinking, and outstanding academic achievement.',
    icon: '🎓',
  },
  {
    title: 'Holistic Development',
    description:
      'We nurture every child through academics, leadership, sports, arts, and character-building experiences.',
    icon: '🌟',
  },
  {
    title: 'Safe Learning Environment',
    description:
      'A caring and secure environment where every learner feels valued, supported, and encouraged to thrive.',
    icon: '🛡️',
  },
  {
    title: 'Future-Ready Education',
    description:
      'Equipping students with the knowledge, confidence, and skills needed to succeed in a changing world.',
    icon: '🚀',
  },
];

export function FeaturesCarousel() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-10">
      {/* Mobile — swipeable */}
      <div className="lg:hidden">
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
          {features.map((feature, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center text-center gap-3 px-4">
                {/* <span className="text-3xl mb-1">{feature.icon}</span> */}
                <h3 className="text-white text-xs font-body font-semibold tracking-[0.2em] uppercase">
                  {feature.title}
                </h3>
                <p className="text-white/65 text-sm font-body leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop — original grid */}
      <div className="hidden lg:grid grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center gap-3 lg:border-r lg:border-white/20 last:border-0 px-4"
          >
            {/* <span className="text-3xl mb-1">{feature.icon}</span> */}
            <h3 className="text-white text-xs font-body font-semibold tracking-[0.2em] uppercase">
              {feature.title}
            </h3>
            <p className="text-white/65 text-sm font-body leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
