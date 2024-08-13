import { createUserRequest, deleteUserRequest, registerUserRequest, updateUserRequest } from "@/libs/client/services/userRequests";
import { TResponseSWR } from "@/libs/types/swr";
import { TUser } from "@/libs/types/user";
import useSWR, { SWRResponse } from "swr";
import useSWRMutation from "swr/mutation";

export const useCurrentUser = () => {
  const { data, isLoading, error }: SWRResponse<TResponseSWR<TUser>> = useSWR(`/api/users/current`);

  return { currentUser: data?.data, isLoading, error };
};

export const useUserById = (id: string) => {
  const { data, isLoading, error }: SWRResponse<TResponseSWR<TUser>> = useSWR(`/api/users/${id}`);

  return { userById: data?.data, isLoading, error };
};

export const useUsers = () => {
  const { data, isLoading: loadingUsers, error, mutate }: SWRResponse<TResponseSWR<TUser[]>> = useSWR(`/api/users`);

  return { users: data?.data, loadingUsers, error, mutate };
};

export const useUpdateUser = () => {
  const { trigger: updateUser, error, data, isMutating: loadingUpdateUser } = useSWRMutation(`/api/users`, updateUserRequest);

  return { updateUser, error, data, loadingUpdateUser };
};

export const useCreateUser = () => {
  const { trigger: createUser, error, data, isMutating: loadingCreateUser } = useSWRMutation(`/api/users`, createUserRequest);

  return { createUser, error, data, loadingCreateUser };
};

export const useDeleteUser = () => {
  const { trigger: deleteUser, error, data, isMutating: loadingDeleteUser } = useSWRMutation(`/api/users`, deleteUserRequest);

  return { deleteUser, error, data, loadingDeleteUser };
};

export const useRegisterUser = () => {
  const { trigger: registerUser, error, data, isMutating: loadingRegisterUser } = useSWRMutation(`/api/users/register`, registerUserRequest);

  return { registerUser, error, data, loadingRegisterUser };
};