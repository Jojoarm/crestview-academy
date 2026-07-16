import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type {
  Assignment,
  AssignmentListParams,
  CreateAssignmentInput,
  GradeSubmissionInput,
  Submission,
  UpdateAssignmentInput,
} from '@/types/teacher/assignment';

function buildQueryString(params: AssignmentListParams) {
  const search = new URLSearchParams();
  if (params.classArmId) search.set('classArmId', params.classArmId);
  if (params.subjectId) search.set('subjectId', params.subjectId);
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function useAssignments(params: AssignmentListParams) {
  return useQuery({
    queryKey: ['assignments', 'list', params],
    queryFn: () =>
      apiClient.get<PaginatedResponse<Assignment>>(
        `/api/teacher/assignments${buildQueryString(params)}`,
      ),
    placeholderData: (previousData) => previousData,
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ['assignments', 'detail', id],
    queryFn: () => apiClient.get<Assignment>(`/api/teacher/assignments/${id}`),
    enabled: !!id,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssignmentInput) =>
      apiClient.post<Assignment>('/api/teacher/assignments', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', 'list'] });
    },
  });
}

export function useUpdateAssignment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAssignmentInput) =>
      apiClient.patch<Assignment>(`/api/teacher/assignments/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', 'list'] });
      queryClient.invalidateQueries({
        queryKey: ['assignments', 'detail', id],
      });
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<null>(`/api/teacher/assignments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', 'list'] });
    },
  });
}

export function useAssignmentSubmissions(id: string) {
  return useQuery({
    queryKey: ['assignments', 'submissions', id],
    queryFn: () =>
      apiClient.get<Submission[]>(`/api/teacher/assignments/${id}/submissions`),
    enabled: !!id,
  });
}

export function useGradeSubmission(assignmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      submissionId,
      input,
    }: {
      submissionId: string;
      input: GradeSubmissionInput;
    }) =>
      apiClient.patch<Submission>(
        `/api/teacher/assignments/${assignmentId}/submissions/${submissionId}`,
        input,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['assignments', 'submissions', assignmentId],
      });
    },
  });
}
