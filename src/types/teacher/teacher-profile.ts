export type Gender = 'Male' | 'Female';

export interface TeacherProfile {
  id: string;
  employeeId: string; // e.g. "CRV/TCH/2025/001"
  dateOfBirth: string | null; // ISO date string
  gender: Gender | null;
  address: string | null;
  photoUrl: string | null;
  phone: string | null;
  qualification: string | null;
  designation: string | null;
  employmentType: string | null;
  dateOfEmployment: string | null;
  isActive: boolean;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    userRole: string;
    banned: boolean | null;
    createdAt: string;
  };
}

export interface UpdateTeacherProfileInput {
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  photoUrl?: string;
  phone?: string;
  qualification?: string;
}
