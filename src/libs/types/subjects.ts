import { TNameId } from './common';

export type TSubjects = {
  id: string;
  name: string;
  clientId: string;
  description: string;
  teacher: TNameId[];
};

export type TCreateSubjectsRequest = {
  name: string;
  clientId: string;
  description: string;
  teacher?: string[];
};

export type TUpdateSubjectsRequest = {
  id: string;
  name?: string;
  clientId?: string;
  description?: string;
  teacher?: string[];
};
