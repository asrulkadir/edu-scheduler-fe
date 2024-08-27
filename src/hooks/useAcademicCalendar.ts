import {
  createAcademicCalendarRequest,
  deleteAcademicCalendarRequest,
  updateAcademicCalendarRequest,
} from '@/libs/client/services/academicRequest';
import { TAcademicCalendar } from '@/libs/types/academicCalendar';
import { TResponseSWR } from '@/libs/types/swr';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';

export const useCurrentAcademicCalendar = () => {
  const {
    data,
    isLoading,
    error,
    mutate,
  }: SWRResponse<TResponseSWR<TAcademicCalendar>> = useSWR(
    `/api/academic/current`,
  );

  return {
    currentAcademic: data?.data,
    isLoading,
    error,
    mutateCurrentAcademic: mutate,
  };
};

export const useAcademicCalendarById = (id: string) => {
  const {
    data,
    isLoading,
    error,
  }: SWRResponse<TResponseSWR<TAcademicCalendar>> = useSWR(
    `/api/academic/${id}`,
  );

  return { academicCalendarById: data?.data, isLoading, error };
};

export const useAcademicCalendars = () => {
  const {
    data,
    isLoading: loadingAcademicCalendars,
    error,
    mutate,
  }: SWRResponse<TResponseSWR<TAcademicCalendar[]>> = useSWR(`/api/academic`);

  return {
    academicCalendars: data?.data,
    loadingAcademicCalendars,
    error,
    mutate,
  };
};

export const useUpdateAcademicCalendar = () => {
  const {
    trigger: updateAcademicCalendar,
    error,
    data,
    isMutating: loadingUpdateAcademicCalendar,
  } = useSWRMutation(`/api/academic`, updateAcademicCalendarRequest);

  return { updateAcademicCalendar, error, data, loadingUpdateAcademicCalendar };
};

export const useCreateAcademicCalendar = () => {
  const {
    trigger: createAcademicCalendar,
    error,
    data,
    isMutating: loadingCreateAcademicCalendar,
  } = useSWRMutation(`/api/academic`, createAcademicCalendarRequest);

  return { createAcademicCalendar, error, data, loadingCreateAcademicCalendar };
};

export const useDeleteAcademicCalendar = () => {
  const {
    trigger: deleteAcademicCalendar,
    error,
    data,
    isMutating: loadingDeleteAcademicCalendar,
  } = useSWRMutation(`/api/academic`, deleteAcademicCalendarRequest);

  return { deleteAcademicCalendar, error, data, loadingDeleteAcademicCalendar };
};
