import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ClassArmStudent } from '@/types/teacher/attendance';

export function useClassArmStudents(classArmId: string, sessionId?: string) {
  return useQuery({
    queryKey: ['class-arm-students', classArmId, sessionId ?? 'active'],
    queryFn: () =>
      apiClient.get<ClassArmStudent[]>(
        `/api/teacher/class-arms/${classArmId}/students${
          sessionId ? `?sessionId=${sessionId}` : ''
        }`,
      ),
    enabled: !!classArmId,
  });
}
