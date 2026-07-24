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

import { DAYS_OF_WEEK, type TimetableEntry } from '@/types/parent/timetable';

interface PeriodRow {
  key: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface ChildTimetableGridProps {
  entries: TimetableEntry[];
}

export function ChildTimetableGrid({ entries }: ChildTimetableGridProps) {
  // Rows are unique period slots by start time, sorted chronologically.
  // A day with no entry for a slot just renders an empty cell.
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

function TimetableCell({ entry }: { entry: TimetableEntry | undefined }) {
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
    <div className="rounded-lg border border-border/50 px-2 py-2">
      <p className="font-body text-sm text-foreground truncate">
        {entry.subject?.name ?? '—'}
      </p>
    </div>
  );
}
