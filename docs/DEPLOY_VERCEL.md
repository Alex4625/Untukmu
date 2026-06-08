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

`ADMIN_SESSION_SECRET` wajib diisi minimal 32 karakter. Buat nilai acak yang panjang, beda dari `ADMIN_PASSWORD`.

Contoh generate secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Setelah environment variable ditambah atau diubah di Vercel, lakukan **Redeploy** agar production memakai nilai baru.

## 4. Deploy

Klik **Deploy**.

Setelah selesai:

```text
https://namaproject.vercel.app
https://namaproject.vercel.app/admin
```

## 5. Preview public mode

Login ke `/admin`, lalu klik tombol **Preview Public**.

Preview akan membuka `/hub?preview=unlocked` dan hanya bekerja kalau cookie admin masih aktif. Halaman publik biasa tetap mengikuti tanggal unlock, jadi gunakan tombol ini saat ingin mengecek hadiah sebelum 10 Desember.

Kalau login gagal dengan pesan `ADMIN_SESSION_SECRET wajib diisi minimal 32 karakter`, artinya environment variable tersebut belum benar di Vercel.

## 6. Admin health check dan status konten

Dashboard admin menampilkan health check untuk `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, Supabase, Cloudinary, dan tanggal unlock. Gunakan panel ini setelah deploy untuk memastikan semua konfigurasi siap.

Konten baru otomatis masuk sebagai **Draft**. Ubah menjadi **Published** dari daftar konten kalau sudah siap tampil setelah unlock. Gunakan **Hidden** untuk menyimpan item tanpa menampilkannya ke public.
