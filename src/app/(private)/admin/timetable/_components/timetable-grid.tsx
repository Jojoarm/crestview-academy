'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  useClassArmTimetable,
  usePeriodSlots,
} from '@/hooks/admin/use-timetable';
import {
  DAYS_OF_WEEK,
  type DayOfWeek,
  type TimetableEntry,
  type PeriodSlot,
} from '@/types/timetable';
import type { Section } from '@/types/class';
import { AssignSubjectDialog } from './assign-subject-dialog';

type Props = {
  classArmId: string;
  section: Section | '';
  label: string;
};

type CellTarget = {
  periodSlot: PeriodSlot;
  day: DayOfWeek;
  existingEntry: TimetableEntry | null;
};

export function TimetableGrid({ classArmId, section, label }: Props) {
  const [cellTarget, setCellTarget] = useState<CellTarget | null>(null);

  const { data: timetableData, isLoading: timetableLoading } =
    useClassArmTimetable(classArmId);

  const { data: periodSlots, isLoading: slotsLoading } = usePeriodSlots(
    section as Section,
  );

  const isLoading = timetableLoading || slotsLoading;

  // Build lookup: periodSlotId + dayOfWeek → entry
  const entryLookup: Record<string, TimetableEntry> = {};
  if (timetableData) {
    DAYS_OF_WEEK.forEach((day) => {
      (timetableData[day] ?? []).forEach((entry) => {
        entryLookup[`${entry.periodSlotId}__${day}`] = entry;
      });
    });
  }

  const slots = periodSlots ?? [];

  if (isLoading) {
    return (
      <Card className="p-5 overflow-x-auto">
        <div className="animate-pulse flex flex-col gap-3">
          <div className="h-8 bg-muted rounded w-48" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </div>
      </Card>
    );
  }

  if (slots.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="font-body text-sm text-muted-foreground">
          No period slots configured for this section. Add them in the Period
          Slots tab first.
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans font-semibold text-lg text-foreground">
            {label}
          </h2>
          <p className="font-body text-xs text-muted-foreground">
            Click any cell to assign or change a subject
          </p>
        </div>

        <table className="w-full border-collapse min-w-160">
          <thead>
            <tr>
              {/* Time column header */}
              <th className="text-left font-body text-xs font-medium text-muted-foreground uppercase tracking-wide py-2 pr-3 w-36">
                Period
              </th>
              {DAYS_OF_WEEK.map((day) => (
                <th
                  key={day}
                  className="text-left font-body text-xs font-medium text-muted-foreground uppercase tracking-wide py-2 px-2"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => {
              if (slot.isBreak) {
                return (
                  <tr key={slot.id}>
                    <td colSpan={6} className="py-1.5">
                      <div className="bg-muted border border-border rounded px-3 py-2 flex items-center justify-between">
                        <span className="font-body text-xs font-medium text-muted-foreground">
                          {slot.name}
                        </span>
                        <span className="font-body text-xs text-muted-foreground">
                          {slot.startTime} — {slot.endTime}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={slot.id} className="border-t border-border/30">
                  {/* Period label */}
                  <td className="py-2 pr-3">
                    <p className="font-body text-xs font-medium text-foreground">
                      {slot.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {slot.startTime} — {slot.endTime}
                    </p>
                  </td>

                  {/* Day cells */}
                  {DAYS_OF_WEEK.map((day) => {
                    const entry = entryLookup[`${slot.id}__${day}`] ?? null;

                    return (
                      <td key={day} className="py-2 px-2">
                        <button
                          onClick={() =>
                            setCellTarget({
                              periodSlot: slot,
                              day,
                              existingEntry: entry,
                            })
                          }
                          className={cn(
                            'w-full min-h-12 rounded px-2 py-1.5 text-left transition-colors border',
                            entry
                              ? 'bg-terracotta-pale border-primary/20 hover:bg-terracotta-pale/80'
                              : 'bg-background border-border border-dashed hover:bg-muted',
                          )}
                        >
                          {entry?.subject ? (
                            <div>
                              <p className="font-body text-xs font-semibold text-primary truncate">
                                {entry.subject.name}
                              </p>
                              <p className="font-body text-xs text-primary/70">
                                {entry.subject.code}
                              </p>
                            </div>
                          ) : (
                            <p className="font-body text-xs text-muted-foreground">
                              + Add
                            </p>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {cellTarget && (
        <AssignSubjectDialog
          open={!!cellTarget}
          onClose={() => setCellTarget(null)}
          classArmId={classArmId}
          periodSlot={cellTarget.periodSlot}
          day={cellTarget.day}
          existingEntry={cellTarget.existingEntry}
          section={section as Section}
        />
      )}
    </>
  );
}
