import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PeriodSlot, TimetableByDay } from '@/types/timetable';
import type { Section } from '@/types/class';

export const timetableKeys = {
  all: ['timetable'] as const,
  periodSlots: (section?: Section | '') =>
    ['timetable', 'period-slots', section] as const,
  classArmTimetable: (classArmId: string) =>
    ['timetable', 'class-arm', classArmId] as const,
};

// Period Slot Queries

export function usePeriodSlots(section?: Section | '') {
  return useQuery({
    queryKey: timetableKeys.periodSlots(section),
    queryFn: () => {
      const params = new URLSearchParams();
      if (section) params.set('section', section);
      return apiClient.get<PeriodSlot[]>(`/api/admin/period-slots?${params}`);
    },
  });
}

// Timetable Query

export function useClassArmTimetable(classArmId: string | null) {
  return useQuery({
    queryKey: timetableKeys.classArmTimetable(classArmId ?? ''),
    queryFn: () =>
      apiClient.get<TimetableByDay>(
        `/api/admin/class-arms/${classArmId}/timetable`,
      ),
    enabled: !!classArmId,
  });
}

// Period Slot Mutations

type PeriodSlotPayload = {
  section: Section;
  name: string;
  startTime: string;
  endTime: string;
  order: number;
  isBreak?: boolean;
};

export function useCreatePeriodSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PeriodSlotPayload) =>
      apiClient.post<PeriodSlot>('/api/admin/period-slots', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timetable', 'period-slots'],
      });
    },
  });
}

export function useUpdatePeriodSlot(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PeriodSlotPayload>) =>
      apiClient.patch<PeriodSlot>(`/api/admin/period-slots/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timetable', 'period-slots'],
      });
    },
  });
}

export function useDeletePeriodSlot(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete(`/api/admin/period-slots/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['timetable', 'period-slots'],
      });
    },
  });
}

// Timetable Entry Mutations

export function useCreateTimetableEntry(classArmId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      periodSlotId: string;
      dayOfWeek: string;
      subjectId?: string;
    }) =>
      apiClient.post(`/api/admin/class-arms/${classArmId}/timetable`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: timetableKeys.classArmTimetable(classArmId),
      });
    },
  });
}

export function useUpdateTimetableEntry(classArmId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      entryId,
      subjectId,
    }: {
      entryId: string;
      subjectId: string;
    }) =>
      apiClient.patch(
        `/api/admin/class-arms/${classArmId}/timetable/${entryId}`,
        { subjectId },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: timetableKeys.classArmTimetable(classArmId),
      });
    },
  });
}

export function useDeleteTimetableEntry(classArmId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) =>
      apiClient.delete(
        `/api/admin/class-arms/${classArmId}/timetable/${entryId}`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: timetableKeys.classArmTimetable(classArmId),
      });
    },
  });
}
