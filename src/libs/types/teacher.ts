import { EGender } from '../utils/enum';
import { TNameId } from './common';

export type TTeacher = {
  id: string;
  name: string;
  gender: EGender.female | EGender.male;
  clientId: string;
  profileImg?: string;
  nip: string;
  phone?: string;
  address?: string;
  subjects: TNameId[];
};

export type TCreateTeacherRequest = {
  name: string;
  gender: EGender.female | EGender.male;
  profileImg?: string;
  nip: string;
  phone?: string;
  address?: string;
  subjects?: TNameId[];
};

export type TUpdateTeacherRequest = {
  id: string;
  name?: string;
  gender?: EGender.female | EGender.male;
  profileImg?: string;
  nip?: string;
  phone?: string;
  address?: string;
  subjects?: TNameId[];
};
