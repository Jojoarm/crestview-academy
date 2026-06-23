'use client';

import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './NavLinks';

const footerNav = [
  {
    group: 'About Us',
    links: [
      { name: 'Overview', path: '/about/overview' },
      { name: 'Welcome Address', path: '/about/welcome-address' },
      { name: 'History', path: '/about/history' },
      { name: 'Vision & Values', path: '/about/vision' },
    ],
  },
  {
    group: 'Admissions',
    links: [
      { name: 'Why Choose Crestview', path: '/admissions/why-crestview' },
      { name: 'Admission Process', path: '/admissions/process' },
      { name: 'FAQs', path: '/admissions/faqs' },
      { name: 'Apply Online', path: '/admissions/apply' },
      { name: 'Arrange A Visit', path: '/admissions/arrange-a-visit' },
    ],
  },
  {
    group: 'Academics',
    links: [
      { name: 'Our Curriculum', path: '/academics/curriculum' },
      { name: 'Quality Assurance', path: '/academics/quality-assurance' },
      { name: 'School Calendar', path: '/academics/school-calendar' },
      { name: 'Kindergarten', path: '/student-life/kindergarten' },
      { name: 'Nursery', path: '/student-life/nursery' },
      { name: 'Primary', path: '/student-life/primary' },
      { name: 'Secondary', path: '/student-life/secondary' },
    ],
  },
  {
    group: 'Contact',
    links: [
      { name: 'Contact Us', path: '/contact/contact-us' },
      { name: 'IT Support', path: '/contact/it-support' },
      { name: 'Gallery', path: '/gallery' },
    ],
  },
];

const socials = [
  {
    name: 'Facebook',
    icon: '/assets/icons/facebook-logo.svg',
    href: '#',
  },
  {
    name: 'Instagram',
    icon: '/assets/icons/instagram-logo.svg',
    href: '#',
  },
  {
    name: 'Twitter',
    icon: '/assets/icons/twitter-logo.svg',
    href: '#',
  },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-(--charcoal)">
      {/* ── Main grid ── */}
      <div className="px-6 md:px-10 lg:px-16 pt-16 pb-12 grid grid-cols-1 lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-12 border-b border-white/8">
        {/* Col 1 — brand */}
        <div className="flex flex-col gap-6 lg:pr-8">
          <Link
            href="/"
            onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-36 bg-(--warm-white) rounded-xl p-2 self-start"
          >
            <Image
              src="/assets/logo/crestview-logo.png"
              alt="Crestview Academy"
              width={993}
              height={291}
              className="object-contain w-full"
              priority
            />
          </Link>

          <p className="font-body text-sm text-white/55 leading-relaxed max-w-[26ch]">
            Shaping futures since 1994, a premier Nursery, Primary, and
            Secondary school in Lekki, Lagos.
          </p>

          {/* Contact block */}
          <div className="flex flex-col gap-2 mt-2">
            <p className="font-body text-xs text-white/30 uppercase tracking-[0.16em] font-semibold mb-1">
              Get In Touch
            </p>
            <a
              href="tel:+2348012345678"
              className="font-body text-sm text-white/55 hover:text-white transition-colors duration-150"
            >
              +234 801 234 5678
            </a>
            <a
              href="mailto:info@crestviewacademy.edu.ng"
              className="font-body text-sm text-white/55 hover:text-white transition-colors duration-150"
            >
              info@crestviewacademy.edu.ng
            </a>
            <p className="font-body text-sm text-white/55 leading-relaxed mt-1">
              14, Admiralty Way,
              <br />
              Lekki Phase 1, Lagos State
            </p>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-3 mt-2">
            <p className="font-body text-xs text-white/30 uppercase tracking-[0.16em] font-semibold">
              Connect With Us
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <NavLinks
                  key={s.name}
                  icon={s.icon}
                  alt={`${s.name} icon`}
                  link={s.href}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cols 2–5 — nav groups */}
        {footerNav.map((group) => (
          <div key={group.group} className="flex flex-col gap-3">
            <span className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30 mb-1">
              {group.group}
            </span>
            {group.links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="font-body w-fit text-sm text-white/55 hover:text-white transition-colors duration-150"
              >
                {link.name}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="px-6 md:px-10 lg:px-16 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {[
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Use', href: '/terms' },
          ].map((item, i, arr) => (
            <span key={item.name} className="flex items-center">
              <Link
                href={item.href}
                className="font-body text-xs text-white/30 px-2 first:pl-0 hover:text-white/60 transition-colors duration-150"
              >
                {item.name}
              </Link>
              {i < arr.length - 1 && (
                <span className="text-xs text-white/12 select-none">|</span>
              )}
            </span>
          ))}
        </div>
        <p className="font-body text-xs text-white/25 shrink-0">
          © {new Date().getFullYear()} Crestview Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
