import { UserRole } from './roles';

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  userRole: UserRole;
  forcePasswordChange: boolean;
};
