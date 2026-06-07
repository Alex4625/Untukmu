# Deploy ke Vercel

## 1. Push ke GitHub

Buat repo GitHub baru, lalu upload project ini.

## 2. Import ke Vercel

1. Buka Vercel.
2. Klik **Add New Project**.
3. Pilih repo project.
4. Framework akan terdeteksi sebagai Next.js.
5. Tambahkan Environment Variables.

## 3. Environment variables di Vercel

Isi semua variable berikut:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_FOLDER=untukmu
NEXT_PUBLIC_SITE_TITLE=Untuk Nona
NEXT_PUBLIC_SITE_SUBTITLE=Untuk 10 Desember
NEXT_PUBLIC_UNLOCK_ISO=2026-12-09T16:00:00.000Z
```

## 4. Deploy

Klik **Deploy**.

Setelah selesai:

```text
https://namaproject.vercel.app
https://namaproject.vercel.app/admin
```

## 5. Preview unlocked mode

Login ke `/admin`, lalu klik tombol **Preview Unlocked**.

Preview ini hanya bekerja kalau cookie admin masih aktif.
