import { TNameId } from './common';

export type TDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DAY_LABELS: Record<TDay, string> = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu',
};

export type TSubjectsSchedule = {
  id: string;
  subject: TNameId;
  class: TNameId;
  day: TDay;
  startTime: string | Date;
  endTime: string | Date;
  teacher?: TNameId;
  academicCalendar: TNameId & {
    startTime: string | Date;
    endTime: string | Date;
  };
};

export type TCreateSubjectsScheduleRequest = {
  subjectId: string;
  classId: string;
  day: TDay;
  startTime: string | Date;
  endTime: string | Date;
  academicCalendarId: string;
  takenByTeacher?: string;
};

export type TUpdateSubjectsScheduleRequest = {
  id: string;
  subjectId?: string;
  classId?: string;
  day?: TDay;
  startTime?: string | Date;
  endTime?: string | Date;
  academicCalendarId?: string;
  takenByTeacher?: string;
};
