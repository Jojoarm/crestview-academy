export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type ReportCardStatus = 'Draft' | 'Published';

export interface ScoreEntry {
  caScore: string;
  examScore: string;
  total: string;
  grade: Grade;
  subject: { name: string; code: string };
}

export interface AttendanceSummary {
  Present: number;
  Absent: number;
  Late: number;
  Excused: number;
}

export interface AdminReportCardResponse {
  student: { admissionNumber: string; name: string };
  term: { id: string; name: string };
  session: { id: string; name: string };
  remark: string | null;
  status: ReportCardStatus;
  publishedAt: string | null;
  scores: ScoreEntry[];
  attendance: {
    summary: AttendanceSummary;
    totalDaysMarked: number;
  };
}

export interface ReportCardActionResult {
  id: string;
  remark: string;
  status: ReportCardStatus;
  publishedAt: string | null;
}

export const GRADE_COLORS: Record<Grade, string> = {
  A: 'bg-emerald-100 text-emerald-700',
  B: 'bg-lime-100 text-lime-700',
  C: 'bg-amber-100 text-amber-700',
  D: 'bg-orange-100 text-orange-700',
  E: 'bg-rose-100 text-rose-700',
  F: 'bg-red-100 text-red-700',
};
