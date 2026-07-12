import { apiClient } from '@/lib/api-client';
import { PaginatedResponse } from '@/lib/types';
import { Teacher, UpdateTeacherPayload } from '@/types/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type TeacherParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export const teacherKeys = {
  all: ['teachers'] as const,
  list: (params?: TeacherParams) => ['teachers', 'list', params] as const,
  detail: (id: string) => ['teachers', 'detail', id] as const,
};

export function useTeachers(params: TeacherParams = {}) {
  return useQuery({
    queryKey: teacherKeys.list(params),
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.search) search.set('search', params.search);
      if (params.page) search.set('page', String(params.page));
      if (params.limit) search.set('limit', String(params.limit));
      return apiClient.get<PaginatedResponse<Teacher>>(
        `/api/admin/teachers?${search}`,
      );
    },
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: () => apiClient.get<Teacher>(`/api/admin/teachers/${id}`),
    enabled: !!id,
  });
}

export function useUpdateTeacher(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTeacherPayload) =>
      apiClient.patch<Teacher>(`/api/admin/teachers/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
  });
}

export function useDeactivateTeacher(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/teachers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
  });
}
