import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  ChildReportCardParams,
  ChildReportCardResponse,
} from '@/types/parent/report-card';

function buildQueryString(params: ChildReportCardParams) {
  const search = new URLSearchParams();
  if (params.sessionId) search.set('sessionId', params.sessionId);
  if (params.termId) search.set('termId', params.termId);
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function useChildReportCard(
  studentId: string,
  params: ChildReportCardParams,
) {
  return useQuery({
    queryKey: ['parent-report-card', 'detail', studentId, params],
    queryFn: () =>
      apiClient.get<ChildReportCardResponse>(
        `/api/parent/children/${studentId}/report-cards${buildQueryString(params)}`,
      ),
    enabled: !!studentId,
    placeholderData: (previousData) => previousData,
  });
}
