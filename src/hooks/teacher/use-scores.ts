import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  MarkScoresInput,
  ScoreListItem,
  ScoreListParams,
  ScoreListResponse,
  UpdateScoreInput,
} from '@/types/teacher/score';

function buildQueryString(params: ScoreListParams) {
  const search = new URLSearchParams();
  search.set('classArmId', params.classArmId);
  if (params.subjectId) search.set('subjectId', params.subjectId);
  if (params.sessionId) search.set('sessionId', params.sessionId);
  if (params.termId) search.set('termId', params.termId);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return `?${search.toString()}`;
}

export function useScores(params: ScoreListParams) {
  return useQuery({
    queryKey: ['scores', 'list', params],
    queryFn: () =>
      apiClient.get<ScoreListResponse>(
        `/api/teacher/scores${buildQueryString(params)}`,
      ),
    enabled: !!params.classArmId,
    placeholderData: (previousData) => previousData,
  });
}

export function useMarkScores() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MarkScoresInput) =>
      apiClient.post<null>('/api/teacher/scores', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores', 'list'] });
    },
  });
}

export function useUpdateScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateScoreInput }) =>
      apiClient.patch<ScoreListItem>(`/api/teacher/scores/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores', 'list'] });
    },
  });
}
