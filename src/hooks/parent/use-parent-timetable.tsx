import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  ChildTimetableParams,
  ChildTimetableResponse,
} from '@/types/parent/timetable';

function buildQueryString(params: ChildTimetableParams) {
  const search = new URLSearchParams();
  if (params.sessionId) search.set('sessionId', params.sessionId);
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function useChildTimetable(
  studentId: string,
  params: ChildTimetableParams,
) {
  return useQuery({
    queryKey: ['parent-timetable', 'detail', studentId, params],
    queryFn: () =>
      apiClient.get<ChildTimetableResponse>(
        `/api/parent/children/${studentId}/timetable${buildQueryString(params)}`,
      ),
    enabled: !!studentId,
    placeholderData: (previousData) => previousData,
  });
}
