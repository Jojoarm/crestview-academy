export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  studentId: string;
  classArmId: string;
  termId: string;
  sessionId: string;
  markedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSummary {
  Present: number;
  Absent: number;
  Late: number;
  Excused: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChildAttendanceResponse {
  data: AttendanceRecord[];
  meta: PaginationMeta;
  summary: AttendanceSummary;
  session: { id: string; name: string };
  term: { id: string; name: string };
}

export interface ChildAttendanceParams {
  sessionId?: string;
  termId?: string;
  page?: number;
  limit?: number;
}

export const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-50 text-emerald-600',
  Absent: 'bg-rose-50 text-rose-600',
  Late: 'bg-amber-50 text-amber-600',
  Excused: 'bg-sky-50 text-sky-600',
};
