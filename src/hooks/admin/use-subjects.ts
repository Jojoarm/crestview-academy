import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type { Subject } from '@/types/subject';
import type { Section } from '@/types/class';

export const subjectKeys = {
  all: ['subjects'] as const,
  list: (params?: SubjectParams) => ['subjects', 'list', params] as const,
};

type SubjectParams = {
  search?: string;
  section?: Section | '';
  classLevelId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};

export function useSubjects(params: SubjectParams = {}) {
  return useQuery({
    queryKey: subjectKeys.list(params),
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.search) search.set('search', params.search);
      if (params.section) search.set('section', params.section);
      if (params.classLevelId) search.set('classLevelId', params.classLevelId);
      if (params.isActive !== undefined)
        search.set('isActive', String(params.isActive));
      if (params.page) search.set('page', String(params.page));
      if (params.limit) search.set('limit', String(params.limit));
      return apiClient.get<PaginatedResponse<Subject>>(
        `/api/admin/subjects?${search}`,
      );
    },
  });
}

// Subject Mutations

type SubjectPayload = {
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
};

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubjectPayload) =>
      apiClient.post<Subject>('/api/admin/subjects', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useUpdateSubject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SubjectPayload>) =>
      apiClient.patch<Subject>(`/api/admin/subjects/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useDeleteSubject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/subjects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

// Class Assignment Mutations

type AssignPayload = {
  classLevelId: string;
  isCompulsory?: boolean;
};

export function useAssignSubjectToClass(subjectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignPayload) =>
      apiClient.post(`/api/admin/subjects/${subjectId}/classes`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useUpdateSubjectAssignment(
  subjectId: string,
  classLevelId: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { isCompulsory: boolean }) =>
      apiClient.patch(
        `/api/admin/subjects/${subjectId}/classes/${classLevelId}`,
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}

export function useRemoveSubjectAssignment(subjectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classLevelId: string) =>
      apiClient.delete(
        `/api/admin/subjects/${subjectId}/classes/${classLevelId}`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
}
