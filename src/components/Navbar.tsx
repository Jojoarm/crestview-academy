'use client';

import Link from 'next/link';
import { ChevronRight, ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavLinks from './NavLinks';
import NavInfo from './NavInfo';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getDashboardPathForRole } from '@/lib/roles';
import { useCurrentUser } from '@/hooks/use-current-user';

const navLinks = [
  { name: 'Home', path: '/' },
  {
    name: 'About Us',
    content: [
      { name: 'Overview', path: '/about/overview' },
      { name: 'Welcome Address', path: '/about/welcome-address' },
      { name: 'History', path: '/about/history' },
      { name: 'Vision, Mission & Core Values', path: '/about/vision' },
    ],
  },
  {
    name: 'Admissions',
    content: [
      { name: 'Why Choose Crestview', path: '/admissions/why-crestview' },
      { name: 'Admission Process', path: '/admissions/process' },
      { name: 'Frequently Asked Questions', path: '/admissions/faqs' },
      { name: 'Apply Online', path: '/admissions/apply' },
      { name: 'Arrange A Visit', path: '/admissions/arrange-a-visit' },
    ],
  },
  {
    name: 'Student Life',
    content: [
      { name: 'Overview', path: '/student-life/overview' },
      { name: 'Kindergarten', path: '/student-life/kindergarten' },
      { name: 'Nursery', path: '/student-life/nursery' },
      { name: 'Primary', path: '/student-life/primary' },
      { name: 'Secondary', path: '/student-life/secondary' },
    ],
  },
  {
    name: 'Academics',
    content: [
      { name: 'Our Curriculum', path: '/academics/curriculum' },
      { name: 'Quality Assurance', path: '/academics/quality-assurance' },
      { name: 'School Calendar', path: '/academics/school-calendar' },
    ],
  },
  { name: 'Gallery', path: '/gallery' },
  {
    name: 'Contact',
    content: [
      { name: 'Contact Us', path: '/contact/contact-us' },
      { name: 'IT Support', path: '/contact/it-support' },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: user } = useCurrentUser();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element)
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex flex-col">
      <div className="hidden lg:flex w-full bg-primary text-white text-xs px-6 md:px-10 lg:px-16 py-2 items-center justify-between">
        <div className="flex items-center gap-5">
          <NavInfo
            info="14, Admiralty Way, Lekki Phase 1, Lagos"
            Icon={MapPin}
          />
          <span className="w-px h-3 bg-white/30" />
          <NavInfo info="admissions@crestviewacademy.edu.ng" Icon={Mail} />
          <span className="w-px h-3 bg-white/30" />
          <NavInfo info="+234 801 234 5678" Icon={Phone} />
        </div>
        <div className="flex items-center gap-4">
          <span className="opacity-70 italic tracking-wide font-accent text-[11px]">
            Raising Excellence, Shaping Futures
          </span>
          <span className="w-px h-3 bg-white/30" />
          <div className="flex items-center gap-3">
            <NavLinks
              icon="/assets/icons/facebook-logo.svg"
              alt="facebook icon"
              link="https://www.facebook.com/crestviewacademy"
            />
            <NavLinks
              icon="/assets/icons/instagram-logo.svg"
              alt="instagram icon"
              link="https://www.instagram.com/crestviewacademy"
            />
            <NavLinks
              icon="/assets/icons/twitter-logo.svg"
              alt="twitter icon"
              link="https://x.com/crestviewacademy"
            />
          </div>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <div
        className={cn(
          'mx-2 md:mx-4 lg:mx-6 border border-primary/10 flex items-center justify-between transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow py-3'
            : 'bg-white py-4',
        )}
      >
        <div className="w-full flex items-center justify-between px-4 md:px-6 lg:px-10">
          {/* Logo — using Logo component */}
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = link.path
                ? pathname === link.path
                : link.content?.some((c) => pathname.startsWith(c.path));

              if (link.content) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        'flex items-center gap-1 py-2 text-sm font-medium font-body tracking-wide transition-colors duration-200',
                        isActive
                          ? 'text-primary'
                          : 'text-foreground hover:text-primary',
                      )}
                    >
                      {link.name}
                      <ChevronDown
                        className={cn(
                          'size-4 transition-transform duration-200',
                          openDropdown === link.name ? 'rotate-180' : '',
                        )}
                      />
                    </button>

                    {/* Active underline indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                    )}

                    {/* Dropdown */}
                    <div
                      className={cn(
                        'absolute top-full left-0 min-w-60 bg-white border border-border shadow-lg rounded-b-md overflow-hidden transition-all duration-200 origin-top',
                        openDropdown === link.name
                          ? 'opacity-100 scale-y-100 pointer-events-auto'
                          : 'opacity-0 scale-y-95 pointer-events-none',
                      )}
                    >
                      {/* Terracotta accent top strip */}
                      <div className="h-0.5 w-full bg-primary" />
                      {link.content.map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center justify-between px-5 py-3 text-sm text-foreground hover:bg-terracotta-pale hover:text-primary transition-colors duration-150 border-b border-border last:border-0 font-body"
                        >
                          {sub.name}
                          <ChevronRight className="size-3.5 opacity-40" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.path!}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                  className={cn(
                    'relative py-2 text-sm font-medium font-body tracking-wide transition-colors duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary',
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Login button — desktop */}
          <Link
            href={user ? getDashboardPathForRole(user.userRole) : '/login'}
            className="hidden lg:flex items-center justify-center bg-primary text-white text-sm font-medium font-body px-6 py-3 hover:bg-accent transition-colors duration-200 tracking-wide"
          >
            {user ? 'Dashboard' : 'Login'}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 focus:outline-none"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-6 h-0.5 bg-foreground transition-all" />
            <span className="block w-6 h-0.5 bg-foreground transition-all" />
            <span className="block w-4 h-0.5 bg-foreground transition-all" />
          </button>
        </div>
      </div>

      {/* ── Mobile full-screen overlay ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-white flex flex-col lg:hidden transition-transform duration-500 ease-[cubic-bezier(.25,.8,.25,1)]',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Mobile overlay top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              href={user ? getDashboardPathForRole(user.userRole) : '/login'}
              onClick={() => setIsMenuOpen(false)}
              className="bg-primary text-white text-sm font-medium px-5 py-2.5 tracking-wide"
            >
              {user ? 'Dashboard' : 'Login'}
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center w-8 h-8 transition-colors duration-200"
              aria-label="Close menu"
            >
              <Image
                src="/assets/icons/closeIcon.svg"
                alt="Close menu"
                width={22}
                height={22}
              />
            </button>
          </div>
        </div>

        {/* Mobile nav links */}
        <div className="flex-1 overflow-y-auto divide-y divide-(--border)/20">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.content ? (
                <>
                  {/* Has sub-links — show chevron */}
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left text-lg font-medium font-body text-foreground hover:bg-background-100 transition-colors"
                    onClick={() =>
                      setMobileExpanded(
                        mobileExpanded === link.name ? null : link.name,
                      )
                    }
                  >
                    {link.name}
                    <ChevronRight
                      className={cn(
                        'size-5 text-foreground opacity-40 transition-transform duration-200',
                        mobileExpanded === link.name ? 'rotate-90' : '',
                      )}
                    />
                  </button>

                  {/* Accordion sub-links */}
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      mobileExpanded === link.name ? 'max-h-96' : 'max-h-0',
                    )}
                  >
                    <div className="divide-y divide-(--border)/20">
                      {link.content.map((sub) => (
                        <Link
                          key={sub.path}
                          href={sub.path}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setMobileExpanded(null);
                          }}
                          className="flex items-center justify-between pl-10 pr-6 py-4 text-base font-body text-foreground-100 hover:text-primary hover:bg-terracotta-pale transition-colors"
                        >
                          {sub.name}
                          <ChevronRight className="size-4 opacity-30" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* No sub-links — plain link, no chevron */
                <Link
                  href={link.path!}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center px-6 py-5 text-lg font-medium font-body text-foreground hover:bg-background-100 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Mobile bottom contact strip */}
        <div className="px-6 py-5 bg-background-100 border-t border-(--border)/40 text-xs text-foreground-100 flex flex-col gap-2">
          <span className="flex items-center gap-2">
            <Phone className="size-3.5 text-primary" />
            +234 801 234 5678
          </span>
          <span className="flex items-center gap-2">
            <Mail className="size-3.5 text-primary" />
            admissions@crestviewacademy.edu.ng
          </span>
        </div>
      </div>
    </nav>
  );
}
