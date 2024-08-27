import { Dayjs } from 'dayjs';

export type TAcademicCalendar = {
  id: string;
  name: string;
  startTime: string | Date | Dayjs;
  endTime: string | Date | Dayjs;
  clientId: string;
};

export type TCreateAcademicCalendarRequest = {
  name: string;
  startTime?: string | Date | Dayjs;
  endTime?: string | Date | Dayjs;
  range?: [string | Date | Dayjs, string | Date | Dayjs];
};

export type TUpdateAcademicCalendarRequest = {
  id: string;
  name?: string;
  startTime?: string | Date | Dayjs;
  endTime?: string | Date | Dayjs;
  clientId?: string;
};
