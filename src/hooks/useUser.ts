import useSWR from "swr";

export const useCurrentUser = () => {
  const { data, isLoading, error } = useSWR(`/api/users/current`);

  return { currentUser: data, isLoading, error };
};