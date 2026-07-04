import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/lib/types';
import type {
  FeeType,
  FeeStructure,
  FeeFrequency,
  FeeScope,
  ApplicableFeesResponse,
} from '@/types/fee';

export const feeKeys = {
  all: ['fees'] as const,
  feeTypes: () => ['fees', 'types'] as const,
  feeStructures: (params?: FeeStructureParams) =>
    ['fees', 'structures', params] as const,
  applicableFees: (classLevelId: string) =>
    ['fees', 'applicable', classLevelId] as const,
};

// Fee Type Queries

export function useFeeTypes() {
  return useQuery({
    queryKey: feeKeys.feeTypes(),
    queryFn: () =>
      apiClient.get<PaginatedResponse<FeeType>>('/api/admin/fee-types'),
  });
}

// Fee Structure Queries

type FeeStructureParams = {
  frequency?: FeeFrequency | '';
  scope?: FeeScope | '';
  classLevelId?: string;
  sessionId?: string;
  termId?: string;
  isActive?: boolean;
};

export function useFeeStructures(params: FeeStructureParams = {}) {
  return useQuery({
    queryKey: feeKeys.feeStructures(params),
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.frequency) search.set('frequency', params.frequency);
      if (params.scope) search.set('scope', params.scope);
      if (params.classLevelId) search.set('classLevelId', params.classLevelId);
      if (params.sessionId) search.set('sessionId', params.sessionId);
      if (params.termId) search.set('termId', params.termId);
      if (params.isActive !== undefined)
        search.set('isActive', String(params.isActive));
      return apiClient.get<PaginatedResponse<FeeStructure>>(
        `/api/admin/fee-structures?${search}`,
      );
    },
  });
}

export function useApplicableFees(classLevelId: string | null) {
  return useQuery({
    queryKey: feeKeys.applicableFees(classLevelId ?? ''),
    queryFn: () =>
      apiClient.get<ApplicableFeesResponse>(
        `/api/admin/fee-structures/class/${classLevelId}/applicable`,
      ),
    enabled: !!classLevelId,
  });
}

// Fee Type Mutations

type CreateFeeTypePayload = {
  name: string;
  description?: string;
  frequency: FeeFrequency;
  scope: FeeScope;
  isOptional?: boolean;
};

type UpdateFeeTypePayload = Partial<CreateFeeTypePayload> & {
  isActive?: boolean;
};

export function useCreateFeeType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFeeTypePayload) =>
      apiClient.post<FeeType>('/api/admin/fee-types', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeTypes() });
    },
  });
}

export function useUpdateFeeType(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateFeeTypePayload) =>
      apiClient.patch<FeeType>(`/api/admin/fee-types/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeTypes() });
    },
  });
}

export function useDeleteFeeType(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/fee-types/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.feeTypes() });
    },
  });
}

// Fee Structure Mutations

type CreateFeeStructurePayload = {
  feeTypeId: string;
  amount: number;
  classLevelId?: string;
  sessionId?: string;
  termId?: string;
};

export function useCreateFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFeeStructurePayload) =>
      apiClient.post<FeeStructure>('/api/admin/fee-structures', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.all });
    },
  });
}

export function useUpdateFeeStructure(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) =>
      apiClient.patch<FeeStructure>(`/api/admin/fee-structures/${id}`, {
        amount,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.all });
    },
  });
}

export function useDeleteFeeStructure(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/fee-structures/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feeKeys.all });
    },
  });
}
