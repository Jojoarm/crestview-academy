import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  ReportCard,
  ReportCardMutationResult,
  ReportCardQueryParams,
  SaveRemarkInput,
} from '@/types/teacher/report-card';

function buildQueryString(params: ReportCardQueryParams) {
  const search = new URLSearchParams();
  if (params.sessionId) search.set('sessionId', params.sessionId);
  if (params.termId) search.set('termId', params.termId);
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

function basePath(classArmId: string, studentId: string) {
  return `/api/teacher/class-arms/${classArmId}/report-cards/${studentId}`;
}

export function useReportCard(
  classArmId: string,
  studentId: string,
  params: ReportCardQueryParams,
) {
  return useQuery({
    queryKey: ['report-card', 'detail', classArmId, studentId, params],
    queryFn: () =>
      apiClient.get<ReportCard>(
        `${basePath(classArmId, studentId)}${buildQueryString(params)}`,
      ),
    // Wait for both to be resolved (sessionId always required; termId is
    // filled in by the caller before this fires in normal use).
    enabled: !!classArmId && !!studentId && !!params.sessionId,
  });
}

export function useSaveRemark(classArmId: string, studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SaveRemarkInput) =>
      apiClient.patch<ReportCardMutationResult>(
        basePath(classArmId, studentId),
        input,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['report-card', 'detail', classArmId, studentId],
      });
    },
  });
}

export function usePublishReportCard(classArmId: string, studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: ReportCardQueryParams) =>
      apiClient.patch<ReportCardMutationResult>(
        `${basePath(classArmId, studentId)}/publish${buildQueryString(params)}`,
        undefined,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['report-card', 'detail', classArmId, studentId],
      });
    },
  });
}

export function useUnpublishReportCard(classArmId: string, studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: ReportCardQueryParams) =>
      apiClient.patch<ReportCardMutationResult>(
        `${basePath(classArmId, studentId)}/unpublish${buildQueryString(params)}`,
        undefined,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['report-card', 'detail', classArmId, studentId],
      });
    },
  });
}
