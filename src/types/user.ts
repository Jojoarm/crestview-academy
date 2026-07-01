// src/types/user.ts

import type { UserRole } from '@/lib/roles';

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  userRole: UserRole;
  banned: boolean;
  banReason?: string | null;
  forcePasswordChange: boolean;
  createdAt: string;
  updatedAt: string;
};

export const USER_ROLE_CONFIG: Record<
  UserRole,
  { label: string; className: string }
> = {
  super_admin: {
    label: 'Super Admin',
    className: 'bg-[var(--terracotta)] text-white',
  },
  admin: {
    label: 'Admin',
    className: 'bg-[#FEF4EE] text-[#C66A42]',
  },
  teacher: {
    label: 'Teacher',
    className: 'bg-[#F5F3FA] text-[#403C5C]',
  },
  parent: {
    label: 'Parent',
    className: 'bg-[#F5F7F2] text-[#5F6257]',
  },
  student: {
    label: 'Student',
    className: 'bg-[#B2B6A5]/20 text-[#8B8F7E]',
  },
};
