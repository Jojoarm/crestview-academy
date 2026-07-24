import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ChildFeesResponse } from '@/types/parent/fee';

export function useChildFees(studentId: string) {
  return useQuery({
    queryKey: ['parent-fees', 'detail', studentId],
    queryFn: () =>
      apiClient.get<ChildFeesResponse>(
        `/api/parent/children/${studentId}/fees`,
      ),
    enabled: !!studentId,
  });
}
