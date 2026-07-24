export type AssignmentType = 'Typed' | 'FileUpload';

export interface AssignmentSummary {
  id: string;
  title: string;
  description: string | null;
  type: AssignmentType;
  dueDate: string;
  subject: { name: string; code: string };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChildAssignmentsResponse {
  classArm: { classLevel: string; arm: string };
  session: { id: string; name: string };
  term: { id: string; name: string };
  data: AssignmentSummary[];
  meta: PaginationMeta;
}

export interface ChildAssignmentsParams {
  sessionId?: string;
  termId?: string;
  page?: number;
  limit?: number;
}

export const ASSIGNMENT_TYPE_LABELS: Record<AssignmentType, string> = {
  Typed: 'Typed response',
  FileUpload: 'File upload',
};
