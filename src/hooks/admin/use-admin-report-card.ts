import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  AdminReportCardResponse,
  ReportCardActionResult,
} from '@/types/report-card';

function buildQueryString(params: { sessionId?: string; termId?: string }) {
  const search = new URLSearchParams();
  if (params.sessionId) search.set('sessionId', params.sessionId);
  if (params.termId) search.set('termId', params.termId);
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function useAdminReportCard(
  studentId: string,
  params: { sessionId?: string; termId?: string },
) {
  return useQuery({
    queryKey: ['admin-report-card', 'detail', studentId, params],
    queryFn: () =>
      apiClient.get<AdminReportCardResponse>(
        `/api/admin/report-cards/${studentId}${buildQueryString(params)}`,
      ),
    enabled: !!studentId,
    placeholderData: (previousData) => previousData,
  });
}

export function usePublishReportCard(studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { sessionId?: string; termId?: string }) =>
      apiClient.patch<ReportCardActionResult>(
        `/api/admin/report-cards/${studentId}/publish${buildQueryString(params)}`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-report-card', 'detail', studentId],
      });
    },
  });
}

export function useUnpublishReportCard(studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { sessionId?: string; termId?: string }) =>
      apiClient.patch<ReportCardActionResult>(
        `/api/admin/report-cards/${studentId}/unpublish${buildQueryString(params)}`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-report-card', 'detail', studentId],
      });
    },
  });
}
