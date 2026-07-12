export type AssignmentTeacherUser = {
  id: string;
  name: string;
  email: string;
  userRole: string;
};

export type AssignmentTeacher = {
  id: string;
  user: AssignmentTeacherUser;
};

export type AssignmentSubject = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
};

export type AssignmentArm = {
  id: string;
  name: string;
  isActive: boolean;
};

export type AssignmentClassLevel = {
  id: string;
  name: string;
  section: string;
  isActive: boolean;
};

export type AssignmentClassArm = {
  id: string;
  capacity: number;
  classLevelId: string;
  armId: string;
  arm: AssignmentArm;
  classLevel: AssignmentClassLevel;
};

export type AssignmentSession = {
  id: string;
  name: string;
  isActive: boolean;
};

export type ClassTeacher = {
  id: string;
  isActive: boolean;
  classArmId: string;
  teacherId: string;
  sessionId: string;
  teacher: AssignmentTeacher;
  classArm: AssignmentClassArm;
  session: AssignmentSession;
  createdAt: string;
  updatedAt: string;
};

export type SubjectTeacher = {
  id: string;
  isActive: boolean;
  classArmId: string;
  subjectId: string;
  teacherId: string;
  sessionId: string;
  teacher: AssignmentTeacher;
  subject: AssignmentSubject;
  classArm: AssignmentClassArm;
  session: AssignmentSession;
  createdAt: string;
  updatedAt: string;
};

export type ArmTeachers = {
  classTeachers: ClassTeacher[];
  subjectTeachers: SubjectTeacher[];
};
