import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { TeacherSubjectAssignment } from '@/types/teacher/teacher';

export function useTeacherSubjects() {
  return useQuery({
    queryKey: ['teacher-subjects', 'list'],
    queryFn: () =>
      apiClient.get<TeacherSubjectAssignment[]>('/api/teacher/subjects'),
    staleTime: 5 * 60 * 1000,
  });
}
