import { EGender } from '../utils/enum';
import { TNameId } from './common';

export type TStudent = {
  id: string;
  name: string;
  gender: EGender.female | EGender.male;
  clientId: string;
  profileImg?: string;
  nis: string;
  classId: string;
  class: TNameId;
};

export type TCreateStudentRequest = {
  name: string;
  gender: EGender.female | EGender.male;
  nis: string;
  classId: string;
  profileImg?: string;
};

export type TUpdateStudentRequest = {
  id: string;
  name?: string;
  gender?: EGender.female | EGender.male;
  nis?: string;
  classId?: string;
  profileImg?: string;
};
