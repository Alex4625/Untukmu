export const DEFAULT_UNLOCK_ISO = '2026-12-09T16:00:00.000Z'; // 10 Desember 2026 00:00 WITA

export function getUnlockIso() {
  return process.env.NEXT_PUBLIC_UNLOCK_ISO || DEFAULT_UNLOCK_ISO;
}

export function isUnlockedNow() {
  return Date.now() >= new Date(getUnlockIso()).getTime();
}

export function formatDateID(value?: string | null) {
  if (!value) return 'Tanggal belum diisi';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}
