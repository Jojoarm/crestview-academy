export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  date: string; // ISO date string, time component discarded
  status: AttendanceStatus;
  studentId: string;
  classArmId: string;
  termId: string;
  sessionId: string;
  markedById: string;
  student: { user: { id: string; name: string } };
  classArm: {
    classLevel: { name: string };
    arm: { name: string };
  };
  markedBy: { user: { id: string; name: string } };
}

export interface MarkAttendanceInput {
  classArmId: string;
  date: string; // e.g. "2026-07-15"
  records: { studentId: string; status: AttendanceStatus }[];
}

export interface AttendanceListParams {
  classArmId: string;
  date?: string;
  page?: number;
  limit?: number;
}

export interface ClassArmStudent {
  studentId: string;
  admissionNumber: string;
  name: string;
  photoUrl: string | null;
}
