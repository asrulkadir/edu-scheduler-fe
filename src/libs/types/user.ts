import { ERole } from "../utils/enum";

export type TUser = {
  id: string;
  username: string;
  email: string;
  name: string;
  role: ERole.ADMIN | ERole.TEACHER | ERole.STUDENT | ERole.SUPERADMIN | ERole.NONE;
  clientId: string;
};

export type TUpdateUserRequest = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  password?: string;
  username?: string;
};

export type TDeleteUserRequest = {
  id: string;
};

export type TCreateUserRequest = {
  name: string;
  email: string;
  role: string;
  password: string;
  username: string;
  confirmPassword?: string;
};

export type TRegisterUserRequest = {
  name: string;
  email: string;
  password: string;
  username: string;
  clientName: string;
  confirmPassword?: string;
};