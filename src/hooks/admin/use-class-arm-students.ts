import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type { ClassArmStudent } from '@/types/class';

function buildQueryString(params: {
  sessionId?: string;
  page?: number;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params.sessionId) search.set('sessionId', params.sessionId);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function useClassArmStudents(
  classArmId: string,
  params: { sessionId?: string; page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ['class-arm-students', 'list', classArmId, params],
    queryFn: () =>
      apiClient.get<PaginatedResponse<ClassArmStudent>>(
        `/api/admin/class-arms/${classArmId}/students${buildQueryString(params)}`,
      ),
    enabled: !!classArmId,
    placeholderData: (previousData) => previousData,
  });
}
