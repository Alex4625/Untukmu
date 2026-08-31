# MIGRATION.md — Untukmu (Untuk Nona)

Status: SPECIFICATION. Rencana migrasi dari stack sekarang (Vercel + Supabase + Cloudinary) ke target arsitektur (Cloudflare Workers + D1 + R2 + Image Transformations). Belum ada langkah yang dieksekusi — dokumen ini adalah rencana, bukan log migrasi.

Prinsip yang dipegang di seluruh rencana ini: **jangan asumsikan migrasi berhasil sebelum divalidasi**, dan **jangan big-bang** — validasi kompatibilitas dulu di skala kecil sebelum memindahkan seluruh sistem.

---

## 1. Current state

| Aspek | Kondisi sekarang |
|---|---|
| Hosting | Vercel |
| Database | Supabase (Postgres) |
| Media | Cloudinary (storage + transformasi `f_auto,q_auto,w_`) |
| Domain | Terhubung ke Vercel |
| Admin auth | Cookie HMAC via modul `crypto` Node |
| Deployment | GitHub → Vercel (auto-deploy, asumsi berdasarkan `docs/DEPLOY_VERCEL.md`) |
| Next.js version | ^16.2.7 |

## 2. Target state

| Aspek | Kondisi target |
|---|---|
| Hosting | Cloudflare Workers (via OpenNext adapter) |
| Database | Cloudflare D1 (SQLite), diakses via Drizzle ORM |
| Media | Cloudflare R2 (original) + Image Transformations (variant on-demand) |
| Domain | Diarahkan ke Worker |
| Admin auth | Cookie HMAC via Web Crypto API |
| Deployment | GitHub → Cloudflare (Git integration atau GitHub Actions) |

## 3. Migration principles

1. Validasi kompatibilitas platform sebelum menulis migrasi detail lebih lanjut (Phase 0 wajib selesai lebih dulu).
2. Tidak ada downtime yang memengaruhi tanggal unlock 10 Desember 2026 — seluruh migrasi harus selesai dan stabil jauh sebelum tanggal tersebut, dengan buffer waktu untuk testing.
3. Data tidak boleh hilang — setiap tahap migrasi data punya cara verifikasi (row count match, spot-check konten) sebelum sumber lama dianggap boleh ditinggalkan.
4. Redesign visual (lihat DESIGN.md v2) secara teknis independen dari migrasi infrastruktur — keduanya *bisa* dikerjakan paralel di stack lama, tapi rencana ini mengasumsikan migrasi infrastruktur dikerjakan lebih dulu untuk menghindari kerja ganda (styling ulang komponen yang kemudian juga harus diadaptasi ke pola data-fetching baru).
5. Cloudinary dan Supabase tidak dimatikan sampai Cloudflare stack terverifikasi berjalan dengan data asli, bukan cuma data dummy.

## 4. Phased migration plan

### Phase 0 — Validation spike (gating, wajib sebelum lanjut)

Buat branch/project percobaan terpisah (bukan langsung di branch utama) yang men-deploy skeleton Next.js 16.2.7 dengan fitur-fitur yang benar-benar dipakai project ini (Route Handlers, `next/headers` cookies, Server Components async, security headers custom, `next/image` dengan custom loader) ke Cloudflare Workers via OpenNext. Tujuannya murni memverifikasi build & runtime bersih — bukan memindahkan fitur sungguhan.

**Exit criteria:** skeleton berhasil di-deploy dan seluruh fitur di atas terbukti berfungsi tanpa downgrade Next.js atau workaround besar. Jika exit criteria tidak terpenuhi, keputusan OpenNext di DEC-008 perlu dievaluasi ulang sebelum lanjut ke Phase 1.

### Phase 1 — Infrastructure foundation

Setup akun/project Cloudflare, buat D1 database (`untukmu-db`) dan R2 bucket (`untukmu-media`), definisikan binding di konfigurasi Worker, siapkan environment variables/secrets pengganti (`ADMIN_SESSION_SECRET`, dsb — nama env var dipertahankan sama supaya minim perubahan referensi di kode).

### Phase 2 — Data layer migration

Implementasi Drizzle schema sesuai DATABASE.md, jalankan migrasi skema ke D1, tulis ulang `lib/supabaseAdmin.ts` menjadi `lib/db.ts` berbasis binding D1. Migrasi data: export seluruh baris dari Supabase, transform sesuai aturan penerjemahan di DATABASE.md (UUID re-generate, enum ke TEXT+CHECK, timestamp ke ISO string), insert ke D1. Verifikasi row count dan spot-check isi setiap tabel.

### Phase 3 — Media pipeline migration

Tulis ulang route upload admin (`app/api/admin/upload/route.ts`) dari Cloudinary SDK ke R2 (`PutObject` via binding). Backfill: unduh setiap file dari Cloudinary yang masih direferensikan tabel `memories`, unggah ke R2, catat `media_key` baru, update baris terkait. Implementasi custom image loader untuk `next/image` yang mengarah ke Cloudflare Image Transformations (pola URL `/cdn-cgi/image/<params>/<r2-object-path>`). Verifikasi setiap foto lama masih bisa diakses dan ditampilkan dengan benar di stack baru sebelum original Cloudinary dianggap boleh diarsipkan/dihapus.

### Phase 4 — Admin auth rewrite

Tulis ulang `lib/adminAuth.ts` sesuai DEC-010 (Web Crypto API), pertahankan nama cookie, struktur payload, dan durasi sesi yang sama supaya tidak ada perubahan perilaku yang terlihat pengguna admin.

### Phase 5–9 — Visual & experience redesign

Mengikuti DESIGN.md v2 dan urutan fase yang sama dengan roadmap PDF: visual identity (design tokens v2) → experience shell (hero, chapter navigation, transisi) → core storytelling (Timeline, Gallery, Letters) → interactive chapters (Memory Box, Quiz, Plans) → final experience (Countdown, Final Surprise, AudioPlayer persistent, confetti reveal). Detail task granular ada di TASKS.md.

### Phase 10 — Admin refinement

Adaptasi admin CMS ke backend D1/R2 (fungsional dulu, sesuai DEC-006 — advanced fields seperti featured/theme/crop belum di fase ini kecuali dilanjutkan sebagai scope tambahan).

### Phase 11 — Cutover & QA

Arahkan domain dari Vercel ke Worker, jalankan smoke test penuh di production Cloudflare dengan data asli, pantau selama periode tertentu sebelum benar-benar menonaktifkan Vercel/Supabase/Cloudinary. Mobile-first QA, accessibility check (`prefers-reduced-motion`, kontras warna v2), performance check.

---

## 5. Environment & secrets checklist

| Variabel/Resource | Sumber lama | Sumber baru |
|---|---|---|
| Database connection | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | D1 binding (tidak perlu env var URL/key, diakses lewat `env.DB` di Worker) |
| Media storage | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_FOLDER` | R2 binding (`env.MEDIA_BUCKET`), tanpa API key eksternal |
| Admin session | `ADMIN_SESSION_SECRET` | Dipertahankan, dipakai oleh implementasi Web Crypto API yang baru |
| Admin password | `ADMIN_PASSWORD` (asumsi, sesuai README) | Dipertahankan |
| Unlock date | `NEXT_PUBLIC_UNLOCK_ISO` | Dipertahankan, tidak berubah |

## 6. Rollback plan

Selama Phase 0–10, stack lama (Vercel + Supabase + Cloudinary) tetap berjalan tanpa perubahan — tidak ada risiko terhadap production yang sedang dipakai Alex untuk mengisi konten. Rollback selama fase ini secara praktis berarti "tidak lanjut", bukan "kembalikan sesuatu yang sudah dipindah".

Setelah cutover (Phase 11) dilakukan, rollback berarti mengarahkan kembali domain ke Vercel. Ini hanya aman dilakukan **sebelum** Cloudinary/Supabase dinonaktifkan — karena itu, penonaktifan sumber lama harus jadi keputusan sadar terpisah, diambil setelah periode observasi cutover berjalan baik (bukan otomatis begitu cutover selesai).

## 7. Risk register

| Risiko | Dampak | Status mitigasi |
|---|---|---|
| Next.js 16.2.7 tidak kompatibel penuh dengan OpenNext | Tinggi — bisa memblokir seluruh migrasi | Ditangani di Phase 0 (gating) |
| Kehilangan data saat migrasi Supabase → D1 | Tinggi tapi terkontrol | Verifikasi row count + spot-check tiap tabel sebelum sumber lama diarsipkan |
| Foto lama gagal dipindah/rusak saat backfill ke R2 | Sedang | Verifikasi tampilan tiap foto pasca-backfill sebelum Cloudinary diarsipkan |
| Modul `crypto` Node vs Web Crypto API — celah perilaku signing yang tidak terduga | Rendah (sudah diputuskan ditulis ulang, DEC-010) | Ditangani di Phase 4 |
| Biaya melebihi free tier jika traffic/jumlah foto jauh lebih besar dari estimasi | Rendah untuk skala project ini | Dipantau lewat dashboard Cloudflare pasca-cutover, bukan diasumsikan aman selamanya |
