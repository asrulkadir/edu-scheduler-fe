import { TNameId } from './common';

export type TClass = {
  id: string;
  name: string;
  description: string;
  homeroomTeacherId: string;
  clientId?: string;
  homeroomTeacher?: TNameId;
  subjects?: TNameId[];
  students?: TNameId[];
  subjectsSchedule?: {
    id: string;
    days: string;
    startTime: string | Date;
    endTime: string | Date;
    subject: TNameId;
  }[];
};

export type TCreateClassRequest = {
  name: string;
  clientId: string;
  description?: string;
  homeroomTeacherId?: string;
  subjects?: string[];
  students?: string[];
  subjectsSchedule?: string[];
};

export type TUpdateClassRequest = {
  id: string;
  clientId?: string;
  description?: string;
  name?: string;
  homeroomTeacherId?: string;
  subjects?: string[];
  students?: string[];
  subjectsSchedule?: string[];
};
