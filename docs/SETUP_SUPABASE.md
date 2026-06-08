# Setup Supabase

## 1. Buat project

1. Buka Supabase.
2. Klik **New project**.
3. Isi nama project, region, dan password database.
4. Tunggu project selesai dibuat.

## 2. Jalankan SQL

1. Masuk ke **SQL Editor**.
2. Klik **New query**.
3. Copy semua isi file:

```text
supabase/schema.sql
```

4. Paste ke SQL Editor.
5. Klik **Run**.

## 3. Ambil env Supabase

Masuk ke:

```text
Project Settings > API
```

Ambil:

```env
SUPABASE_URL=Project URL
SUPABASE_SERVICE_ROLE_KEY=service_role key
```

Masukkan ke `.env.local`.

PENTING: `SUPABASE_SERVICE_ROLE_KEY` harus memakai **service_role key**, bukan anon/public/publishable key. Kalau memakai publishable key, admin bisa terkena error RLS saat menyimpan settings atau konten.

`SUPABASE_SERVICE_ROLE_KEY` jangan pernah ditaruh di frontend. Project ini sudah aman karena key hanya dipakai di server API route Next.js.
