# DECISIONS.md — Untukmu (Untuk Nona)

Setiap entri mencatat keputusan yang sudah dikonfirmasi Alex selama diskusi redesign + migrasi (Agustus 2026). Status semua entri di bawah ini: **Accepted**, kecuali dinyatakan lain.

---

## DEC-001: Arah visual dasar redesign

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Basis visual utama mengikuti PDF (warm ivory, burgundy, dusty rose, sage — editorial-cinematic). Identitas rose/pink dari `design.md` v1 dipertahankan sebagai secondary accent, bukan warna dominan.
- **Context:** `design.md` v1 mendefinisikan identitas soft-pink/rose sebagai jiwa website. PDF blueprint mengusulkan arah yang lebih dewasa dan editorial.
- **Reason:** Alex ingin arah PDF sebagai basis, tapi tidak ingin karakter "Untukmu" yang sudah dibangun sejak awal hilang total.
- **Alternatives considered:** (a) Pindah total ke PDF tanpa sisa identitas lama — ditolak karena menghilangkan karakter project. (b) Tetap di palet v1 sepenuhnya — ditolak karena tidak menjawab tujuan redesign.
- **Trade-offs:** Membutuhkan kehati-hatian ekstra saat implementasi supaya aksen rose tidak "menang" lagi dan mendominasi kembali secara tidak sengaja.
- **Consequences:** DESIGN.md v2 section 9.1 mendefinisikan rose sebagai aksen terbatas, bukan warna CTA utama.

## DEC-002: Glassmorphism bukan design language utama

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Glassmorphism dihindari sebagai gaya utama. Translucency ringan hanya dipakai bila mendukung komposisi spesifik.
- **Context:** v1 mewajibkan glassmorphism di Landing/Countdown/Final. PDF guardrail #08 melarangnya sama sekali.
- **Reason:** Guardrail PDF soal "no visual overload" dinilai lebih sesuai arah editorial-cinematic yang dipilih di DEC-001.
- **Alternatives considered:** Mempertahankan glassmorphism penuh seperti v1 — ditolak karena kontradiksi langsung dengan arah baru.
- **Trade-offs:** Kehilangan satu elemen visual yang sebelumnya jadi ciri khas Landing Page v1; perlu elemen pengganti untuk menjaga kesan "premium sederhana".
- **Consequences:** DESIGN.md v2 section 9.2.

## DEC-003: Sparkle & confetti diminimalkan

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Sparkle bukan dekorasi global. Confetti hanya dipakai secara restrained di final reveal.
- **Context:** v1 memakai sparkle sebagai elemen dekoratif tetap di banyak halaman (`.sparkle` di `globals.css`) dan confetti di Birthday Mode. PDF guardrail melarang sparkle/confetti berlebihan.
- **Reason:** Sejalan dengan DEC-002 — mengurangi visual noise demi fokus pada foto dan tulisan (prinsip "content > decoration" dari PDF).
- **Alternatives considered:** Mempertahankan sparkle persistent seperti v1 — ditolak.
- **Trade-offs:** Tidak ada trade-off signifikan; ini murni pengurangan elemen dekoratif.
- **Consequences:** DESIGN.md v2 section 9.3; kelas `.sparkle` di `globals.css` akan dihapus/diganti saat implementasi visual (dicatat sebagai task, bukan dikerjakan sekarang).

## DEC-004: Navigasi chapter non-linear dengan shortcut

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Pengalaman utama adalah chapter-based storytelling journey, bukan grid menu. Hub/chapter navigation dipertahankan sebagai shortcut. Urutan naratif ada, tapi pengguna tidak dipaksa linear.
- **Context:** v1: Hub Page = grid menu bebas urutan. PDF: chapter journey berurutan dengan chapter menu sebagai shortcut.
- **Reason:** Kompromi yang diminta Alex — pengalaman terasa seperti cerita, tapi tidak mengunci akses pengguna secara paksa.
- **Alternatives considered:** (a) Grid menu murni seperti v1 — ditolak, tidak menjawab tujuan storytelling. (b) Linear terkunci penuh (harus buka chapter 1 dulu) — ditolak eksplisit oleh Alex.
- **Trade-offs:** Kompleksitas routing/UX sedikit lebih tinggi dibanding dua ekstrem di atas, karena harus mendukung baik alur berurutan maupun akses bebas.
- **Consequences:** DESIGN.md v2 section 2 dan 5 (Chapter Drawer).

## DEC-005: Penamaan chapter — teknis vs publik

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Nama teknis (Timeline, Gallery, Letters, Quiz, Plans) tetap dipakai di admin/internal. Public experience memakai judul chapter naratif.
- **Context:** v1 menampilkan nama teknis langsung ke publik. PDF mengusulkan judul emosional.
- **Reason:** Nama teknis memudahkan Alex mengelola konten; judul naratif memperkuat pengalaman bagi Nona. Tidak ada alasan keduanya harus sama.
- **Alternatives considered:** Satu nama dipakai di semua tempat — ditolak karena mengorbankan salah satu kebutuhan (kemudahan admin atau kualitas pengalaman publik).
- **Trade-offs:** Perlu mapping eksplisit yang dijaga konsisten di seluruh kode (lihat DESIGN.md v2 tabel pemetaan chapter) supaya tidak drift antara nama admin dan publik.
- **Consequences:** DESIGN.md v2 section 1.

## DEC-006: Advanced CMS fields ditunda, arsitektur tetap dirancang extensible

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Fitur featured/hero, chapter theme, crop/position tidak jadi prioritas implementasi awal. Schema dirancang agar bisa ditambahkan tanpa refactor besar.
- **Context:** PDF menempatkan CMS/Admin Improvement di Phase 6 (akhir), setelah visual identity dan storytelling utama.
- **Reason:** Mengikuti urutan prioritas PDF sendiri; menghindari over-engineering di awal migrasi yang sudah cukup kompleks.
- **Alternatives considered:** Implementasi penuh di awal — ditolak, menambah risiko dan menunda fitur yang lebih fundamental (visual redesign, migrasi infrastruktur).
- **Trade-offs:** Admin belum bisa mengatur featured photo/crop di fase awal pasca-migrasi; ini diterima sebagai keterbatasan sementara.
- **Consequences:** DATABASE.md section 5 (Migration considerations); TASKS.md Phase 10.

## DEC-007: AudioPlayer — persistent state lintas chapter

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** AudioPlayer dipertahankan, tapi state play/pause harus bertahan saat berpindah chapter/halaman.
- **Context:** PDF menempatkan musik sebagai "Our Song" yang berjalan sepanjang chapter journey, bukan gimmick per-halaman.
- **Reason:** Sejalan dengan pengalaman chapter journey berkelanjutan (DEC-004) — musik yang reset tiap pindah chapter akan merusak kesinambungan cerita.
- **Alternatives considered:** Mempertahankan perilaku reset per halaman seperti kemungkinan sekarang — ditolak, kontradiksi dengan tujuan storytelling.
- **Trade-offs:** Perlu memindahkan AudioPlayer ke level layout yang persisten (root layout grup route publik pasca-unlock), sedikit menambah kompleksitas state management dibanding sebelumnya.
- **Consequences:** DESIGN.md v2 section 5 (Component behavior — AudioPlayer). Implementasi detail (state global vs layout-level) diserahkan ke tahap coding, bukan diputuskan di sini.

## DEC-008: Runtime adapter — OpenNext dipilih atas vinext

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** OpenNext (`@opennextjs/cloudflare`) dipakai sebagai jalur utama menjalankan Next.js di Cloudflare Workers, dengan validation spike wajib di awal migrasi. `vinext` dicatat sebagai opsi evaluasi masa depan.
- **Context:** OpenNext sudah production-grade dan pernah dipakai langsung oleh Alex di project Alumni SYP-33-6 (meski sempat butuh downgrade Next.js dan perubahan middleware). `vinext` baru direkomendasikan resmi oleh Cloudflare per Agustus 2026, jauh lebih baru dan minim rekam jejak publik.
- **Reason:** Stabilitas dan familiaritas lebih penting untuk project dengan deadline keras (10 Desember 2026) dibanding mengejar rekomendasi terbaru yang belum teruji.
- **Alternatives considered:** (a) `vinext` langsung — ditolak, risiko platform imatur terlalu tinggi untuk deadline ini. (b) Tetap di Vercel tanpa migrasi — di luar scope keputusan ini (migrasi sendiri sudah diminta Alex sebagai target arsitektur).
- **Trade-offs:** Berpotensi menghadapi kembali sebagian gap kompatibilitas seperti kasus Alumni, meski Adapter API resmi Next.js sudah stabil sejak Maret 2026 dan kemungkinan sudah menutup sebagian gap tersebut.
- **Consequences:** ARCHITECTURE.md section 4.7; MIGRATION.md Phase 0 (validation spike); TASKS.md TASK-001.

## DEC-009: Image pipeline — original di R2, transformasi on-demand + edge cache

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Simpan hanya file original di R2. Variant (ukuran, format) di-generate on-demand lewat Cloudflare Image Transformations dan di-cache di edge, bukan pre-generate dan simpan sebagai file fisik terpisah. Original tetap dipertahankan penuh untuk backup/reprocessing/download.
- **Context:** Rencana awal Alex membayangkan generate dan menyimpan semua variant (thumbnail/medium/large) sebagai file terpisah di R2.
- **Reason:** Dengan Cloudflare Image Transformations tersedia gratis hingga 5.000 transformasi unik/bulan dan bisa langsung menarik dari R2, pre-generate variant fisik jadi kompleksitas tambahan yang tidak perlu untuk skala project ini (jumlah foto personal, bukan katalog e-commerce).
- **Alternatives considered:** Pre-generate dan simpan semua variant fisik — tidak ditolak karena buruk, tapi dinilai lebih kompleks tanpa manfaat sepadan untuk skala ini; Alex memilih pendekatan on-demand setelah pertimbangan ini disampaikan.
- **Trade-offs:** Bergantung pada ketersediaan layanan Image Transformations saat runtime (mitigasi: fallback serve original langsung jika transform gagal, lihat ARCHITECTURE.md 4.3). Permintaan pertama tiap kombinasi ukuran/format sedikit lebih lambat (cache miss) dibanding variant yang sudah pre-generated.
- **Consequences:** ARCHITECTURE.md section 4.4; DATABASE.md (kolom `media_key` tunggal per item, bukan banyak kolom variant); DESIGN.md v2 section 5 (Image component behavior) — frontend wajib pakai responsive image, lazy loading, ukuran sesuai viewport, tidak pernah kirim original untuk kebutuhan thumbnail.

## DEC-010: Admin auth ditulis ulang ke Web Crypto API

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Signing/verifikasi token sesi admin ditulis ulang memakai Web Crypto API (`crypto.subtle`), menggantikan modul `crypto` Node.js yang dipakai `lib/adminAuth.ts` sekarang.
- **Context:** Modul `crypto` Node.js kemungkinan bisa jalan di Workers lewat Node.js compatibility layer OpenNext, tapi ini bergantung polyfill, bukan native.
- **Reason:** Web Crypto API berjalan native di Workers runtime tanpa polyfill sama sekali, sehingga lebih portable dan mengurangi satu titik gagal yang tidak perlu, terlepas dari adapter mana yang akhirnya dipakai (termasuk kalau suatu saat pindah ke vinext).
- **Alternatives considered:** Mempertahankan modul `crypto` Node dan mengandalkan compatibility layer — tidak ditolak karena kemungkinan besar tetap berfungsi, tapi dinilai berisiko tanpa manfaat, mengingat penulisan ulang ke Web Crypto API tidak mahal secara effort.
- **Trade-offs:** Perlu penulisan ulang kecil pada fungsi `sign()`/`verifyAdminToken()`, tapi pola cookie session (nama cookie, expiry, payload JSON) tidak berubah.
- **Consequences:** ARCHITECTURE.md section 4.6 (Security boundaries); TASKS.md Phase 4.

## DEC-011: Database dipindah ke D1 via Drizzle ORM

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Database dipindah dari Supabase (Postgres) ke Cloudflare D1 (SQLite), dikelola lewat Drizzle ORM.
- **Context:** Ini bagian dari target arsitektur Cloudflare yang diminta Alex secara eksplisit. Alex sudah punya pengalaman langsung melakukan migrasi serupa (Postgres/MySQL → D1 + Drizzle) di project Alumni SYP-33-6.
- **Reason:** Konsisten dengan target runtime Workers (DEC-008); D1 terintegrasi native dengan Workers lewat binding, menghindari koneksi database eksternal lewat HTTP.
- **Alternatives considered:** Mempertahankan Supabase sambil hanya memindah runtime ke Workers (arsitektur hybrid) — tidak dipilih karena Alex secara eksplisit meminta evaluasi migrasi penuh ke D1, bukan arsitektur campuran.
- **Trade-offs:** Perlu penerjemahan skema (enum, `pgcrypto`, timestamp) dan migrasi data dari Postgres ke SQLite — effort nyata, tapi sudah ada preseden pola kerjanya dari project sebelumnya.
- **Consequences:** DATABASE.md seluruh isi dokumen; MIGRATION.md (strategi migrasi data).

## DEC-012: Arah worldbuilding + scrollytelling diadopsi (prinsip, bukan aset)

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Mengintegrasikan prinsip visual/interaksi dari Stardew Valley (handcrafted world, environmental storytelling, tactile imperfection) dan SBS "The Boat" (scroll-driven storytelling, layered parallax, chapter progression) ke DESIGN.md v2, tanpa menyalin artwork, asset, branding, tipografi, atau layout dari keduanya.
- **Context:** Alex memberikan dua reference eksternal secara eksplisit sebagai visual/interaction reference, dengan batasan tegas untuk tidak meniru elemen proprietary.
- **Reason:** Arah redesign sebelumnya (PDF v1, warm editorial) dinilai belum menangkap rasa "dunia kecil" dan "berjalan melewati cerita" yang diinginkan Alex untuk pengalaman Nona.
- **Alternatives considered:** Menambahkan efek scroll dekoratif tanpa sistem scene yang terstruktur — ditolak karena berisiko jadi "fade-in saat masuk viewport" yang eksplisit ingin dihindari Alex.
- **Trade-offs:** Menambah kompleksitas implementasi signifikan dibanding chapter journey sederhana yang sudah disepakati sebelumnya; perlu sistem Scene yang reusable (DEC-013) supaya kompleksitas ini tidak meledak per chapter.
- **Consequences:** DESIGN.md v2 section 10 (Worldbuilding & visual language 2.0), section 15 (Motion principles revisi).

## DEC-013: Scene sebagai reusable component architecture

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Seluruh chapter journey dibangun di atas satu struktur Scene reusable (background/midground/foreground/media/text/animation timeline/audio cue), dikonfigurasi lewat data per chapter, bukan sistem animasi terpisah per chapter.
- **Context:** Alex secara eksplisit meminta agar tidak setiap chapter punya sistem animasi yang sepenuhnya berbeda apabila pola reusable bisa dibuat.
- **Reason:** Mengurangi risiko inkonsistensi visual dan effort implementasi yang membengkak linear terhadap jumlah chapter.
- **Alternatives considered:** Sistem animasi custom per chapter (lebih fleksibel per chapter) — ditolak eksplisit oleh Alex demi konsistensi dan maintainability.
- **Trade-offs:** Variasi antar chapter jadi lebih terbatas pada parameter (bukan sistem berbeda total) — diterima karena tetap cukup untuk membedakan karakter tiap chapter lewat konten dan atmosfer (DEC-012).
- **Consequences:** DESIGN.md v2 section 11 (Scene architecture), section 13 (Chapter experience structure), section 20 (Component architecture).

## DEC-014: Navigasi chapter menjadi indeks unobtrusive (refinement DEC-004)

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Bentuk visual navigasi chapter diperhalus menjadi indeks angka kecil persistent (01–07) di tepi viewport, menggantikan konsep "Chapter Drawer" yang lebih berat secara visual. Prinsip non-linear dengan shortcut dari DEC-004 tidak berubah.
- **Context:** Alex meminta navigasi yang unobtrusive, dengan contoh konsep berupa daftar angka sederhana, selaras arah worldbuilding+scrollytelling yang tidak ingin terasa seperti mengoperasikan dashboard.
- **Reason:** Drawer besar berisiko mengganggu imersi "berjalan melewati sebuah cerita" yang jadi tujuan utama redesign babak kedua ini.
- **Alternatives considered:** Mempertahankan Chapter Drawer sebagai panel besar seperti DEC-004 awal — tidak ditolak sebagai konsep fungsi, tapi bentuk visualnya direvisi supaya lebih ringan.
- **Trade-offs:** Indeks kecil memberi lebih sedikit ruang informasi (misalnya judul chapter penuh) dibanding drawer besar — diterima karena prioritas Alex adalah imersi, bukan kelengkapan informasi navigasi.
- **Consequences:** DESIGN.md v2 section 16 (Navigation revisi).

## DEC-015: Batasan performa eksplisit untuk pengalaman scroll-heavy

- **Date:** 2026-08-31
- **Status:** Accepted
- **Decision:** Menetapkan batas konkret: maksimal 3 layer bergerak aktif per scene, animasi scene di luar viewport tidak berjalan (lazy activation), aset chapter dimuat progresif, audio cue di-preload minimal.
- **Context:** Alex menekankan performa sebagai hal yang sangat penting mengingat target user bisa berada di koneksi/perangkat lemah, dan scrollytelling secara inheren berisiko menambah beban dibanding chapter journey sederhana sebelumnya.
- **Reason:** Tanpa batas eksplisit, sistem Scene reusable (DEC-013) berisiko diimplementasikan dengan terlalu banyak layer/animasi aktif sekaligus di tiap scene, yang justru bertentangan dengan prinsip performa yang sudah ditetapkan sejak arsitektur v1 (image pipeline, DEC-009).
- **Alternatives considered:** Tidak menetapkan batas angka spesifik, hanya prinsip umum "harus ringan" — ditolak karena terlalu ambigu untuk coding agent yang akan mengimplementasikan nanti.
- **Trade-offs:** Batas ini mungkin membatasi kompleksitas visual di scene tertentu yang idealnya ingin lebih kaya — diterima sebagai trade-off sadar demi performa di koneksi buruk.
- **Consequences:** DESIGN.md v2 section 19 (Performance constraints); TASKS.md task Scene component system dan seluruh task redesign chapter (acceptance criteria wajib mengacu ke batas ini).
