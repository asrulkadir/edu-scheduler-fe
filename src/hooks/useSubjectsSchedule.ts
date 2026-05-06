import {
  createSubjectsScheduleRequest,
  deleteSubjectsScheduleRequest,
  updateSubjectsScheduleRequest,
} from '@/libs/client/services/subjectsScheduleRequest';
import { TResponseSWR } from '@/libs/types/swr';
import { TSubjectsSchedule } from '@/libs/types/subjectsSchedule';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';

export const useSubjectsSchedule = (academicCalendarId?: string) => {
  const key = academicCalendarId
    ? `/api/subjects-schedule?academicCalendarId=${academicCalendarId}`
    : null;

  const {
    data,
    isLoading,
    error,
    mutate,
  }: SWRResponse<TResponseSWR<TSubjectsSchedule[]>> = useSWR(key);

  return {
    subjectsSchedule: data?.data,
    loadingSubjectsSchedule: isLoading,
    error,
    mutateSubjectsSchedule: mutate,
  };
};

export const useSubjectsScheduleById = (id: string) => {
  const {
    data,
    isLoading,
    error,
  }: SWRResponse<TResponseSWR<TSubjectsSchedule>> = useSWR(
    `/api/subjects-schedule/${id}`,
  );

  return {
    subjectsScheduleData: data?.data,
    loadingSubjectsScheduleById: isLoading,
    error,
  };
};

export const useUpdateSubjectsSchedule = () => {
  const {
    trigger: updateSubjectsSchedule,
    error,
    data,
    isMutating: loadingUpdateSubjectsSchedule,
  } = useSWRMutation(`/api/subjects-schedule`, updateSubjectsScheduleRequest);

  return {
    updateSubjectsSchedule,
    error,
    data,
    loadingUpdateSubjectsSchedule,
  };
};

export const useCreateSubjectsSchedule = () => {
  const {
    trigger: createSubjectsSchedule,
    error,
    data,
    isMutating: loadingCreateSubjectsSchedule,
  } = useSWRMutation(`/api/subjects-schedule`, createSubjectsScheduleRequest);

  return {
    createSubjectsSchedule,
    error,
    data,
    loadingCreateSubjectsSchedule,
  };
};

export const useDeleteSubjectsSchedule = () => {
  const {
    trigger: deleteSubjectsSchedule,
    error,
    data,
    isMutating: loadingDeleteSubjectsSchedule,
  } = useSWRMutation(`/api/subjects-schedule`, deleteSubjectsScheduleRequest);

  return {
    deleteSubjectsSchedule,
    error,
    data,
    loadingDeleteSubjectsSchedule,
  };
};
