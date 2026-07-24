export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export interface TimetableEntry {
  id: string;
  dayOfWeek: DayOfWeek;
  subject: { name: string; code: string } | null;
  periodSlot: {
    name: string;
    startTime: string;
    endTime: string;
    isBreak: boolean;
  };
}

export interface ChildTimetableResponse {
  classArm: { classLevel: string; arm: string };
  session: { id: string; name: string };
  entries: TimetableEntry[];
}

export interface ChildTimetableParams {
  sessionId?: string;
}
