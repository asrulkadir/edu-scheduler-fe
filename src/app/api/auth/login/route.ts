import { forwardRequestToBackend } from "@/libs/forwardRequest";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const backendUrl = `${process.env.URL_API}/api/auth/login`;
  return forwardRequestToBackend(request, backendUrl);
}