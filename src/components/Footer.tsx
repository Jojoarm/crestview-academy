'use client';

import Link from 'next/link';
import Image from 'next/image';
import NavLinks from './NavLinks';

const socials = [
  {
    name: 'Facebook',
    icon: '/assets/icons/facebook-logo.svg',
    href: 'https://www.facebook.com/share/1Ct7c2nfnn/?mibextid=wwXIfr',
  },
  {
    name: 'Instagram',
    icon: '/assets/icons/instagram-logo.svg',
    href: 'https://www.instagram.com/unco.global.merchants?igsh=cXRtb2JlY2ZoNWxn&utm_source=qr',
  },
  { name: 'Twitter', icon: '/assets/icons/twitter-logo.svg', href: '#' },
];

const quickLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Use', href: '/terms' },
];

const footerLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Contact Us', path: '/contact' },
];

export default function Footer() {
  return (
    <footer id="footer" style={{ background: 'var(--foreground)' }}>
      {/* Info grid */}
      <div
        className="px-7 md:px-10 lg:px-14 xl:px-18 py-14 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Col 1 — logo + tagline */}
        <div className="flex flex-col gap-5">
          <Link
            onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
            href="/"
            className="w-40 lg:w-50 bg-background rounded-xl p-2"
          >
            <Image
              className="object-cover w-full"
              src="/assets/logo/crestview-logo.png"
              alt="Crest View logo"
              width={993}
              height={291}
              priority
            />
          </Link>
          <p
            className="text-sm text-card leading-relaxed"
            style={{ maxWidth: '26ch' }}
          >
            Professional training and development built for managers,
            consultants, and the organisations that need them sharp.
          </p>
        </div>

        {/* Col 2 — Quick links */}
        <div className="flex flex-col gap-3">
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Useful Links
          </span>
          {footerLinks.map((link, index) => (
            <Link
              key={index}
              href={link.path}
              className="w-fit text-sm leading-relaxed text-card hover:text-white hover:border-b hover:border-white transition-all duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Col 3 — address */}
        <div className="flex flex-col gap-3">
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Address
          </span>
          <p className="text-sm text-card leading-relaxed">
            14, Admiralty Way, Lekki Phase 1,
            <br />
            Lagos, Nigeria
          </p>
        </div>

        {/* Col 4 — phone + socials */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span
              className="text-[10px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Phone
            </span>
            <p className="text-sm text-card transition-colors duration-200 hover:text-white">
              +234 801 234 5678
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span
              className="text-[10px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Connect with us
            </span>
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
      </div>

      {/* Bottom bar */}
      <div className="px-7 md:px-10 lg:px-14 xl:px-18 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-y-2">
          {quickLinks.map((item, i) => (
            <span key={item.name} className="flex items-center">
              <Link
                href={item.href}
                className="text-xs text-card px-2 first:pl-0 transition-colors duration-200 hover:text-white"
              >
                {item.name}
              </Link>
              {i < quickLinks.length - 1 && (
                <span
                  className="text-xs select-none pr-2"
                  style={{ color: 'rgba(255,255,255,0.12)' }}
                >
                  |
                </span>
              )}
            </span>
          ))}
        </div>
        <p
          className="text-xs shrink-0"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          © {new Date().getFullYear()} CrestView Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
