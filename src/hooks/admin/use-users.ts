import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type { User } from '@/types/user';
import type { UserRole } from '@/lib/roles';

type UsersParams = {
  page?: number;
  limit?: number;
  role?: UserRole | '';
  search?: string;
};

type CreateUserPayload = {
  name: string;
  email: string;
  temporaryPassword: string;
  userRole: UserRole;
};

type UpdateUserPayload = {
  name?: string;
  email?: string;
  userRole?: UserRole;
};

type BanUserPayload = {
  reason?: string;
};

type UserStats = {
  total: number;
  teachers: number;
  parents: number;
  students: number;
  admins: number;
};

export function useUsers(params: UsersParams = {}) {
  const { page = 1, limit = 10, role, search } = params;

  return useQuery({
    queryKey: ['users', { page, limit, role, search }],
    queryFn: () => {
      const qs = new URLSearchParams();

      qs.set('page', String(page));
      qs.set('limit', String(limit));

      if (role) qs.set('userRole', role);

      if (search?.trim()) qs.set('search', search.trim());

      return apiClient.get<PaginatedResponse<User>>(`/api/admin/users?${qs}`);
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: () => apiClient.get<UserStats>('/api/admin/users/stats'),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      apiClient.post<User>('/api/admin/users', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      apiClient.patch<User>(`/api/admin/users/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useBanUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BanUserPayload) =>
      apiClient.patch<User>(`/api/admin/users/${id}/ban`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUnbanUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.patch<User>(`/api/admin/users/${id}/unban`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });
}
