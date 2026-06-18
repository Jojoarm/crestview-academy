'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Props {
  className?: string;
}

const Logo = ({ className = 'navbar-logo w-12 md:w-35 lg:w-40' }: Props) => {
  return (
    <Link
      onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
      href="/"
      className={className}
    >
      <div className="block md:hidden w-full">
        <Image
          className="object-cover w-full"
          src="/assets/logo/crestview-logo_stacked.png"
          alt="Crest View logo"
          width={1913}
          height={2000}
          priority
        />
      </div>
      <div className="hidden md:block w-full">
        <Image
          className="object-cover w-full"
          src="/assets/logo/crestview-logo.png"
          alt="Crest View logo"
          width={1962}
          height={485}
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
