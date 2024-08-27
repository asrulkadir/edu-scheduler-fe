// Get the difference between the new data and the previous data
export function getDifferences<T extends Record<string, unknown>>(
  newData: T,
  previousData: T | undefined,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(newData).filter(
      ([key, value]) => previousData && value !== previousData[key as keyof T],
    ),
  ) as Partial<T>;
}
