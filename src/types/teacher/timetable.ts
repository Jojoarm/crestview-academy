export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday';

export type TimetableRole = 'ClassTeacher' | 'SubjectTeacher';

export interface TimetableEntry {
  id: string;
  dayOfWeek: DayOfWeek;
  classArm: { classLevel: string; arm: string };
  subject: { name: string; code: string } | null; // null for break periods
  periodSlot: {
    name: string; // e.g. "Period 1", "Short Break"
    startTime: string; // "HH:mm" 24hr
    endTime: string;
    isBreak: boolean;
  };
  // Why this period is on the teacher's timetable. A period can carry both
  // roles at once (e.g. class teacher who also teaches a subject in their
  // own homeroom) — check with .includes(), don't rely on array order.
  roles: TimetableRole[];
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export const ROLE_LABELS: Record<TimetableRole, string> = {
  ClassTeacher: 'Class',
  SubjectTeacher: 'Subject',
};

export const ROLE_COLORS: Record<TimetableRole, string> = {
  ClassTeacher: 'bg-light-violet text-deep-violet',
  SubjectTeacher: 'bg-terracotta-pale text-primary',
};
