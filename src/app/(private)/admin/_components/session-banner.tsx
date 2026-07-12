'use client';

import { AlertTriangle, CalendarDays } from 'lucide-react';
import Link from 'next/link';

type Props = {
  session: {
    id: string;
    name: string;
    activeTerm: { id: string; name: string } | null;
  } | null;
  isLoading: boolean;
};

export function SessionBanner({ session, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-12 bg-muted animate-pulse rounded" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-ring/60 border border-card rounded">
        <AlertTriangle className="size-4 text-amber-600 shrink-0" />
        <p className="font-body text-sm text-amber-800">
          No active session.{' '}
          <Link
            href="/admin/academics/sessions"
            className="font-medium underline"
          >
            Set up an academic session
          </Link>{' '}
          to get started.
        </p>
      </div>
    );
  }

  if (!session.activeTerm) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-ring/60 border border-card rounded">
        <AlertTriangle className="size-4 text-amber-600 shrink-0" />
        <p className="font-body text-sm text-amber-800">
          No active term for {session.name}.{' '}
          <Link
            href="/admin/academics/sessions"
            className="font-medium underline"
          >
            Activate a term
          </Link>{' '}
          to enable attendance and results.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-light-violet border border-card/20 rounded">
      <CalendarDays className="size-4 text-deep-violet shrink-0" />
      <p className="font-body text-sm text-deep-violet">
        <span className="font-medium">{session.name}</span>
        <span className="mx-2 text-deep-violet/50">·</span>
        <span>{session.activeTerm.name} Term</span>
      </p>
    </div>
  );
}
