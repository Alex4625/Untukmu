import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getPublicContent } from '@/lib/publicContent';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const preview = url.searchParams.get('preview') === 'unlocked' && isAdminRequest();
  const content = await getPublicContent(preview);
  return NextResponse.json(content);
}
