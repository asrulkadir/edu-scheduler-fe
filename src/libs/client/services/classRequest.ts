import { TCreateClassRequest, TUpdateClassRequest } from '@/libs/types/class';
import { makeRequest } from '../request';

export async function updateClassRequest(
  url: string,
  { arg }: { arg: TUpdateClassRequest },
) {
  return makeRequest(`${url}/${arg.id}`, 'PUT', arg);
}

export async function createClassRequest(
  url: string,
  { arg }: { arg: TCreateClassRequest },
) {
  return makeRequest(url, 'POST', arg);
}

export async function deleteClassRequest(
  url: string,
  { arg }: { arg: { id: string } },
) {
  return makeRequest(`${url}/${arg.id}`, 'DELETE');
}
