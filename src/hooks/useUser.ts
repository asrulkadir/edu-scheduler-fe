import { TUserResponseSWR } from "@/types/user";
import useSWR, { SWRResponse } from "swr";

export const useCurrentUser = () => {
  const { data, isLoading, error }: SWRResponse<TUserResponseSWR> = useSWR(`/api/users/current`);

  return { currentUser: data?.data, isLoading, error };
};