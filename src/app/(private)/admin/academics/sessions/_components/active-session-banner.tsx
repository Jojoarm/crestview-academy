'use client';

import { CalendarDays, BookOpen } from 'lucide-react';
import { useActiveSession } from '@/hooks/admin/use-sessions';
import { Card } from '@/components/ui/card';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ActiveSessionBanner() {
  const { data: session, isLoading } = useActiveSession();

  const activeTerm = session?.terms.find((t) => t.isActive);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="bg-white border border-(--border-sand)/30 p-5 flex items-center gap-4"
          >
            <div className="p-3 rounded-lg bg-background-100 animate-pulse size-12" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-3 w-24 bg-background-100 animate-pulse rounded" />
              <div className="h-5 w-32 bg-background-100 animate-pulse rounded" />
              <div className="h-3 w-40 bg-background-100 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-white border border-(--border-sand) p-6 text-center">
        <p className="font-body text-sm text-(--charcoal-100)">
          No active academic session. Create and activate one below.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Active Session */}
      <Card className="p-5 flex flex-row gap-3.5 relative overflow-hidden group">
        <div className="relative">
          <div className="p-2 rounded-xl image-border bg-terracotta-pale text-terracotta shrink-0">
            <CalendarDays className="size-5" />
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <p className="text-xs text-(--charcoal) uppercase font-medium tracking-wide leading-none mb-1">
            Active Session
          </p>
          <p className="font-sans font-bold text-2xl text-(--charcoal) leading-none tabular-nums">
            {session.name}
          </p>
          <p className="text-xs text-(--charcoal-100) mt-0.5">
            {formatDate(session.startDate)} — {formatDate(session.endDate)}
          </p>
        </div>
      </Card>

      {/* Active Term */}
      <Card className="p-5 flex flex-row gap-3.5 relative overflow-hidden group">
        <div className="relative">
          <div className="p-2 rounded-xl image-border bg-light-violet text-violet border-light-violet shrink-0">
            <BookOpen className="size-5" />
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <p className="text-xs text-(--charcoal) uppercase font-medium tracking-wide leading-none mb-1">
            Active Term
          </p>

          {activeTerm ? (
            <>
              <p className="font-sans font-bold text-2xl text-(--charcoal) leading-none tabular-nums">
                {activeTerm?.name} Term
              </p>
              <p className="font-body text-xs text-(--charcoal-100) mt-0.5">
                {formatDate(activeTerm.startDate)} —{' '}
                {formatDate(activeTerm.endDate)}
              </p>
            </>
          ) : (
            <p className="font-body text-sm text-(--charcoal-100) mt-0.5">
              No active term
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
