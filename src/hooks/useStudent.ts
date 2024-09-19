import {
  createStudentRequest,
  deleteStudentRequest,
  updateStudentRequest,
} from '@/libs/client/services/studentRequest';
import { TStudent } from '@/libs/types/student';
import { TResponseSWR } from '@/libs/types/swr';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';

export const useStudents = () => {
  const {
    data,
    isLoading,
    error,
    mutate,
  }: SWRResponse<TResponseSWR<TStudent[]>> = useSWR(`/api/student`);

  return {
    students: data?.data,
    loadingStudents: isLoading,
    error,
    mutateStudents: mutate,
  };
};

export const useStudentById = (id: string) => {
  const { data, isLoading, error }: SWRResponse<TResponseSWR<TStudent>> =
    useSWR(`/api/student/${id}`);

  return { student: data?.data, loadingStudentById: isLoading, error };
};

export const useUpdateStudent = () => {
  const {
    trigger: updateStudent,
    error,
    data,
    isMutating: loadingUpdateStudent,
  } = useSWRMutation(`/api/student`, updateStudentRequest);

  return { updateStudent, error, data, loadingUpdateStudent };
};

export const useCreateStudent = () => {
  const {
    trigger: createStudent,
    error,
    data,
    isMutating: loadingCreateStudent,
  } = useSWRMutation(`/api/student`, createStudentRequest);

  return { createStudent, error, data, loadingCreateStudent };
};

export const useDeleteStudent = () => {
  const {
    trigger: deleteStudent,
    error,
    data,
    isMutating: loadingDeleteStudent,
  } = useSWRMutation(`/api/student`, deleteStudentRequest);

  return { deleteStudent, error, data, loadingDeleteStudent };
};
