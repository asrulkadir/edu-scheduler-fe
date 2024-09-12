import {
  TCreateSubjectsRequest,
  TUpdateSubjectsRequest,
} from '@/libs/types/subjects';
import { makeRequest } from '../request';

export async function updateSubjectsRequest(
  url: string,
  { arg }: { arg: TUpdateSubjectsRequest },
) {
  return makeRequest(`${url}/${arg.id}`, 'PUT', arg);
}

export async function createSubjectsRequest(
  url: string,
  { arg }: { arg: TCreateSubjectsRequest },
) {
  return makeRequest(url, 'POST', arg);
}

export async function deleteSubjectsRequest(
  url: string,
  { arg }: { arg: { id: string } },
) {
  return makeRequest(`${url}/${arg.id}`, 'DELETE');
}
