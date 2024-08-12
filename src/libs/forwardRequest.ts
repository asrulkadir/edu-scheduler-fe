// lib/apiProxy.ts
import { NextRequest, NextResponse } from "next/server";

export async function forwardRequestToBackend(
  request: NextRequest,
  backendUrl: string,
  customHeaders?: Record<string, string>,
  customBody?: any
): Promise<NextResponse> {
  try {
    // Tentukan apakah metode HTTP memerlukan body
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(request.method || '');

    // Hanya parsing body jika metode HTTP memerlukan body
    const body = hasBody ? (customBody || await request.json()) : undefined;

    const res = await fetch(backendUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
        ...request.headers,
      },
      // Tambahkan body jika ada, atau undefined jika tidak ada body
      body: hasBody ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });
    const headers = res.headers;
    const data = await res.json();

    return new NextResponse(JSON.stringify(data), {
      status: res.status,
      headers: headers,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}