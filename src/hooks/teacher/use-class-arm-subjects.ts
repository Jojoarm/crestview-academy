import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ClassArmSubject } from '@/types/teacher/score';

export function useClassArmSubjects(classArmId: string, enabled = true) {
  return useQuery({
    queryKey: ['class-arm-subjects', classArmId],
    queryFn: () =>
      apiClient.get<ClassArmSubject[]>(
        `/api/teacher/class-arms/${classArmId}/subjects`,
      ),
    enabled: !!classArmId && enabled,
  });
}
