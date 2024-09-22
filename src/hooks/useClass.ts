import {
  createClassRequest,
  deleteClassRequest,
  updateClassRequest,
} from '@/libs/client/services/classRequest';
import { TResponseSWR } from '@/libs/types/swr';
import { TClass } from '@/libs/types/class';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';

export const useClass = () => {
  const {
    data,
    isLoading,
    error,
    mutate,
  }: SWRResponse<TResponseSWR<TClass[]>> = useSWR(`/api/class`);

  return {
    classesData: data?.data,
    loadingClass: isLoading,
    error,
    mutateClass: mutate,
  };
};

export const useClassById = (id: string) => {
  const { data, isLoading, error, mutate }: SWRResponse<TResponseSWR<TClass>> =
    useSWR(`/api/class/${id}`);

  return { classData: data?.data, loadingClassById: isLoading, error, mutate };
};

export const useUpdateClass = () => {
  const {
    trigger: updateClass,
    error,
    data,
    isMutating: loadingUpdateClass,
  } = useSWRMutation(`/api/class`, updateClassRequest);

  return { updateClass, error, data, loadingUpdateClass };
};

export const useCreateClass = () => {
  const {
    trigger: createClass,
    error,
    data,
    isMutating: loadingCreateClass,
  } = useSWRMutation(`/api/class`, createClassRequest);

  return { createClass, error, data, loadingCreateClass };
};

export const useDeleteClass = () => {
  const {
    trigger: deleteClass,
    error,
    data,
    isMutating: loadingDeleteClass,
  } = useSWRMutation(`/api/class`, deleteClassRequest);

  return { deleteClass, error, data, loadingDeleteClass };
};
