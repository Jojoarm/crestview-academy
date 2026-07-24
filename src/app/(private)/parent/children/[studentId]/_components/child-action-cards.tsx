'use client';

import { useRouter } from 'next/navigation';
import {
  CalendarCheck,
  FileText,
  ChevronRight,
  LucideIcon,
  CalendarDays,
  ClipboardList,
  Wallet,
} from 'lucide-react';

interface ChildAction {
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

function buildActions(studentId: string): ChildAction[] {
  return [
    {
      label: 'Assignments',
      description: 'View posted assignments',
      icon: ClipboardList,
      href: `/parent/children/${studentId}/assignments`,
    },
    {
      label: 'Fees',
      description: 'View amount owed this term',
      icon: Wallet,
      href: `/parent/children/${studentId}/fees`,
    },
    {
      label: 'Attendance',
      description: 'View daily attendance records',
      icon: CalendarCheck,
      href: `/parent/children/${studentId}/attendance`,
    },
    {
      label: 'Report Card',
      description: 'View term scores and remarks',
      icon: FileText,
      href: `/parent/children/${studentId}/report-card`,
    },
    {
      label: 'Timetable',
      description: 'View weekly class schedule',
      icon: CalendarDays,
      href: `/parent/children/${studentId}/timetable`,
    },
    // Fees, Timetable, etc. get appended here once their backend docs land.
  ];
}

export function ChildActionCards({ studentId }: { studentId: string }) {
  const router = useRouter();
  const actions = buildActions(studentId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {actions.map(({ label, description, icon: Icon, href }) => (
        <button
          key={href}
          type="button"
          onClick={() => router.push(href)}
          className="flex items-center gap-3.5 rounded-xl border border-border bg-card/50 p-5 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="p-2 rounded-xl bg-terracotta-pale text-primary image-border shrink-0">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-sans font-semibold text-sm text-deep-violet">
              {label}
            </p>
            <p className="font-body text-xs text-muted-foreground">
              {description}
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground shrink-0" />
        </button>
      ))}
    </div>
  );
}
