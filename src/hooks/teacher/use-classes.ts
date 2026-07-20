import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { TeacherClassArm } from '@/types/teacher/teacher';

export function useTeacherClasses(sessionId?: string) {
  return useQuery({
    queryKey: ['teacher-classes', 'list', sessionId ?? 'active'],
    queryFn: () =>
      apiClient.get<TeacherClassArm[]>(
        `/api/teacher/classes${sessionId ? `?sessionId=${sessionId}` : ''}`,
      ),
    staleTime: 5 * 60 * 1000,
  });
}
