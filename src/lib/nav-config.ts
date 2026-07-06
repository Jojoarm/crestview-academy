import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  Banknote,
  CalendarClock,
  Megaphone,
} from 'lucide-react';
import type { UserRole } from './roles';

export type NavSubItem = {
  title: string;
  url: string;
};

export type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  items?: NavSubItem[];
};

export type NavConfig = {
  navMain: NavItem[];
};

const adminNav: NavConfig = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: Users,
    },
    {
      title: 'Academics',
      url: '#',
      icon: GraduationCap,
      items: [
        { title: 'Sessions & Terms', url: '/admin/academics/sessions' },
        { title: 'Classes & Arms', url: '/admin/academics/classes' },
        { title: 'Subjects', url: '/admin/academics/subjects' },
      ],
    },
    {
      title: 'Teacher Assignment',
      url: '/admin/teacher-assignment',
      icon: UserCheck,
    },
    {
      title: 'Fee Structures',
      url: '/admin/fee-structures',
      icon: Banknote,
    },
    {
      title: 'Timetable',
      url: '/admin/timetable',
      icon: CalendarClock,
    },
    {
      title: 'Posts',
      url: '/admin/posts',
      icon: Megaphone,
    },
  ],
};

const navByRole: Partial<Record<UserRole, NavConfig>> = {
  super_admin: adminNav,
  admin: adminNav,
};

export function getNavConfig(role: UserRole): NavConfig {
  return navByRole[role] ?? { navMain: [] };
}
