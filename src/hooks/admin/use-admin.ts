import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Admin, UpdateAdminPayload } from '@/types/profile';
import { PaginatedResponse } from '@/lib/types';

export const adminProfileKeys = {
  all: ['admins'] as const,
  list: (params?: AdminParams) => ['admins', 'list', params] as const,
  detail: (id: string) => ['admins', 'detail', id] as const,
};

type AdminParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export function useAdmins(params: AdminParams = {}) {
  return useQuery({
    queryKey: adminProfileKeys.list(params),
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.search) search.set('search', params.search);
      if (params.page) search.set('page', String(params.page));
      if (params.limit) search.set('limit', String(params.limit));
      return apiClient.get<PaginatedResponse<Admin>>(
        `/api/admin/admins?${search}`,
      );
    },
  });
}

export function useAdminProfile(id: string) {
  return useQuery({
    queryKey: adminProfileKeys.detail(id),
    queryFn: () => apiClient.get<Admin>(`/api/admin/admins/${id}`),
    enabled: !!id,
  });
}

export function useUpdateAdminProfile(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAdminPayload) =>
      apiClient.patch<Admin>(`/api/admin/admins/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProfileKeys.all });
    },
  });
}
