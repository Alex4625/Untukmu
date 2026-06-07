import { NextResponse } from 'next/server';
import { createAdminToken, setAdminCookie } from '@/lib/adminAuth';

export async function POST(request: Request) {
  const { password } = await request.json();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: 'ADMIN_PASSWORD belum diisi.' }, { status: 500 });
  if (password !== expected) return NextResponse.json({ error: 'Password salah.' }, { status: 401 });
  setAdminCookie(createAdminToken());
  return NextResponse.json({ ok: true });
}
