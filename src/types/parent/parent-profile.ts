export interface ParentProfile {
  id: string;
  phone: string | null;
  address: string | null;
  photoUrl: string | null;
  occupation: string | null;
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

export interface UpdateParentProfileInput {
  phone?: string;
  address?: string;
  photoUrl?: string;
  occupation?: string;
}
