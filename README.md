# Untuk Nona — Untuk 10 Desember

Website hadiah ulang tahun interaktif berbasis **Next.js App Router + TypeScript + Tailwind CSS + Supabase + Cloudinary**.

## Fitur utama

- Landing romantis dan countdown sampai **10 Desember 2026 00:00 WITA**.
- Timeline, Galeri, Surat, Kotak Kenangan, Quiz, Rencana Kita, dan Final Surprise terkunci sebelum tanggal unlock.
- Admin page di `/admin` untuk tambah/edit/hapus konten.
- Upload foto ke Cloudinary melalui API route server-side.
- Data teks disimpan di Supabase.
- Preview unlocked mode khusus admin: `/?preview=unlocked`.
- Responsive untuk HP, tablet, laptop, dan desktop.

## Cara menjalankan lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka:

```text
http://localhost:3000
http://localhost:3000/admin
```

## File penting

- `.env.example` — contoh environment variables.
- `supabase/schema.sql` — SQL untuk membuat tabel Supabase.
- `docs/SETUP_SUPABASE.md` — panduan Supabase.
- `docs/SETUP_CLOUDINARY.md` — panduan Cloudinary.
- `docs/DEPLOY_VERCEL.md` — panduan deploy Vercel.
- `docs/ADD_MUSIC.md` — panduan tambah musik.

## Catatan unlock date

Nilai unlock disimpan di:

```env
NEXT_PUBLIC_UNLOCK_ISO=2026-12-09T16:00:00.000Z
```

Itu sama dengan **10 Desember 2026 pukul 00:00 WITA**.
