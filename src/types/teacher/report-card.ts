import type { Grade } from './score';

export type ReportCardStatus = 'Draft' | 'Published';

export interface TermSummary {
  id: string;
  name: string; // "First" | "Second" | "Third"
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface SessionSummary {
  id: string;
  name: string; // e.g. "2025/2026"
  isActive: boolean;
  startDate: string;
  endDate: string;
  terms: TermSummary[];
}

export interface ReportCardScoreRow {
  caScore: string; // Decimal — parseFloat() to use
  examScore: string;
  total: string;
  grade: Grade;
  subject: { name: string; code: string };
}

export interface ReportCardAttendance {
  summary: { Present: number; Absent: number; Late: number; Excused: number };
  totalDaysMarked: number;
}

export interface ReportCard {
  student: { admissionNumber: string; name: string };
  term: { id: string; name: string };
  session: { id: string; name: string };
  remark: string | null; // null if not written yet
  status: ReportCardStatus;
  publishedAt: string | null;
  scores: ReportCardScoreRow[];
  attendance: ReportCardAttendance;
}

export interface ReportCardMutationResult {
  id: string;
  remark: string;
  status: ReportCardStatus;
  publishedAt: string | null;
}

export interface ReportCardQueryParams {
  sessionId?: string;
  termId?: string;
}

export interface SaveRemarkInput {
  remark: string;
  sessionId?: string;
  termId?: string;
}
