import { TLoginRequest } from '../../types/auth';
import { makeRequest } from '../request';

export async function loginRequest(
  url: string,
  { arg }: { arg: TLoginRequest },
) {
  return makeRequest(url, 'POST', arg);
}

export async function logoutRequest(url: string) {
  return makeRequest(url, 'POST');
}
