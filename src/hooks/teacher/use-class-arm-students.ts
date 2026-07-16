import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ClassArmStudent } from '@/types/teacher/attendance';

export function useClassArmStudents(classArmId: string) {
  return useQuery({
    queryKey: ['class-arm-students', classArmId],
    queryFn: () =>
      apiClient.get<ClassArmStudent[]>(
        `/api/teacher/class-arms/${classArmId}/students`,
      ),
    enabled: !!classArmId,
  });
}
