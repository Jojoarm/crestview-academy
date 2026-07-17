import { PostType } from './post';

export interface AttendanceStatusToday {
  classArmId: string;
  classLevel: string; // e.g. "JSS 1"
  arm: string; // e.g. "A"
  isMarked: boolean;
}

export interface DashboardSummary {
  classTeacherOfCount: number;
  teachingClassArmCount: number;
  subjectCount: number;
  totalStudents: number;
}

export interface RecentPost {
  id: string;
  title: string;
  type: PostType;
  publishedAt: string;
}

export interface Dashboard {
  attendanceStatusToday: AttendanceStatusToday[];
  summary: DashboardSummary;
  recentPosts: RecentPost[];
}
