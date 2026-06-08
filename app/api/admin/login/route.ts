import { NextResponse } from 'next/server';
import { createAdminToken, setAdminCookie } from '@/lib/adminAuth';
import { getAdminContent } from '@/lib/adminContent';
import crypto from 'crypto';

const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type Attempt = {
  count: number;
  resetAt: number;
  lockedUntil?: number;
};

const attempts = new Map<string, Attempt>();

function clientKey(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || request.headers.get('x-real-ip') || 'unknown';
}

function getAttempt(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    const fresh: Attempt = { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(key, fresh);
    return fresh;
  }
  return current;
}

function recordFailedAttempt(key: string) {
  const attempt = getAttempt(key);
  attempt.count += 1;
  if (attempt.count >= MAX_ATTEMPTS) {
    attempt.lockedUntil = Date.now() + LOCK_MS;
  }
  attempts.set(key, attempt);
}

function clearAttempts(key: string) {
  attempts.delete(key);
}

function timingSafePasswordEquals(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  if (valueBuffer.length !== expectedBuffer.length) {
    crypto.timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }
  return crypto.timingSafeEqual(valueBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const attempt = getAttempt(key);
  const now = Date.now();
  if (attempt.lockedUntil && attempt.lockedUntil > now) {
    const retryAfter = Math.ceil((attempt.lockedUntil - now) / 1000).toString();
    return NextResponse.json(
      { error: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' },
      { status: 429, headers: { 'Retry-After': retryAfter } }
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: 'ADMIN_PASSWORD belum diisi.' }, { status: 500 });
  if (!timingSafePasswordEquals(password, expected)) {
    recordFailedAttempt(key);
    return NextResponse.json({ error: 'Password salah.' }, { status: 401 });
  }
  clearAttempts(key);
  try {
    await setAdminCookie(createAdminToken());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Konfigurasi session admin belum valid.' },
      { status: 500 }
    );
  }
  try {
    return NextResponse.json({ ok: true, content: await getAdminContent() });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      content: null,
      contentError: error instanceof Error ? error.message : 'Konten admin belum bisa dimuat.'
    });
  }
}
