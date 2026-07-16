export interface ClassLevelSummary {
  id: string;
  name: string;
  section: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArmSummary {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A class-arm the logged-in teacher is assigned to (GET /api/teacher/classes) */
export interface TeacherClassArm {
  id: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
  classLevelId: string;
  armId: string;
  classLevel: ClassLevelSummary;
  arm: ArmSummary;
}

export interface SubjectSummary {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A subject-for-class-arm assignment the logged-in teacher teaches (GET /api/teacher/subjects) */
export interface TeacherSubjectAssignment {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  classArmId: string;
  subjectId: string;
  teacherId: string;
  sessionId: string;
  classArm: TeacherClassArm;
  subject: SubjectSummary;
}
