type WriteAccessStatus = {
  ok: boolean;
  detail: string;
};

const WRITE_KEY_ERROR =
  'Database admin belum punya izin tulis. Ganti SUPABASE_SERVICE_ROLE_KEY di Vercel dengan service_role/secret key dari Supabase, bukan publishable/anon key.';

export function getSupabaseWriteAccessStatus(): WriteAccessStatus {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!process.env.SUPABASE_URL || !key) {
    return { ok: false, detail: 'SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diisi.' };
  }

  if (key.startsWith('sb_publishable_')) {
    return { ok: false, detail: WRITE_KEY_ERROR };
  }

  if (key.startsWith('sb_secret_')) {
    return { ok: true, detail: 'Key Supabase mendukung admin write.' };
  }

  const jwtRole = getJwtRole(key);
  if (jwtRole === 'anon' || jwtRole === 'authenticated') {
    return { ok: false, detail: WRITE_KEY_ERROR };
  }
  if (jwtRole === 'service_role') {
    return { ok: true, detail: 'Key Supabase mendukung admin write.' };
  }

  return { ok: true, detail: 'Format key tidak dikenali, write akan divalidasi oleh Supabase.' };
}

export function formatSupabaseMutationError(message: string) {
  if (/row-level security|permission denied|violates row-level security/i.test(message)) {
    return WRITE_KEY_ERROR;
  }
  return message;
}

function getJwtRole(key: string) {
  const parts = key.split('.');
  if (parts.length < 2) return null;

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    const json = JSON.parse(Buffer.from(paddedPayload, 'base64').toString('utf8')) as { role?: string };
    return json.role || null;
  } catch {
    return null;
  }
}
