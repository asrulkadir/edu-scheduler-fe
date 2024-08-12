export type TUserResponseSWR = {
  data: TUser | null;
  isLoading: boolean;
  error: Error | null;
};

export type TUser = {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  clientId: string;
};