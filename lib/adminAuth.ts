import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'untukmu_admin_session';
const MAX_AGE = 60 * 60 * 24 * 7;
const MAX_AGE_MS = MAX_AGE * 1000;
const MIN_SECRET_LENGTH = 32;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < MIN_SECRET_LENGTH) {
    throw new Error(`ADMIN_SESSION_SECRET wajib diisi minimal ${MIN_SECRET_LENGTH} karakter.`);
  }
  return value;
}

function sign(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export function createAdminToken() {
  const now = Date.now();
  const payload = JSON.stringify({ role: 'admin', iat: now, exp: now + MAX_AGE_MS });
  const b64 = Buffer.from(payload).toString('base64url');
  return `${b64}.${sign(b64)}`;
}

export function verifyAdminToken(token?: string | null) {
  if (!token || !token.includes('.')) return false;
  const [payload, signature, extra] = token.split('.');
  if (extra) return false;
  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }
  if (signature.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return parsed.role === 'admin' && typeof parsed.exp === 'number' && Date.now() < parsed.exp;
  } catch {
    return false;
  }
}

export async function isAdminRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
