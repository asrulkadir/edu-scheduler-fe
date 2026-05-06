import {
  TCreateSubjectsScheduleRequest,
  TUpdateSubjectsScheduleRequest,
} from '@/libs/types/subjectsSchedule';
import { makeRequest } from '../request';

export async function updateSubjectsScheduleRequest(
  url: string,
  { arg }: { arg: TUpdateSubjectsScheduleRequest },
) {
  return makeRequest(`${url}/${arg.id}`, 'PUT', arg);
}

export async function createSubjectsScheduleRequest(
  url: string,
  { arg }: { arg: TCreateSubjectsScheduleRequest },
) {
  return makeRequest(url, 'POST', arg);
}

export async function deleteSubjectsScheduleRequest(
  url: string,
  { arg }: { arg: { id: string } },
) {
  return makeRequest(`${url}/${arg.id}`, 'DELETE');
}
