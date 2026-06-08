import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getAdminContent } from '@/lib/adminContent';

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    return NextResponse.json(await getAdminContent());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Gagal memuat data admin.' }, { status: 500 });
  }
}
