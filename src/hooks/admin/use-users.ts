import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type { ManagedUser } from '@/types/profile';
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

export function useUsers(params: UsersParams = {}) {
  const { page = 1, limit = 10, role, search } = params;

  return useQuery({
    queryKey: ['users', { page, limit, role, search }],
    queryFn: () => {
      const qs = new URLSearchParams();
      qs.set('page', String(page));
      qs.set('limit', String(limit));
      if (role) qs.set('role', role);
      if (search) qs.set('search', search);
      return apiClient.get<PaginatedResponse<ManagedUser>>(
        `/api/admin/users?${qs}`,
      );
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: () =>
      apiClient.get<{
        total: number;
        teachers: number;
        parents: number;
        students: number;
        admins: number;
      }>('/api/admin/users/stats'),
  });
}

export function useCreateUser(invalidateKey?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      apiClient.post<ManagedUser>('/api/admin/users', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: [invalidateKey] });
      }
    },
  });
}

export function useUpdateUser(id: string, invalidateKey?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      apiClient.patch<ManagedUser>(`/api/admin/users/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });

      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: [invalidateKey] });
      }
    },
  });
}

export function useBanUser(id: string, invalidateKey?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { reason?: string }) =>
      apiClient.patch<ManagedUser>(`/api/admin/users/${id}/ban`, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });

      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: [invalidateKey] });
      }
    },
  });
}

export function useUnbanUser(id: string, invalidateKey?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.patch<ManagedUser>(`/api/admin/users/${id}/unban`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: [invalidateKey] });
      }
    },
  });
}

export function useDeleteUser(id: string, invalidateKey?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: [invalidateKey] });
      }
    },
  });
}
