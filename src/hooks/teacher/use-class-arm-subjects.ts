import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ClassArmSubject } from '@/types/teacher/score';

export function useClassArmSubjects(
  classArmId: string,
  enabled = true,
  sessionId?: string,
) {
  return useQuery({
    queryKey: ['class-arm-subjects', classArmId, sessionId ?? 'active'],
    queryFn: () =>
      apiClient.get<ClassArmSubject[]>(
        `/api/teacher/class-arms/${classArmId}/subjects${
          sessionId ? `?sessionId=${sessionId}` : ''
        }`,
      ),
    enabled: !!classArmId && enabled,
  });
}
