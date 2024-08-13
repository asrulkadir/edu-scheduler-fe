import { cookies } from "next/headers";
import { forwardRequestToBackend } from "./forwardRequest";
import { NextRequest } from "next/server";

export function getAuthorizationHeader() {
  const sessionCookie = cookies().get('session');
  return sessionCookie ? `Bearer ${sessionCookie.value}` : '';
}

export function getBackendUrl(path: string) {
  return `${process.env.URL_API}${path}`;
}

export async function handleRequest(request: NextRequest, path: string) {
  const authorization = getAuthorizationHeader();
  const backendUrl = getBackendUrl(path);
  return forwardRequestToBackend(request, backendUrl, {
    'Authorization': authorization,
  });
}