import {
  TCreateUserRequest,
  TDeleteUserRequest,
  TRegisterUserRequest,
  TUpdateUserRequest,
} from '../../types/user';
import { makeRequest } from '../request';

export async function updateUserRequest(
  url: string,
  { arg }: { arg: TUpdateUserRequest },
) {
  return makeRequest(`${url}/${arg.id}`, 'PUT', arg);
}

export async function createUserRequest(
  url: string,
  { arg }: { arg: TCreateUserRequest },
) {
  return makeRequest(url, 'POST', arg);
}

export async function deleteUserRequest(
  url: string,
  { arg }: { arg: TDeleteUserRequest },
) {
  return makeRequest(`${url}/${arg.id}`, 'DELETE');
}

export async function registerUserRequest(
  url: string,
  { arg }: { arg: TRegisterUserRequest },
) {
  return makeRequest(url, 'POST', arg);
}
