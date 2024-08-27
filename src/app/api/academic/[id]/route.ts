import { handleRequest } from '@/libs/server/request';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return handleRequest(request, `/api/academic/${params.id}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return handleRequest(request, `/api/academic/${params.id}`);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return handleRequest(request, `/api/academic/${params.id}`);
}
