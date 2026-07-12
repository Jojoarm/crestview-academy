import { apiClient } from '@/lib/api-client';
import { PaginatedResponse } from '@/lib/types';
import { Section } from '@/types/class';
import {
  Student,
  StudentEnrollment,
  UpdateStudentPayload,
} from '@/types/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type StudentParams = {
  search?: string;
  classArmId?: string;
  section?: Section | '';
  isActive?: boolean;
  sessionId?: string;
  page?: number;
  limit?: number;
};

export const studentKeys = {
  all: ['students'] as const,
  list: (params?: StudentParams) => ['students', 'list', params] as const,
  detail: (id: string) => ['students', 'detail', id] as const,
  enrollments: (id: string) => ['students', 'enrollments', id] as const,
};

export function useStudents(params: StudentParams = {}) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.search) search.set('search', params.search);
      if (params.classArmId) search.set('classArmId', params.classArmId);
      if (params.section) search.set('section', params.section);
      if (params.isActive !== undefined)
        search.set('isActive', String(params.isActive));
      if (params.sessionId) search.set('sessionId', params.sessionId);
      if (params.page) search.set('page', String(params.page));
      if (params.limit) search.set('limit', String(params.limit));
      return apiClient.get<PaginatedResponse<Student>>(
        `/api/admin/students?${search}`,
      );
    },
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => apiClient.get<Student>(`/api/admin/students/${id}`),
    enabled: !!id,
  });
}

export function useStudentEnrollments(id: string) {
  return useQuery({
    queryKey: studentKeys.enrollments(id),
    queryFn: () =>
      apiClient.get<StudentEnrollment[]>(
        `/api/admin/students/${id}/enrollments`,
      ),
    enabled: !!id,
  });
}

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateStudentPayload) =>
      apiClient.patch<Student>(`/api/admin/students/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useEnrollStudent(studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classArmId: string) =>
      apiClient.post(`/api/admin/students/${studentId}/enroll`, { classArmId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useTransferStudent(studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classArmId: string) =>
      apiClient.patch(`/api/admin/students/${studentId}/enroll`, {
        classArmId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useLinkParent(studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      parentId: string;
      relationship: 'Father' | 'Mother' | 'Guardian';
      isPrimary: boolean;
    }) => apiClient.post(`/api/admin/students/${studentId}/parents`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useUnlinkParent(studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (parentId: string) =>
      apiClient.delete(`/api/admin/students/${studentId}/parents/${parentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useDeactivateStudent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}
