import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getDb, siteSettings } from '@/lib/db';

type HealthCheck = {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
};

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const checks: HealthCheck[] = [];
  const sessionSecretLength = process.env.ADMIN_SESSION_SECRET?.length ?? 0;
  const unlockTime = Date.parse(process.env.NEXT_PUBLIC_UNLOCK_ISO || '');

  checks.push({
    key: 'admin_password',
    label: 'Admin password',
    ok: Boolean(process.env.ADMIN_PASSWORD),
    detail: process.env.ADMIN_PASSWORD ? 'Siap dipakai' : 'ADMIN_PASSWORD belum diisi'
  });

  checks.push({
    key: 'admin_session_secret',
    label: 'Session secret (Web Crypto)',
    ok: sessionSecretLength >= 32,
    detail: sessionSecretLength >= 32 ? 'Siap dipakai (Web Crypto HMAC)' : 'Minimal 32 karakter'
  });

  checks.push({
    key: 'unlock_date',
    label: 'Tanggal unlock',
    ok: Number.isFinite(unlockTime),
    detail: Number.isFinite(unlockTime) ? 'Format tanggal valid' : 'NEXT_PUBLIC_UNLOCK_ISO tidak valid'
  });

  // Check Database (D1 / SQLite)
  try {
    const db = getDb();
    const result = await db.select().from(siteSettings).limit(1);
    checks.push({
      key: 'database',
      label: 'Database (Cloudflare D1 / SQLite)',
      ok: true,
      detail: result.length > 0 ? 'Koneksi berhasil, data siap' : 'Koneksi berhasil (tabel kosong)'
    });
  } catch (error) {
    checks.push({
      key: 'database',
      label: 'Database (Cloudflare D1 / SQLite)',
      ok: false,
      detail: error instanceof Error ? error.message : 'Koneksi database gagal'
    });
  }

  // Check Media Storage (R2 / Local fallback)
  let r2BindingFound = false;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env?.MEDIA_BUCKET) {
      r2BindingFound = true;
    }
  } catch {
    // Local environment
  }

  checks.push({
    key: 'media_storage',
    label: 'Media Storage (R2 / Image Transformations)',
    ok: true,
    detail: r2BindingFound ? 'Cloudflare R2 binding terpasang' : 'Local file storage siap (dev mode)'
  });

  return NextResponse.json({ ok: checks.every((check) => check.ok), checks });
}
