export type Relationship = 'Father' | 'Mother' | 'Guardian';
export type ReportCardStatus = 'Draft' | 'Published';

export interface AttendanceCounts {
  Present: number;
  Absent: number;
  Late: number;
  Excused: number;
}

export interface ChildDashboardSummary {
  studentId: string;
  name: string;
  admissionNumber: string;
  photoUrl: string | null;
  relationship: Relationship;
  isPrimary: boolean;
  currentClass: { classLevel: string; arm: string } | null;
  attendance: AttendanceCounts | null;
  reportCardStatus: ReportCardStatus | null;
  outstandingFeeCount: number;
}

export interface AssignmentDueSoon {
  assignmentId: string;
  studentId: string;
  title: string;
  subject: string;
  dueDate: string;
}

export interface RecentPost {
  id: string;
  title: string;
  type: 'Announcement' | 'News' | 'Event';
  publishedAt: string;
}

export interface ParentDashboardResponse {
  session: { id: string; name: string };
  term: { id: string; name: string } | null;
  children: ChildDashboardSummary[];
  assignmentsDueSoon: AssignmentDueSoon[];
  recentPosts: RecentPost[];
}
