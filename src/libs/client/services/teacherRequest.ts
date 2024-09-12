import {
  TCreateTeacherRequest,
  TUpdateTeacherRequest,
} from '@/libs/types/teacher';
import { makeRequest } from '../request';

export async function updateTeacherRequest(
  url: string,
  { arg }: { arg: TUpdateTeacherRequest },
) {
  return makeRequest(`${url}/${arg.id}`, 'PUT', arg);
}

export async function createTeacherRequest(
  url: string,
  { arg }: { arg: TCreateTeacherRequest },
) {
  return makeRequest(url, 'POST', arg);
}

export async function deleteTeacherRequest(
  url: string,
  { arg }: { arg: { id: string } },
) {
  return makeRequest(`${url}/${arg.id}`, 'DELETE');
}
