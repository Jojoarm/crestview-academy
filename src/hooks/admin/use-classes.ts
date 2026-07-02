import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type { ClassLevel, Arm, Section } from '@/types/class';

// Query Keys

export const classKeys = {
  all: ['classes'] as const,
  list: (section?: Section | '') => ['classes', 'list', section] as const,
  armList: () => ['arms', 'list'] as const,
};

// Class Queries

export function useClasses(section?: Section | '') {
  return useQuery({
    queryKey: classKeys.list(section),
    queryFn: () => {
      const params = new URLSearchParams();
      if (section) params.set('section', section);
      return apiClient.get<PaginatedResponse<ClassLevel>>(
        `/api/admin/classes?${params}`,
      );
    },
  });
}

// Arm Queries

export function useArms() {
  return useQuery({
    queryKey: classKeys.armList(),
    queryFn: () => apiClient.get<PaginatedResponse<Arm>>('/api/admin/arms'),
  });
}

// Class Mutations

type ClassPayload = {
  name: string;
  section: Section;
  isActive?: boolean;
};

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ClassPayload) =>
      apiClient.post<ClassLevel>('/api/admin/classes', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
    },
  });
}

export function useUpdateClass(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ClassPayload>) =>
      apiClient.patch<ClassLevel>(`/api/admin/classes/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
    },
  });
}

export function useDeleteClass(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/classes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
    },
  });
}

// Class Arm Mutations

export function useAssignArm(classId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { armId: string; capacity: number }) =>
      apiClient.post(`/api/admin/classes/${classId}/arms`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
    },
  });
}

export function useUpdateClassArm(classId: string, armId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { capacity: number }) =>
      apiClient.patch(`/api/admin/classes/${classId}/arms/${armId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
    },
  });
}

export function useRemoveClassArm(classId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (armId: string) =>
      apiClient.delete(`/api/admin/classes/${classId}/arms/${armId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
    },
  });
}

// Arm Mutations

type ArmPayload = { name: string };

export function useCreateArm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ArmPayload) =>
      apiClient.post<Arm>('/api/admin/arms', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.armList() });
    },
  });
}

export function useUpdateArm(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ArmPayload) =>
      apiClient.patch<Arm>(`/api/admin/arms/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.armList() });
    },
  });
}

export function useDeleteArm(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/arms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.armList() });
    },
  });
}
