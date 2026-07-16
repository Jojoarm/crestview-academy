'use client';

import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AUDIENCE_COLORS, cn, formatDate, getDaysUntil } from '@/lib/utils';
import type { UpcomingEvent } from '@/hooks/admin/use-analytics';

type Props = {
  events: UpcomingEvent[];
  isLoading: boolean;
};

export function UpcomingEventsList({ events, isLoading }: Props) {
  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-sans font-semibold text-base text-foreground">
          Upcoming Events
        </h2>
        <Link
          href="/admin/posts"
          className="font-body text-xs text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-4 text-center">
          No upcoming events.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 py-3 px-4 bg-muted border border-border rounded"
            >
              <div className="p-1.5 rounded-lg bg-terracotta-pale text-primary shrink-0 mt-0.5">
                <CalendarDays className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm font-medium text-foreground truncate">
                  {event.title}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
                      AUDIENCE_COLORS[event.audience],
                    )}
                  >
                    {event.audience}
                  </span>
                  {event.eventStartDate && (
                    <span className="font-body text-xs text-muted-foreground">
                      {formatDate(event.eventStartDate)}
                      {event.eventEndDate &&
                        event.eventEndDate !== event.eventStartDate &&
                        ` — ${formatDate(event.eventEndDate)}`}
                    </span>
                  )}
                </div>
              </div>
              {event.eventStartDate && (
                <span className="font-body text-xs font-medium text-primary shrink-0 mt-0.5">
                  {getDaysUntil(event.eventStartDate)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
