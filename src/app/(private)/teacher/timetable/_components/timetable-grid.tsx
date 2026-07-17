'use client';

import { useMemo } from 'react';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';
import {
  DAYS_OF_WEEK,
  ROLE_COLORS,
  ROLE_LABELS,
  type TimetableEntry,
} from '@/types/teacher/timetable';

interface PeriodRow {
  key: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface TimetableGridProps {
  entries: TimetableEntry[];
  /** Off for the Class Timetable tab — every cell is the same class, so
   * repeating it in each cell is just noise. On for My Subject Periods,
   * where it's the whole point of the column. */
  showClassArm?: boolean;
  emptyMessage?: string;
}

export function TimetableGrid({
  entries,
  showClassArm = true,
  emptyMessage = 'Nothing scheduled here yet.',
}: TimetableGridProps) {
  // Rows are unique period slots by start time (assumed consistent across
  // days), sorted chronologically. A day with no entry for a slot just
  // renders an empty cell — no assumption that every day is identical.
  const { periodRows, cellsByDayAndTime } = useMemo(() => {
    const rowsMap = new Map<string, PeriodRow>();
    const cells = new Map<string, TimetableEntry>();

    entries.forEach((entry) => {
      const key = entry.periodSlot.startTime;
      if (!rowsMap.has(key)) {
        rowsMap.set(key, {
          key,
          name: entry.periodSlot.name,
          startTime: entry.periodSlot.startTime,
          endTime: entry.periodSlot.endTime,
        });
      }
      cells.set(`${entry.dayOfWeek}__${key}`, entry);
    });

    const rows = Array.from(rowsMap.values()).sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );

    return { periodRows: rows, cellsByDayAndTime: cells };
  }, [entries]);

  if (periodRows.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground w-36">
              Period
            </TableHead>
            {DAYS_OF_WEEK.map((day) => (
              <TableHead
                key={day}
                className="font-body font-semibold text-xs uppercase tracking-wide text-muted-foreground min-w-40"
              >
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {periodRows.map((row) => (
            <TableRow key={row.key} className="border-border/20">
              <TableCell className="align-top py-3">
                <p className="font-body text-sm font-medium text-foreground">
                  {row.name}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {row.startTime} &ndash; {row.endTime}
                </p>
              </TableCell>
              {DAYS_OF_WEEK.map((day) => (
                <TableCell key={day} className="align-top py-3">
                  <TimetableCell
                    entry={cellsByDayAndTime.get(`${day}__${row.key}`)}
                    showClassArm={showClassArm}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function TimetableCell({
  entry,
  showClassArm,
}: {
  entry: TimetableEntry | undefined;
  showClassArm: boolean;
}) {
  if (!entry) {
    return <p className="font-body text-xs text-muted-foreground/50">—</p>;
  }

  if (entry.periodSlot.isBreak) {
    return (
      <div className="rounded-lg bg-muted/60 px-2 py-2">
        <p className="font-body text-xs text-muted-foreground">
          {entry.periodSlot.name}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 px-2 py-2 space-y-1">
      <p className="font-body text-sm text-foreground truncate">
        {entry.subject?.name ?? '—'}
      </p>
      {showClassArm && (
        <p className="font-body text-xs text-muted-foreground truncate">
          {entry.classArm.classLevel} {entry.classArm.arm}
        </p>
      )}
      <div className="flex flex-wrap gap-1">
        {entry.roles.map((role) => (
          <span
            key={role}
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-body font-medium',
              ROLE_COLORS[role],
            )}
          >
            {ROLE_LABELS[role]}
          </span>
        ))}
      </div>
    </div>
  );
}
