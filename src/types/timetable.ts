import type { Section } from './class';

export type PeriodSlot = {
  id: string;
  section: Section;
  name: string;
  startTime: string;
  endTime: string;
  order: number;
  isBreak: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TimetableSubject = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
};

export type TimetableArm = {
  id: string;
  capacity: number;
  armId: string;
  classLevelId: string;
  arm: { id: string; name: string; isActive: boolean };
  classLevel: { id: string; name: string; section: Section; isActive: boolean };
};

export type TimetableSession = {
  id: string;
  name: string;
  isActive: boolean;
};

export type TimetableEntry = {
  id: string;
  dayOfWeek: DayOfWeek;
  classArmId: string;
  periodSlotId: string;
  subjectId: string | null;
  sessionId: string;
  periodSlot: PeriodSlot;
  subject: TimetableSubject | null;
  classArm: TimetableArm;
  session: TimetableSession;
  createdAt: string;
  updatedAt: string;
};

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

export type TimetableByDay = Record<DayOfWeek, TimetableEntry[]>;
