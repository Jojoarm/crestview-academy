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
