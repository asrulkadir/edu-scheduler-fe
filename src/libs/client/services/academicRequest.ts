import {
  TCreateAcademicCalendarRequest,
  TUpdateAcademicCalendarRequest,
} from '@/libs/types/academicCalendar';
import { makeRequest } from '../request';

export async function updateAcademicCalendarRequest(
  url: string,
  { arg }: { arg: TUpdateAcademicCalendarRequest },
) {
  return makeRequest(`${url}/${arg.id}`, 'PUT', arg);
}

export async function createAcademicCalendarRequest(
  url: string,
  { arg }: { arg: TCreateAcademicCalendarRequest },
) {
  return makeRequest(url, 'POST', arg);
}

export async function deleteAcademicCalendarRequest(
  url: string,
  { arg }: { arg: { id: string } },
) {
  return makeRequest(`${url}/${arg.id}`, 'DELETE');
}
