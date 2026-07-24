import { AttendanceStatus } from '@/types/teacher/attendance';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(amount: string) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(parseFloat(amount));
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export const AUDIENCE_COLORS: Record<string, string> = {
  Everyone: 'bg-[#FEF4EE] text-[#C66A42]',
  Teachers: 'bg-[#F5F3FA] text-[#403C5C]',
  Parents: 'bg-[#F5F7F2] text-[#5F6257]',
  Students: 'bg-[#FAFAF7] text-[#8B8F7E]',
};

export function getDaysUntil(dateString: string) {
  const days = Math.ceil(
    (new Date(dateString).getTime() - new Date().getTime()) / 86400000,
  );
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

export function formatClassArmLabel(classArm: {
  classLevel: { name: string };
  arm: { name: string };
}): string {
  return `${classArm.classLevel.name} ${classArm.arm.name}`;
}

export const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  'Present',
  'Absent',
  'Late',
  'Excused',
];

export const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-100 text-emerald-700',
  Absent: 'bg-red-100 text-red-700',
  Late: 'bg-amber-100 text-amber-700',
  Excused: 'bg-light-violet text-deep-violet',
};

// Assignemnt due dates
export function getDueStatus(dueDate: string): {
  label: string;
  className: string;
} {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: 'Overdue',
      className: 'bg-red-100 text-red-700',
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Due Today',
      className: 'bg-orange-100 text-orange-700',
    };
  }

  if (diffDays <= 3) {
    return {
      label: `Due in ${diffDays}d`,
      className: 'bg-amber-100 text-amber-700',
    };
  }

  return {
    label: `Due in ${diffDays}d`,
    className: 'bg-emerald-100 text-emerald-700',
  };
}
