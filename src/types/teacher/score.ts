export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ScoreListItem {
  id: string;
  caScore: string; // Prisma.Decimal serializes as string — parseFloat() to use
  examScore: string; // same
  total: string; // server-computed, don't send this yourself
  grade: Grade; // server-computed
  studentId: string;
  subjectId: string;
  student: { user: { name: string } };
  subject: { name: string; code: string };
}

export interface MarkScoresInput {
  classArmId: string;
  subjectId: string;
  records: { studentId: string; caScore: number; examScore: number }[];
  sessionId?: string;
  termId?: string;
}

export interface ScoreListParams {
  classArmId: string;
  subjectId?: string;
  sessionId?: string;
  termId?: string;
  page?: number;
  limit?: number;
}

export interface ScoreListResponse {
  term: { id: string; name: string };
  session: { id: string; name: string };
  data: ScoreListItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface UpdateScoreInput {
  caScore: number;
  examScore: number;
}

export interface ClassArmSubject {
  subjectId: string;
  name: string;
  code: string;
}

export interface SubjectOption {
  subjectId: string;
  name: string;
  code: string;
}

export const GRADE_COLORS: Record<Grade, string> = {
  A: 'bg-emerald-100 text-emerald-700',
  B: 'bg-emerald-50 text-emerald-600',
  C: 'bg-amber-100 text-amber-700',
  D: 'bg-orange-100 text-orange-700',
  E: 'bg-orange-100 text-orange-800',
  F: 'bg-red-100 text-red-700',
};

// Server-side grading scale — informational only, no client-side computation.
export const GRADE_SCALE: { grade: Grade; range: string }[] = [
  { grade: 'A', range: '70–100' },
  { grade: 'B', range: '60–69' },
  { grade: 'C', range: '50–59' },
  { grade: 'D', range: '45–49' },
  { grade: 'E', range: '40–44' },
  { grade: 'F', range: '0–39' },
];
