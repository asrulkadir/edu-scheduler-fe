export type TResponseSWR<T> = {
  data: T;
  isLoading: boolean;
  error: Error | null;
};