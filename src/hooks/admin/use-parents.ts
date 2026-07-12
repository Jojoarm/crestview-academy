import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type { Parent, UpdateParentPayload } from '@/types/profile';

export const parentKeys = {
  all: ['parents'] as const,
  list: (params?: ParentParams) => ['parents', 'list', params] as const,
  detail: (id: string) => ['parents', 'detail', id] as const,
};

type ParentParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export function useParents(params: ParentParams = {}) {
  return useQuery({
    queryKey: parentKeys.list(params),
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.search) search.set('search', params.search);
      if (params.page) search.set('page', String(params.page));
      if (params.limit) search.set('limit', String(params.limit));
      return apiClient.get<PaginatedResponse<Parent>>(
        `/api/admin/parents?${search}`,
      );
    },
  });
}

export function useParent(id: string) {
  return useQuery({
    queryKey: parentKeys.detail(id),
    queryFn: () => apiClient.get<Parent>(`/api/admin/parents/${id}`),
    enabled: !!id,
  });
}

export function useUpdateParent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateParentPayload) =>
      apiClient.patch<Parent>(`/api/admin/parents/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parentKeys.all });
    },
  });
}

export function useDeactivateParent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/parents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parentKeys.all });
    },
  });
}
