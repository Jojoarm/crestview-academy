export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'teacher'
  | 'parent'
  | 'student';

export const ADMIN_ROLES: UserRole[] = ['super_admin', 'admin'];

// Where each role lands after login / when hitting (auth) routes while already authenticated
const ROLE_DASHBOARD_PATH: Record<UserRole, string> = {
  super_admin: '/admin',
  admin: '/admin',
  teacher: '/teacher',
  parent: '/parent',
  student: '/student',
};

export function getDashboardPathForRole(role: UserRole): string {
  return ROLE_DASHBOARD_PATH[role] ?? '/auth/login';
}
