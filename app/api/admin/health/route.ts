import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

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
  const supabaseEnvReady = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const cloudinaryReady = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
  );

  checks.push({
    key: 'admin_password',
    label: 'Admin password',
    ok: Boolean(process.env.ADMIN_PASSWORD),
    detail: process.env.ADMIN_PASSWORD ? 'Siap dipakai' : 'ADMIN_PASSWORD belum diisi'
  });
  checks.push({
    key: 'admin_session_secret',
    label: 'Session secret',
    ok: sessionSecretLength >= 32,
    detail: sessionSecretLength >= 32 ? 'Siap dipakai' : 'Minimal 32 karakter'
  });
  checks.push({
    key: 'unlock_date',
    label: 'Tanggal unlock',
    ok: Number.isFinite(unlockTime),
    detail: Number.isFinite(unlockTime) ? 'Format tanggal valid' : 'NEXT_PUBLIC_UNLOCK_ISO tidak valid'
  });
  checks.push({
    key: 'cloudinary',
    label: 'Cloudinary upload',
    ok: cloudinaryReady,
    detail: cloudinaryReady ? 'Env upload lengkap' : 'Env Cloudinary belum lengkap'
  });

  if (!supabaseEnvReady) {
    checks.push({
      key: 'supabase',
      label: 'Supabase database',
      ok: false,
      detail: 'SUPABASE_URL atau SERVICE_ROLE_KEY belum diisi'
    });
  } else {
    try {
      const { error } = await getSupabaseAdmin().from('site_settings').select('id').limit(1);
      checks.push({
        key: 'supabase',
        label: 'Supabase database',
        ok: !error,
        detail: error ? error.message : 'Koneksi berhasil'
      });
    } catch (error) {
      checks.push({
        key: 'supabase',
        label: 'Supabase database',
        ok: false,
        detail: error instanceof Error ? error.message : 'Koneksi gagal'
      });
    }
  }

  return NextResponse.json({ ok: checks.every((check) => check.ok), checks });
}
