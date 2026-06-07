import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'untukmu_admin_session';
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'untukmu-dev-secret';
}

function sign(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export function createAdminToken() {
  const payload = JSON.stringify({ role: 'admin', iat: Date.now() });
  const b64 = Buffer.from(payload).toString('base64url');
  return `${b64}.${sign(b64)}`;
}

export function verifyAdminToken(token?: string | null) {
  if (!token || !token.includes('.')) return false;
  const [payload, signature] = token.split('.');
  const expected = sign(payload);
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function isAdminRequest() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

export function setAdminCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}
