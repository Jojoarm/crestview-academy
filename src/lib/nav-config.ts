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
        { title: 'Sessions & Terms', url: '/admin/sessions' },
        { title: 'Classes & Arms', url: '/admin/classes' },
        { title: 'Subjects', url: '/admin/subjects' },
      ],
    },
    {
      title: 'Teacher Assignments',
      url: '/admin/teacher-assignments',
      icon: UserCheck,
    },
    {
      title: 'Fees',
      url: '#',
      icon: Banknote,
      items: [
        { title: 'Fee Types', url: '/admin/fee-types' },
        { title: 'Fee Structures', url: '/admin/fee-structures' },
      ],
    },
    {
      title: 'Timetable',
      url: '#',
      icon: CalendarClock,
      items: [
        { title: 'Period Slots', url: '/admin/period-slots' },
        { title: 'Class Timetables', url: '/admin/timetable' },
      ],
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
