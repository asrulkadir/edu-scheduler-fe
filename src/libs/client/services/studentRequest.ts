import {
  TCreateStudentRequest,
  TUpdateStudentRequest,
} from '@/libs/types/student';
import { makeRequest } from '../request';

export async function updateStudentRequest(
  url: string,
  { arg }: { arg: TUpdateStudentRequest },
) {
  return makeRequest(`${url}/${arg.id}`, 'PUT', arg);
}

export async function createStudentRequest(
  url: string,
  { arg }: { arg: TCreateStudentRequest },
) {
  return makeRequest(url, 'POST', arg);
}

export async function deleteStudentRequest(
  url: string,
  { arg }: { arg: { id: string } },
) {
  return makeRequest(`${url}/${arg.id}`, 'DELETE');
}
