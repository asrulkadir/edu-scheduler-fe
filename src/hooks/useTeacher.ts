import {
  createTeacherRequest,
  deleteTeacherRequest,
  updateTeacherRequest,
} from '@/libs/client/services/teacherRequest';
import { TResponseSWR } from '@/libs/types/swr';
import { TTeacher } from '@/libs/types/teacher';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';

export const useTeacher = () => {
  const {
    data,
    isLoading,
    error,
    mutate,
  }: SWRResponse<TResponseSWR<TTeacher[]>> = useSWR(`/api/teacher`);

  return {
    teachers: data?.data,
    loadingTeachers: isLoading,
    error,
    mutateTeachers: mutate,
  };
};

export const useTeacherById = (id: string) => {
  const { data, isLoading, error }: SWRResponse<TResponseSWR<TTeacher>> =
    useSWR(`/api/teacher/${id}`);

  return { teacher: data?.data, loadingTeacherById: isLoading, error };
};

export const useUpdateTeacher = () => {
  const {
    trigger: updateTeacher,
    error,
    data,
    isMutating: loadingUpdateTeacher,
  } = useSWRMutation(`/api/teacher`, updateTeacherRequest);

  return { updateTeacher, error, data, loadingUpdateTeacher };
};

export const useCreateTeacher = () => {
  const {
    trigger: createTeacher,
    error,
    data,
    isMutating: loadingCreateTeacher,
  } = useSWRMutation(`/api/teacher`, createTeacherRequest);

  return { createTeacher, error, data, loadingCreateTeacher };
};

export const useDeleteTeacher = () => {
  const {
    trigger: deleteTeacher,
    error,
    data,
    isMutating: loadingDeleteTeacher,
  } = useSWRMutation(`/api/teacher`, deleteTeacherRequest);

  return { deleteTeacher, error, data, loadingDeleteTeacher };
};
