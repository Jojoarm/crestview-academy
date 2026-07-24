'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { getDashboardPathForRole } from '@/lib/roles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (user.userRole !== 'parent') {
      router.replace(getDashboardPathForRole(user.userRole));
    }
  }, [router, user]);

  if (!user || user.userRole !== 'parent') {
    return null;
  }

  return children;
}
