import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ArmTeachers } from '@/types/teacher-assignment';

export const teacherAssignmentKeys = {
  all: ['teacher-assignments'] as const,
  armTeachers: (classArmId: string) =>
    ['teacher-assignments', 'arm', classArmId] as const,
};

export function useArmTeachers(classArmId: string | null) {
  return useQuery({
    queryKey: teacherAssignmentKeys.armTeachers(classArmId ?? ''),
    queryFn: () =>
      apiClient.get<ArmTeachers>(
        `/api/admin/class-arms/${classArmId}/teachers`,
      ),
    enabled: !!classArmId,
  });
}

// Class Teacher Mutations

export function useAssignClassTeacher(classArmId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teacherId: string) =>
      apiClient.post(`/api/admin/class-arms/${classArmId}/teacher`, {
        teacherId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherAssignmentKeys.armTeachers(classArmId),
      });
    },
  });
}

export function useRemoveClassTeacher(classArmId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teacherId: string) =>
      apiClient.delete(`/api/admin/class-arms/${classArmId}/teacher`, {
        body: { teacherId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherAssignmentKeys.armTeachers(classArmId),
      });
    },
  });
}

// Subject Teacher Mutations

export function useAssignSubjectTeacher(classArmId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      subjectId,
      teacherId,
    }: {
      subjectId: string;
      teacherId: string;
    }) =>
      apiClient.post(
        `/api/admin/class-arms/${classArmId}/subjects/${subjectId}/teacher`,
        { teacherId },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherAssignmentKeys.armTeachers(classArmId),
      });
    },
  });
}

export function useRemoveSubjectTeacher(classArmId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      subjectId,
      teacherId,
    }: {
      subjectId: string;
      teacherId: string;
    }) =>
      apiClient.delete(
        `/api/admin/class-arms/${classArmId}/subjects/${subjectId}/teacher`,
        { body: { teacherId } },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teacherAssignmentKeys.armTeachers(classArmId),
      });
    },
  });
}
