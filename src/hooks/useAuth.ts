// hooks/useAuth.js
import useSWRMutation from 'swr/mutation';
import { fetcher } from '@/libs/fetcher';

type LoginRequest = {
  username: string;
  password: string;
};

async function loginRequest(url: string, { arg }: { arg: LoginRequest }) {
  return fetcher(url, {
    method: 'POST',
    body: arg,
  });
}

async function logoutRequest(url: string) {
  return fetcher(url, {
    method: 'POST',
  });
}


export function useLogin() {
  const { trigger: login, isMutating, error, data } = useSWRMutation(`/api/auth/login`, loginRequest);

  return {
    login,
    isMutating,
    error,
    data,
  };
}

export function useLogout() {
  const { trigger: logout, isMutating, error, data } = useSWRMutation(`/api/auth/logout`, logoutRequest);

  return {
    logout,
    isMutating,
    error,
    data,
  };
}