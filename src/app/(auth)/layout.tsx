import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/get-current-user';
import { getDashboardPathForRole } from '@/lib/roles';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user && !user.forcePasswordChange) {
    redirect(getDashboardPathForRole(user.userRole));
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: 'outline',
          className: 'absolute left-4 top-4 md:left-8 md:top-8',
        })}
      >
        <ArrowLeft className="size-4" /> Home
      </Link>
      <div className="flex w-full max-w-sm mx-auto flex-col items-center justify-center gap-6">
        <Logo />

        {children}

        <div className="text-balance text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <span className="hover:text-primary hover:underline">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="hover:text-primary hover:underline">
            Privacy Policy
          </span>
          .
        </div>
      </div>
    </div>
  );
}
