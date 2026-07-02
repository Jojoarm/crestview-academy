// Query Keys

import { apiClient } from '@/lib/api-client';
import { PaginatedResponse } from '@/lib/types';
import { AcademicSession, Term } from '@/types/session';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const sessionKeys = {
  all: ['sessions'] as const,
  list: () => [...sessionKeys.all, 'list'] as const,
  active: () => [...sessionKeys.all, 'active'] as const,
};

// Queries
export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.list(),
    queryFn: () =>
      apiClient.get<PaginatedResponse<AcademicSession>>('/api/admin/sessions'),
  });
}

export function useActiveSession() {
  return useQuery({
    queryKey: sessionKeys.active(),
    queryFn: () => apiClient.get<AcademicSession>('/api/admin/sessions/active'),
  });
}

// Session Mutations

type SessionPayload = {
  name: string;
  startDate: string;
  endDate: string;
};

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SessionPayload) =>
      apiClient.post<AcademicSession>('/api/admin/sessions', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useUpdateSession(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<SessionPayload>) =>
      apiClient.patch<AcademicSession>(`/api/admin/sessions/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useActivateSession(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.patch<AcademicSession>(`/api/admin/sessions/${id}/activate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useDeleteSession(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/sessions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

// Term Mutations

type CreateTermPayload = {
  name: 'First' | 'Second' | 'Third';
  startDate: string;
  endDate: string;
};

type UpdateTermPayload = Partial<CreateTermPayload>;

export function useCreateTerm(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTermPayload) =>
      apiClient.post<Term>(`/api/admin/sessions/${sessionId}/terms`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useUpdateTerm(sessionId: string, termId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTermPayload) =>
      apiClient.patch<Term>(
        `/api/admin/sessions/${sessionId}/terms/${termId}`,
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useActivateTerm(sessionId: string, termId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.patch<Term>(
        `/api/admin/sessions/${sessionId}/terms/${termId}/activate`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useDeleteTerm(sessionId: string, termId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient.delete(`/api/admin/sessions/${sessionId}/terms/${termId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
