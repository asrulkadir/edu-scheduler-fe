import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const backendUrl = `${process.env.URL_API}/api/auth/logout`;
  return await fetch(backendUrl, {
    method: 'POST',
  });
}