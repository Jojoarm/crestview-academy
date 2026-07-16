import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { TeacherClassArm } from '@/types/teacher/teacher';

export function useTeacherClasses() {
  return useQuery({
    queryKey: ['teacher-classes', 'list'],
    queryFn: () => apiClient.get<TeacherClassArm[]>('/api/teacher/classes'),
    staleTime: 5 * 60 * 1000,
  });
}
