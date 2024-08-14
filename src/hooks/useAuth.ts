import {
  loginRequest,
  logoutRequest,
} from '@/libs/client/services/authRequests';
import useSWRMutation from 'swr/mutation';

export function useLogin() {
  const {
    trigger: login,
    isMutating,
    error,
    data,
  } = useSWRMutation(`/api/auth/login`, loginRequest);

  return {
    login,
    isMutating,
    error,
    data,
  };
}

export function useLogout() {
  const {
    trigger: logout,
    isMutating,
    error,
    data,
  } = useSWRMutation(`/api/auth/logout`, logoutRequest);

  return {
    logout,
    isMutating,
    error,
    data,
  };
}
