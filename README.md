# Untuk Nona (UNTUKMU V2) — Untuk 10 Desember

Website hadiah ulang tahun interaktif dan naratif berbasis **Next.js 16 App Router + TypeScript + Tailwind CSS + Cloudflare Workers + D1 + R2 + OpenNext**.

## Fitur Utama

- **Naratif 7 Chapter**: 
  - 01. *Sebuah Awal* (`/timeline` - Timeline vertikal kenangan kronologis)
  - 02. *Momen Kecil* (`/gallery` - Koleksi galeri foto asimetris responsif)
  - 03. *Yang Aku Ingat* (`/letters` - Surat digital editorial)
  - 04. *Yang Tak Terucap* (`/memory-box` - Kartu kenangan interaktif)
  - 05. *Tentang Kamu* (`/quiz` - Mini quiz interaktif dengan skor)
  - 06. *Mungkin Nanti* (`/plans` - Catatan rencana dan wishlist masa depan)
  - 07. *Untuk Hari Ini* (`/final` - Pesan penutup emosional & restrained confetti)
- **Chapter Drawer**: Panel navigasi non-linear yang dapat diakses kapan saja dari seluruh halaman chapter.
- **Persistent Audio**: Musik latar berjalan persisten lintas pergantian halaman dan chapter.
- **Unlock Logic**: Otomatis terbuka pada **10 Desember 2026 00:00 WITA** (`NEXT_PUBLIC_UNLOCK_ISO=2026-12-09T16:00:00.000Z`).
- **Admin CMS (`/admin`)**: Manajemen konten lengkap (tambah, edit, hapus, ganti status `draft`/`active`/`hidden`), upload foto R2, dan preview mode (`?preview=unlocked`).
- **Cloudflare Edge Infrastructure**: Database Cloudflare D1 (SQLite via Drizzle ORM) dan Cloudflare R2 Storage dengan on-demand Cloudflare Image Transformations.

## Cara Menjalankan Lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka:
- Halaman Publik: `http://localhost:3000`
- Panel Admin: `http://localhost:3000/admin`

## Perintah Penting

- `npm run dev`: Menjalankan development server Next.js lokal dengan database SQLite otomatis.
- `npm test`: Menjalankan seluruh 31 automated unit & integration test suites.
- `npm run lint`: Memeriksa format dan linting kode menggunakan ESLint.
- `npm run build`: Membangun production bundle Next.js.
- `npx @opennextjs/cloudflare build`: Meng-compile OpenNext Cloudflare Worker bundle (`.open-next/worker.js`).
- `npm run db:generate`: Menghasilkan SQL migrasi Drizzle untuk Cloudflare D1.
