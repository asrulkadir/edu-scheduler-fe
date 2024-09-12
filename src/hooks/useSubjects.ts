import {
  createSubjectsRequest,
  deleteSubjectsRequest,
  updateSubjectsRequest,
} from '@/libs/client/services/subjectsRequest';
import { TResponseSWR } from '@/libs/types/swr';
import { TSubjects } from '@/libs/types/subjects';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';

export const useSubjects = () => {
  const {
    data,
    isLoading,
    error,
    mutate,
  }: SWRResponse<TResponseSWR<TSubjects[]>> = useSWR(`/api/subjects`);

  return {
    subjects: data?.data,
    loadingSubjectss: isLoading,
    error,
    mutateSubjectss: mutate,
  };
};

export const useSubjectsById = (id: string) => {
  const { data, isLoading, error }: SWRResponse<TResponseSWR<TSubjects>> =
    useSWR(`/api/subjects/${id}`);

  return { subjects: data?.data, loadingSubjectsById: isLoading, error };
};

export const useUpdateSubjects = () => {
  const {
    trigger: updateSubjects,
    error,
    data,
    isMutating: loadingUpdateSubjects,
  } = useSWRMutation(`/api/subjects`, updateSubjectsRequest);

  return { updateSubjects, error, data, loadingUpdateSubjects };
};

export const useCreateSubjects = () => {
  const {
    trigger: createSubjects,
    error,
    data,
    isMutating: loadingCreateSubjects,
  } = useSWRMutation(`/api/subjects`, createSubjectsRequest);

  return { createSubjects, error, data, loadingCreateSubjects };
};

export const useDeleteSubjects = () => {
  const {
    trigger: deleteSubjects,
    error,
    data,
    isMutating: loadingDeleteSubjects,
  } = useSWRMutation(`/api/subjects`, deleteSubjectsRequest);

  return { deleteSubjects, error, data, loadingDeleteSubjects };
};
