import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { TeacherSubjectAssignment } from '@/types/teacher/teacher';

export function useTeacherSubjects(sessionId?: string) {
  return useQuery({
    queryKey: ['teacher-subjects', 'list', sessionId ?? 'active'],
    queryFn: () =>
      apiClient.get<TeacherSubjectAssignment[]>(
        `/api/teacher/subjects${sessionId ? `?sessionId=${sessionId}` : ''}`,
      ),
    staleTime: 5 * 60 * 1000,
  });
}
