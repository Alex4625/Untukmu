import { cookies } from 'next/headers';

const COOKIE_NAME = 'untukmu_admin_session';
const MAX_AGE = 60 * 60 * 24 * 7;
const MAX_AGE_MS = MAX_AGE * 1000;
const MIN_SECRET_LENGTH = 32;

function getSecretKeyString(): string {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < MIN_SECRET_LENGTH) {
    throw new Error(`ADMIN_SESSION_SECRET wajib diisi minimal ${MIN_SECRET_LENGTH} karakter.`);
  }
  return value;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const secret = getSecretKeyString();
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToUint8Array(hex: string): Uint8Array {
  const length = hex.length / 2;
  const arrayBuffer = new ArrayBuffer(length);
  const bytes = new Uint8Array(arrayBuffer);
  for (let i = 0; i < length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function sign(value: string): Promise<string> {
  const key = await getCryptoKey();
  const encoder = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return bufferToHex(signatureBuffer);
}

export async function createAdminToken(): Promise<string> {
  const now = Date.now();
  const payload = JSON.stringify({ role: 'admin', iat: now, exp: now + MAX_AGE_MS });
  const b64 = base64UrlEncode(payload);
  const signature = await sign(b64);
  return `${b64}.${signature}`;
}

export async function verifyAdminToken(token?: string | null): Promise<boolean> {
  if (!token || !token.includes('.')) return false;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;

  try {
    const key = await getCryptoKey();
    const encoder = new TextEncoder();
    const sigBytes = hexToUint8Array(signature);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes.buffer as ArrayBuffer,
      encoder.encode(payload)
    );
    if (!isValid) return false;

    const parsed = JSON.parse(base64UrlDecode(payload));
    return parsed.role === 'admin' && typeof parsed.exp === 'number' && Date.now() < parsed.exp;
  } catch {
    return false;
  }
}

export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

export async function setAdminCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE
  });
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
