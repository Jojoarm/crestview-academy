export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  userRole: string;
  banned: boolean;
  createdAt: string;
};

export type Gender = 'Male' | 'Female';
export type EmploymentType = 'FullTime' | 'PartTime' | 'Contract';
export type Relationship = 'Father' | 'Mother' | 'Guardian';

// Teacher
export type Teacher = {
  id: string;
  employeeId: string;
  dateOfBirth: string | null;
  gender: Gender | null;
  address: string | null;
  photoUrl: string | null;
  phone: string | null;
  qualification: string | null;
  designation: string | null;
  employmentType: EmploymentType | null;
  dateOfEmployment: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: ProfileUser;
  classArmTeachers?: unknown[];
  subjectTeachers?: unknown[];
};

export type UpdateTeacherPayload = {
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  photoUrl?: string;
  phone?: string;
  qualification?: string;
  designation?: string;
  employmentType?: EmploymentType;
  dateOfEmployment?: string;
};

// Student

export type StudentEnrollment = {
  id: string;
  isActive: boolean;
  createdAt: string;
  classArm: {
    id: string;
    capacity: number;
    arm: { id: string; name: string };
    classLevel: { id: string; name: string; section: string };
  };
  session: { id: string; name: string; isActive: boolean };
};

export type StudentParent = {
  relationship: Relationship;
  isPrimary: boolean;
  parent: {
    id: string;
    user: { id: string; name: string; email: string };
  };
};

export type Student = {
  id: string;
  admissionNumber: string;
  dateOfBirth: string | null;
  gender: Gender | null;
  address: string | null;
  photoUrl: string | null;
  bloodGroup: string | null;
  genotype: string | null;
  medicalConditions: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: ProfileUser;
  parents: StudentParent[];
  enrollments?: StudentEnrollment[];
};

export type UpdateStudentPayload = {
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  photoUrl?: string;
  bloodGroup?: string;
  genotype?: string;
  medicalConditions?: string;
};

// Parent

export type ParentChild = {
  relationship: Relationship;
  isPrimary: boolean;
  student: {
    id: string;
    admissionNumber: string;
    user: { id: string; name: string; email: string };
    enrollments: StudentEnrollment[];
  };
};

export type Parent = {
  id: string;
  phone: string | null;
  address: string | null;
  photoUrl: string | null;
  occupation: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: ProfileUser;
  students: ParentChild[];
};

export type UpdateParentPayload = {
  phone?: string;
  address?: string;
  photoUrl?: string;
  occupation?: string;
};

// Admin
export type Admin = {
  id: string;
  phone: string | null;
  address: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: ProfileUser;
};

export type UpdateAdminPayload = {
  phone?: string;
  address?: string;
  photoUrl?: string;
};

// ManagedUser

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string | null;
  userRole: 'super_admin' | 'admin' | 'teacher' | 'parent' | 'student' | null;
  banned: boolean | null;
  forcePasswordChange: boolean | null;
  createdAt: string;
  updatedAt: string;
  student: { id: string; admissionNumber: string; isActive: boolean } | null;
  teacher: { id: string; employeeId: string; isActive: boolean } | null;
  parent: { id: string; isActive: boolean } | null;
  admin: { id: string; isActive: boolean } | null;
};
