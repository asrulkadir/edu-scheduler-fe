import { handleRequest } from '@/libs/server/request';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return handleRequest(request, `/api/class`);
}

export async function POST(request: NextRequest) {
  return handleRequest(request, `/api/class`);
}
