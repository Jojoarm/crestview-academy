import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  Banknote,
  CalendarClock,
  Megaphone,
  ClipboardList,
  CalendarCheck,
  NotebookPen,
  ScrollText,
  CalendarDays,
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
      title: 'User Management',
      url: '#',
      icon: Users,
      items: [
        { title: 'Teachers', url: '/admin/users/teachers' },
        { title: 'Students', url: '/admin/users/students' },
        { title: 'Parents', url: '/admin/users/parents' },
        { title: 'Admins', url: '/admin/users/admins' },
      ],
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

const teacherNav: NavConfig = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/teacher',
      icon: LayoutDashboard,
    },
    {
      title: 'Profile',
      url: '/teacher/profile',
      icon: Users,
    },
    {
      title: 'Assignments',
      url: '/teacher/assignments',
      icon: ClipboardList,
    },
    {
      title: 'Attendance',
      url: '/teacher/attendance',
      icon: CalendarCheck,
    },
    {
      title: 'My Timetable',
      url: '/teacher/timetable',
      icon: CalendarDays,
    },
    {
      title: 'Student Grading',
      url: '/teacher/student-grading',
      icon: NotebookPen,
    },
    {
      title: 'Report Cards',
      url: '/teacher/report-cards',
      icon: ScrollText,
    },
    {
      title: 'Announcements',
      url: '/teacher/announcements',
      icon: Megaphone,
    },
  ],
};

const navByRole: Partial<Record<UserRole, NavConfig>> = {
  super_admin: adminNav,
  admin: adminNav,
  teacher: teacherNav,
};

export function getNavConfig(role: UserRole): NavConfig {
  return navByRole[role] ?? { navMain: [] };
}
