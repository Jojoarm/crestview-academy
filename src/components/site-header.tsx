'use client';

import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

const PATH_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'Users',
  '/admin/sessions': 'Sessions & Terms',
  '/admin/classes': 'Classes & Arms',
  '/admin/subjects': 'Subjects',
  '/admin/teacher-assignments': 'Teacher Assignments',
  '/admin/fee-structures': 'Fee Structure',
  '/admin/timetable': 'Timetable',
  '/admin/posts': 'Posts',
  '/admin/settings': 'Settings',
  '/admin/profile': 'Profile',
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (PATH_TITLES[pathname]) return PATH_TITLES[pathname];

  // Find the longest matching prefix for nested routes (e.g. /admin/users/create)
  const match = Object.keys(PATH_TITLES)
    .filter((key) => pathname.startsWith(key) && key !== '/admin')
    .sort((a, b) => b.length - a.length)[0];

  return match ? PATH_TITLES[match] : 'Dashboard';
}

export function SiteHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-(--border-sand) transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-(--charcoal)" />
        <Separator orientation="vertical" className="mx-2 bg-(--border-sand)" />
        <h1 className="text-base font-medium font-body text-(--charcoal)">
          {title}
        </h1>
      </div>
    </header>
  );
}
