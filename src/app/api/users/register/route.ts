import { handleRequest } from "@/libs/server/request";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return handleRequest(request, `/api/users/register`);
}