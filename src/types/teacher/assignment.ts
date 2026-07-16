export type AssignmentType = 'Typed' | 'FileUpload';

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  type: AssignmentType;
  dueDate: string; // ISO date string
  isPublished: boolean;
  classArmId: string;
  subjectId: string;
  teacherId: string;
  sessionId: string;
  termId: string;
  classArm: {
    classLevel: { name: string }; // e.g. "JSS 1"
    arm: { name: string }; // e.g. "A"
  };
  subject: { name: string; code: string };
  teacher: { user: { id: string; name: string } };
  session: { name: string }; // e.g. "2025/2026"
  term: { name: string }; // "First" | "Second" | "Third"
  _count: { submissions: number };
}

export interface Submission {
  id: string;
  content: string | null;
  fileUrl: string | null;
  submittedAt: string; // ISO date string
  score: string | null; // Prisma.Decimal serializes as string — use parseFloat()
  feedback: string | null;
  gradedAt: string | null;
  student: { user: { id: string; name: string } };
  gradedBy: { user: { id: string; name: string } } | null;
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  type: AssignmentType;
  classArmId: string;
  subjectId: string;
  dueDate: string;
  isPublished?: boolean;
}

export type UpdateAssignmentInput = Partial<CreateAssignmentInput>;

export interface GradeSubmissionInput {
  score: number;
  feedback?: string;
}

export interface AssignmentListParams {
  classArmId?: string;
  subjectId?: string;
  page?: number;
  limit?: number;
}
