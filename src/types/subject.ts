import type { Section } from './class';

export type SubjectClassLevel = {
  id: string;
  name: string;
  section: Section;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ClassAssignment = {
  id: string;
  isCompulsory: boolean;
  subjectId: string;
  classLevelId: string;
  classLevel: SubjectClassLevel;
  createdAt: string;
  updatedAt: string;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
  classAssignments: ClassAssignment[];
  createdAt: string;
  updatedAt: string;
};
