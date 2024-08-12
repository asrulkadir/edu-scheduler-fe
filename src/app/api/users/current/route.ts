import { forwardRequestToBackend } from "@/libs/forwardRequest";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const sessionCookie = cookies().get('session');
  const authorization = sessionCookie ? `Bearer ${sessionCookie.value}` : '';
  const backendUrl = `${process.env.URL_API}/api/users/current`;
  return forwardRequestToBackend(request, backendUrl,
    {
      'Authorization': authorization,
    }
  );
}