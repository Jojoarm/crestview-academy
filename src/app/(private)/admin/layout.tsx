'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { ADMIN_ROLES, getDashboardPathForRole } from '@/lib/roles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (!ADMIN_ROLES.includes(user.userRole)) {
      router.replace(getDashboardPathForRole(user.userRole));
    }
  }, [router, user]);

  if (!user || !ADMIN_ROLES.includes(user.userRole)) {
    return null;
  }

  return children;
}
