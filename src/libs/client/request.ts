import { fetcher } from "./fetcher";

export async function makeRequest<T>(url: string, method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | undefined, body?: T) {
  return fetcher(url, {
    method,
    body,
  });
}