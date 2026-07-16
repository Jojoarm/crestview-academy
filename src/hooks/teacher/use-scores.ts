import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type {
  MarkScoresInput,
  ScoreListItem,
  ScoreListParams,
  UpdateScoreInput,
} from '@/types/teacher/score';

function buildQueryString(params: ScoreListParams) {
  const search = new URLSearchParams();
  search.set('classArmId', params.classArmId);
  if (params.subjectId) search.set('subjectId', params.subjectId);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  return `?${search.toString()}`;
}

export function useScores(params: ScoreListParams) {
  return useQuery({
    queryKey: ['scores', 'list', params],
    queryFn: () =>
      apiClient.get<PaginatedResponse<ScoreListItem>>(
        `/api/teacher/scores${buildQueryString(params)}`,
      ),
    enabled: !!params.classArmId,
    placeholderData: (previousData) => previousData,
  });
}

export function useMarkScores() {
  const queryClient = useQueryClient();
  return useMutation({
    // Returns null — score data isn't handed back, refetch via useScores
    // after this resolves (also matters because score ids aren't stable
    // across a POST for any student included in the batch).
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
