# 🌸 design.md — Untuk Nona
> Dokumen Desain UI/UX Lengkap untuk Website Hadiah Ulang Tahun Digital

**Nama Project:** Untukmu  
**Nama Website:** Untuk Nona  
**Stack:** Next.js App Router · TypeScript · Tailwind CSS · Supabase · Cloudinary · Vercel  
**Tanggal Unlock:** 10 Desember 2026, 00:00 WITA (`2026-12-09T16:00:00.000Z` UTC)  
**Dibuat oleh:** Alex (untuk Nona)

---

## Daftar Isi

1. [Filosofi Desain](#1-filosofi-desain)
2. [Target Pengguna](#2-target-pengguna)
3. [User Flow](#3-user-flow)
4. [Sistem Navigasi & Routing](#4-sistem-navigasi--routing)
5. [Design System](#5-design-system)
6. [Rancangan Per Halaman — Public](#6-rancangan-per-halaman--public)
7. [Rancangan Per Halaman — Admin](#7-rancangan-per-halaman--admin)
8. [Sistem Lock / Unlock](#8-sistem-lock--unlock)
9. [Komponen UI Reusable](#9-komponen-ui-reusable)
10. [Animasi & Micro-interaction](#10-animasi--micro-interaction)
11. [Responsivitas](#11-responsivitas)
12. [Aksesibilitas](#12-aksesibilitas)
13. [State & Feedback](#13-state--feedback)
14. [Prompt untuk AI Design Builder](#14-prompt-untuk-ai-design-builder)
15. [Prioritas Implementasi](#15-prioritas-implementasi)

---

## 1. Filosofi Desain

### Jiwa Website
Website ini bukan sekadar landing page. Ini adalah **hadiah digital yang dibuat dengan tangan** — seperti scrapbook kertas yang didesain ulang dalam bentuk web. Setiap elemen visual harus terasa **dipilih dengan sadar**, bukan template jadi.

### Tiga Kata Kunci Desain
| Kata | Artinya dalam Praktik |
|---|---|
| **Lembut** | Tidak ada warna keras, tidak ada sudut tajam, tidak ada transisi kasar |
| **Personal** | Terasa seperti dibuat *oleh seseorang*, bukan oleh mesin |
| **Premium Sederhana** | Clean, breathing, tidak ramai — tapi terasa mahal secara emosional |

### Anti-Pattern (yang HARUS dihindari)
- ❌ Warna mencolok / neon
- ❌ Drop shadow gelap dan tebal
- ❌ Font display berlebihan
- ❌ Border radius terlalu kecil (terasa kaku)
- ❌ Animasi cepat dan agresif
- ❌ Banyak teks dalam satu layar
- ❌ CTA lebih dari satu per section

---

## 2. Target Pengguna

### Pengguna Utama (Nona)
- **Usia:** Remaja akhir / dewasa awal (perkiraan seusia Alex)
- **Device:** Smartphone Android/iOS — **mobile-first wajib**
- **Konteks penggunaan:** Membuka website sebagai kejutan di hari ulang tahunnya
- **Literasi digital:** Menengah — nyaman dengan smartphone, tidak perlu panduan
- **Ekspektasi emosional:** Merasa istimewa, tersenyum, mungkin terharu
- **Pain point:** Konten yang terlalu padat atau membingungkan akan merusak momen

### Pengguna Sekunder (Admin = Alex)
- **Device:** Laptop/desktop (untuk input konten di admin panel)
- **Konteks:** Mengisi konten sebelum tanggal 10 Desember 2026
- **Kebutuhan:** CRUD mudah, tidak perlu banyak klik, form yang efisien

---

## 3. User Flow

### Flow A — Sebelum 10 Desember 2026 (Nona membuka website)
```
Buka URL
  └─→ Landing Page
        └─→ Klik "Masuk ke Cerita Kita"
              └─→ Countdown Page
                    ├─→ (Coba akses /timeline, /gallery, dll) → Locked Page → Kembali ke Countdown
                    └─→ Scroll / tunggu hari H
```

### Flow B — Tepat 10 Desember 2026, 00:00 WITA (Unlock Otomatis)
```
Countdown Page → Birthday Mode Trigger (client-side check)
  └─→ Konfeti + animasi muncul
        └─→ Klik "Buka Hadiahnya"
              └─→ Hub Page (menu semua section)
                    ├─→ /timeline
                    ├─→ /gallery
                    ├─→ /letters
                    ├─→ /memory-box
                    ├─→ /quiz
                    ├─→ /plans
                    └─→ /final (terakhir dikunjungi)
```

### Flow C — Admin (Alex kapan saja)
```
/admin
  └─→ Login Page (input password)
        └─→ Admin Dashboard
              ├─→ Kelola Memories (Timeline + Gallery)
              ├─→ Kelola Letters
              ├─→ Kelola Memory Cards
              ├─→ Kelola Quiz
              ├─→ Kelola Plans
              └─→ Preview Mode (lihat tampilan public)
```

---

## 4. Sistem Navigasi & Routing

### Route Map
| Path | Nama Halaman | Status Awal | Keterangan |
|---|---|---|---|
| `/` | Landing Page | ✅ Publik | Entry point utama |
| `/countdown` | Countdown | ✅ Publik | Auto-redirect dari `/` jika sudah pernah masuk |
| `/locked` | Locked Notice | ✅ Publik | Redirect saat akses halaman terkunci |
| `/hub` | Hub / Menu Utama | 🔒 Unlock 10 Des | Pusat navigasi setelah unlock |
| `/timeline` | Timeline | 🔒 Unlock 10 Des | Kenangan kronologis |
| `/gallery` | Gallery | 🔒 Unlock 10 Des | Grid foto |
| `/letters` | Letters | 🔒 Unlock 10 Des | Surat digital |
| `/memory-box` | Memory Box | 🔒 Unlock 10 Des | Kartu interaktif |
| `/quiz` | Quiz | 🔒 Unlock 10 Des | Mini quiz |
| `/plans` | Rencana Kita | 🔒 Unlock 10 Des | Wishlist bersama |
| `/final` | Final Surprise | 🔒 Unlock 10 Des | Penutup emosional |
| `/admin` | Admin Login | ✅ Admin | Password protected |
| `/admin/dashboard` | Admin Dashboard | ✅ Admin | Overview konten |
| `/admin/memories` | Admin Memories | ✅ Admin | CRUD kenangan |
| `/admin/letters` | Admin Letters | ✅ Admin | CRUD surat |
| `/admin/cards` | Admin Cards | ✅ Admin | CRUD memory card |
| `/admin/quiz` | Admin Quiz | ✅ Admin | CRUD pertanyaan quiz |
| `/admin/plans` | Admin Plans | ✅ Admin | CRUD rencana |

### Navigasi Public (Setelah Unlock)
- **Tidak ada navbar permanen** — setiap halaman punya back button subtle di kiri atas
- **Hub Page** jadi pusat navigasi (seperti home menu)
- **Progress indicator** di hub: tampilkan berapa section sudah dibuka
- **No hamburger menu** — navigasi kontekstual per halaman

### Navigasi Admin
- **Sidebar** di desktop (240px lebar)
- **Bottom sheet / drawer** di mobile
- Logo "Untuk Nona — Admin" di atas sidebar

---

## 5. Design System

### 5.1 Color Palette

```css
/* === BASE COLORS === */
--background:   #FFF7F3;   /* Latar utama — krem hangat */
--cream:        #FFF1E6;   /* Latar section / card alt */
--soft-pink:    #F5B7C6;   /* Aksen lembut, badge, divider */
--rose:         #E98DA3;   /* Primary CTA, tombol utama */
--rose-dark:    #D4718A;   /* Hover state tombol rose */
--rose-gold:    #C48A6A;   /* Tanggal, label, detail premium */
--maroon:       #6D3B47;   /* Heading utama, teks berat */
--text:         #3B2F2F;   /* Body text */
--muted:        #8B6F6F;   /* Teks sekunder, placeholder, caption */
--card:         #FFFFFF;   /* Surface kartu */
--border:       rgba(196, 138, 106, 0.22); /* Border halus */

/* === SEMANTIC COLORS === */
--success:      #7DAF8C;   /* Hijau sage — rencana tercapai */
--warning:      #E4B96A;   /* Amber — sedang direncanakan */
--error:        #D97070;   /* Merah lembut — form error */
--info:         #7EADC7;   /* Biru lembut — informasi */

/* === LOCKED / UNLOCK STATE === */
--locked-overlay: rgba(255, 247, 243, 0.85); /* Overlay locked page */
--confetti-1:   #F5B7C6;
--confetti-2:   #C48A6A;
--confetti-3:   #E98DA3;
--confetti-4:   #FFF1E6;
--confetti-5:   #6D3B47;
```

**Aturan Penggunaan Warna:**
- Background halaman: selalu `--background` atau `--cream`
- Tombol primary: `--rose`, hover `--rose-dark`
- Heading: `--maroon`
- Body teks: `--text`
- Label/caption/tanggal: `--muted` atau `--rose-gold`
- Border: `--border`
- Jangan gunakan warna luar palette kecuali untuk semantic colors

---

### 5.2 Typography

**Font Family:**
```css
font-family: 'Cormorant Garamond', 'Lora', Georgia, serif;  /* Untuk heading emosional */
font-family: 'DM Sans', 'Inter', sans-serif;                 /* Untuk body, UI, admin */
```

**Import (Google Fonts):**
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```

**Typography Scale:**

| Token | Font | Size | Weight | Line Height | Digunakan untuk |
|---|---|---|---|---|---|
| `display` | Cormorant | 48–64px | 300 | 1.1 | Judul besar (landing, final) |
| `h1` | Cormorant | 36–40px | 400 | 1.2 | Judul halaman |
| `h2` | Cormorant | 28–32px | 400 | 1.3 | Section heading |
| `h3` | DM Sans | 20–22px | 600 | 1.4 | Card title, admin heading |
| `body-lg` | DM Sans | 17–18px | 400 | 1.7 | Isi surat, teks panjang |
| `body` | DM Sans | 15–16px | 400 | 1.6 | Konten umum |
| `body-sm` | DM Sans | 13–14px | 400 | 1.5 | Caption, label form |
| `label` | DM Sans | 11–12px | 500 | 1.4 | Badge, kategori, uppercase label |
| `countdown-num` | Cormorant | 56–72px | 300 | 1.0 | Angka countdown |

**Aturan Typography:**
- Heading emosional → Cormorant Garamond (atau Lora sebagai fallback)
- Semua teks UI (tombol, form, admin) → DM Sans
- Maksimal 2 font di satu halaman
- Italic digunakan hemat — hanya untuk penekanan emosional dalam surat
- Letter spacing untuk label uppercase: `0.08em`

---

### 5.3 Spacing Scale

Base unit: **4px**

```
4px   → gap sangat kecil (ikon + teks)
8px   → padding kecil, gap antar elemen rapat
12px  → padding kompak
16px  → padding standar card (mobile)
20px  → padding card (tablet)
24px  → gap antar section kecil
32px  → gap antar section sedang
48px  → gap antar section besar
64px  → padding top/bottom section utama
96px  → jarak besar antar block halaman
```

**Aturan Spacing:**
- Card padding: `16px` mobile, `20–24px` tablet/desktop
- Section gap: `48px` mobile, `64–96px` desktop
- Komponen dalam card: `8–12px` gap
- Padding container horizontal: `20px` mobile, `40px` tablet, `80px` desktop

---

### 5.4 Border Radius Scale

```
4px   → badge kecil, tag
8px   → input field
12px  → card kecil (memory card)
16px  → card standar, modal
20px  → card besar, foto
24px  → tombol pill, counter card
9999px → fully rounded (tombol pill penuh)
```

---

### 5.5 Shadow Scale

```css
--shadow-xs:  0 1px 3px rgba(109, 59, 71, 0.06);   /* Elemen ringan */
--shadow-sm:  0 2px 8px rgba(109, 59, 71, 0.08);   /* Card default */
--shadow-md:  0 4px 16px rgba(109, 59, 71, 0.10);  /* Card hover, modal */
--shadow-lg:  0 8px 32px rgba(109, 59, 71, 0.12);  /* Modal besar, dropdown */
--shadow-glow: 0 0 24px rgba(233, 141, 163, 0.20); /* Efek sparkle/glow rose */
```

---

### 5.6 Glassmorphism (Landing & Special Pages)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.60);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.80);
  box-shadow: 0 4px 24px rgba(109, 59, 71, 0.08);
}
```

Gunakan **hanya** di: Landing Page, Countdown Page, Final Page.  
Jangan gunakan di Admin Panel.

---

## 6. Rancangan Per Halaman — Public

---

### 6.1 Landing Page (`/`)

**Tujuan:** Membuka pengalaman pertama dengan WOW moment lembut. Nona belum tahu apa yang akan dia temukan — buat dia penasaran dan hangat sekaligus.

**Layout:**
```
[Full Viewport — min-height: 100dvh]
│
├── Background: gradient halus dari #FFF7F3 ke #FFF1E6
│
├── Sparkle animation (SVG/Canvas, sangat pelan, opacity 0.4)
│
└── CENTER CARD (glass-card, max-width 480px, padding 48px 40px)
     ├── [Ornamen bunga kecil SVG] — atas card, ukuran 32px, warna --rose-gold
     ├── Label kecil uppercase: "UNTUK NONA" (font DM Sans 11px, --rose-gold, letter-spacing 0.15em)
     ├── Judul Display: "Untuk Nona" (Cormorant 48px, --maroon, weight 300)
     ├── Subjudul: "Untuk 10 Desember" (Cormorant italic 20px, --muted)
     ├── Divider: garis halus 1px --border, lebar 48px, center
     ├── Body teks: "Untuk seseorang yang lahir pada 10 Desember."
     │   (DM Sans 16px, --text, text-align center)
     ├── Tagline: "Sebuah tempat kecil di internet untuk menyimpan hal-hal indah tentang kamu dan kita."
     │   (DM Sans 14px, --muted, text-align center, max-width 320px, margin auto)
     ├── Spacer 32px
     └── Tombol "Masuk ke Cerita Kita" (lihat spesifikasi tombol primary di bawah)
```

**Elemen Visual:**
- Background: `linear-gradient(135deg, #FFF7F3 0%, #FFF1E6 50%, #FDEEF7 100%)`
- Sparkle: titik-titik bintang kecil (4–8px), bergerak sangat pelan, opacity 0.3–0.5
- Card: glassmorphism dengan border `rgba(255,255,255,0.8)`
- Animasi masuk: fade-in + translate-up (0.8s ease-out, delay stagger per elemen)

**Interaksi:**
- Tombol → navigate ke `/countdown`
- Hover tombol: scale(1.02), shadow glow rose lembut

---

### 6.2 Countdown Page (`/countdown`)

**Tujuan:** Menjaga antisipasi dan menyampaikan pesan emosional selama masa tunggu.

**Layout:**
```
[Full Viewport]
│
├── Background sama dengan Landing (konsistensi)
│
├── HEADER SECTION (padding-top 64px)
│   └── Label: "Menuju hari spesialmu" (Cormorant italic 22px, --muted, center)
│
├── COUNTDOWN SECTION (margin-top 48px)
│   └── Grid 4 kolom (tablet/desktop) / 2 kolom (mobile)
│       Setiap kartu countdown:
│       ┌─────────────────┐
│       │   [nomor besar]  │  Cormorant 64px, --maroon
│       │   [label kecil]  │  DM Sans 11px uppercase, --muted, letter-spacing
│       └─────────────────┘
│       Card: bg #FFFFFF, shadow-sm, border-radius 16px, padding 24px 16px
│       Label: HARI | JAM | MENIT | DETIK
│
├── PESAN SECTION (margin-top 48px)
│   └── Quote card (max-width 480px, center):
│       bg --cream, border-left 3px solid --soft-pink, border-radius 0 12px 12px 0
│       Teks: "Aku siapin sesuatu yang mungkin sederhana, tapi aku buat dengan hati."
│       (Cormorant italic 19px, --maroon, padding 20px 24px)
│
└── LOCKED NOTICE CARD (margin-top 32px, max-width 480px, center)
    bg #FFFFFF, border 1px --border, border-radius 16px, padding 24px
    Ikon gembok SVG kecil (--muted, 24px)
    Teks: "Semua bagian masih terkunci. Nanti, 10 Desember 2026, semua akan terbuka untukmu."
    (DM Sans 14px, --muted, center)
```

**State — Birthday Mode (setelah unlock):**
```
BIRTHDAY MODE menggantikan countdown section:
│
├── KONFETI (canvas, jatuh dari atas, 6 detik, lalu fade out)
│
├── HEADING: "Hari ini akhirnya datang." (Cormorant 36px, --maroon, center)
│
├── SUBHEADING: "Selamat ulang tahun, sayang." (Cormorant italic 24px, --rose, center)
│
├── BODY: "Sekarang kamu boleh membuka semua hal kecil yang aku siapin untuk kamu."
│   (DM Sans 16px, --text, center, max-width 400px)
│
└── Tombol: "Buka Hadiahnya" → navigate ke /hub
```

---

### 6.3 Hub Page (`/hub`) — Setelah Unlock

**Tujuan:** Pusat navigasi yang terasa seperti membuka kotak hadiah.

**Layout:**
```
[Page dengan scroll]
│
├── HEADER (padding 48px top)
│   ├── Label: "Selamat Ulang Tahun" (DM Sans 12px uppercase, --rose-gold)
│   ├── Judul: "Untuk Nona" (Cormorant 40px, --maroon)
│   └── Sub: "Pilih dari mana kamu ingin memulai." (DM Sans 15px, --muted)
│
└── MENU GRID (margin-top 40px)
    Grid 2 kolom (mobile) / 3 kolom (tablet) / 3 kolom (desktop)
    Max-width: 720px, center
    Gap: 16px
    
    Setiap Menu Card:
    ┌─────────────────────┐
    │  [ikon SVG 32px]    │
    │  [nomor kecil]      │  e.g. "01"
    │  [judul section]    │  Cormorant 20px, --maroon
    │  [desc singkat]     │  DM Sans 12px, --muted
    └─────────────────────┘
    bg: #FFFFFF, shadow-sm, border-radius 16px, padding 24px 20px
    border: 1px solid --border
    
    Hover: scale(1.02), shadow-md, border-color --soft-pink
    Tap animation (mobile): scale(0.97) lalu scale(1.0)

Menu items:
01 — Timeline      → /timeline       ikon: jam/kalender
02 — Galeri        → /gallery        ikon: foto/gambar
03 — Surat         → /letters        ikon: surat/amplop
04 — Kotak Kenangan→ /memory-box     ikon: kotak/gift
05 — Quiz          → /quiz           ikon: hati/tanya
06 — Rencana Kita  → /plans          ikon: bintang/daftar
07 — Kejutan Terakhir → /final       ikon: sparkle/hadiah (beda style, lebih special)
```

---

### 6.4 Timeline Page (`/timeline`)

**Tujuan:** Menampilkan perjalanan kenangan secara kronologis.

**Header:**
```
Back button (← ikon, kiri atas, DM Sans 14px --muted)
Judul: "Perjalanan Kita" (Cormorant 36px, --maroon, center)
Sub: "Kenangan-kenangan kecil yang aku ingat." (DM Sans 14px, --muted, center)
```

**Layout Timeline:**

*Mobile (< 768px):* Satu kolom vertikal
```
[Dot kecil --rose] ─── [Card kenangan]
                    [Garis vertikal --border 1px]
[Dot kecil --rose] ─── [Card kenangan]
```

*Desktop (≥ 768px):* Alternating kiri-kanan
```
[Card] ─── [Dot] ─── [Card]
            |
[Card] ─── [Dot] ─── [Card]
```

**Struktur Timeline Card:**
```
┌─────────────────────────────────────┐
│  [Tanggal kecil]                    │  DM Sans 12px, --rose-gold, margin-bottom 8px
│  [Judul kenangan]                   │  Cormorant 22px, --maroon
│  [Badge kategori]                   │  lihat badge system
│                                     │
│  [Foto opsional, rounded-xl]        │  aspect-ratio 16/9, object-fit cover
│                                     │
│  [Cerita singkat]                   │  DM Sans 15px, --text, line-height 1.6
└─────────────────────────────────────┘
bg: #FFFFFF, shadow-sm, border-radius 16px, padding 20px
```

**Badge Kategori:**
| Kategori | Warna bg | Warna teks |
|---|---|---|
| Favorit | `#FDE8EF` | `#D4718A` |
| Lucu | `#FEF3C7` | `#B45309` |
| Berharga | `#EDE9FE` | `#6D28D9` |
| Jalan Bareng | `#D1FAE5` | `#065F46` |
| Momen Kecil | `#FFF7F3` | `#C48A6A` |

---

### 6.5 Gallery Page (`/gallery`)

**Header:**
```
Back button
Judul: "Galeri Kenangan" (Cormorant 36px, --maroon, center)
Sub: "Foto-foto kecil yang menyimpan banyak cerita." (DM Sans 14px, --muted, center)
```

**Filter Bar:**
```
Scroll horizontal (mobile) / flex wrap (desktop)
Chip filter: [Semua] [Favorit] [Lucu] [Jalan Bareng] [Momen Kecil] [Ulang Tahun]

Chip default: bg --cream, border --border, radius 9999px, padding 8px 16px
Chip active: bg --rose, border --rose, text #FFFFFF
```

**Foto Grid:**
```
Mobile:  2 kolom, gap 8px
Tablet:  3 kolom, gap 12px
Desktop: 4 kolom, gap 12px

Setiap foto:
- aspect-ratio: 1/1 (square) atau auto untuk vertikal
- object-fit: cover
- border-radius: 12px
- Loading: skeleton shimmer
- Hover/tap: overlay gelap tipis dengan ikon mata (🔍)
```

**Modal Foto (saat klik):**
```
Overlay: rgba(59, 47, 47, 0.85)
Modal: max-width 560px, bg #FFFFFF, border-radius 20px
  ├── Foto besar (aspect auto, object-fit contain, max-height 60vh)
  ├── Divider
  ├── Judul foto (Cormorant 22px, --maroon)
  ├── Tanggal (DM Sans 12px, --rose-gold)
  └── Cerita (DM Sans 14px, --text)
Tutup: × di pojok kanan atas, atau klik di luar modal
```

---

### 6.6 Letters Page (`/letters`)

**Header:**
```
Back button
Judul: "Surat Untukmu" (Cormorant 36px, --maroon, center)
Sub: "Buka yang kamu rasa perlu." (Cormorant italic 18px, --muted, center)
```

**Daftar Surat (sebelum dibuka):**
```
Setiap kartu surat:
┌─────────────────────────────────────┐
│  [Ikon amplop kecil --rose-gold]    │
│  [Judul surat]                      │  Cormorant 22px, --maroon
│  [Keterangan singkat]               │  DM Sans 13px, --muted (optional)
│  [Tombol "Buka Surat"]              │  Outline style, --rose
└─────────────────────────────────────┘
bg: #FFFFFF
border: 1px solid --border
border-left: 3px solid --soft-pink
border-radius: 0 16px 16px 0
padding: 20px 24px
```

**Surat Terbuka (setelah klik "Buka Surat"):**
```
Expand animasi (accordion atau navigate ke halaman baru):
Max-width: 720px, margin auto
bg: #FFFAF7 (sedikit krem)
border: 1px solid --border
border-radius: 16px
padding: 40px (desktop) / 24px (mobile)
│
├── Tanggal: (DM Sans 12px, --muted, kanan atas)
├── Salam: "Hei Nona," (Cormorant italic 22px, --maroon)
├── Isi surat (typing effect / fade-in per paragraf)
│   DM Sans 16-17px, --text, line-height 1.8
│   Spasi antar paragraf: 24px
└── Penutup: "Dari Alex" (Cormorant italic, --rose-gold, align kanan)

Typing effect: karakter muncul satu-satu, speed 30ms/char, bisa di-skip dengan klik
```

---

### 6.7 Memory Box Page (`/memory-box`)

**Header:**
```
Back button
Judul: "Kotak Kenangan" (Cormorant 36px, --maroon, center)
Sub: "Kartu-kartu kecil dari aku untuk kamu." (DM Sans 14px, --muted, center)
```

**Grid Kartu:**
```
Mobile:  2 kolom, gap 12px
Tablet:  3 kolom, gap 16px
Desktop: 4 kolom, gap 16px

Setiap kartu (sebelum dibuka):
┌─────────────┐
│    [?]       │  Ikon sparkle atau amplop kecil
│  [judul]    │  DM Sans 13px, --maroon, font-weight 500
└─────────────┘
bg: gradient halus dari --cream ke --soft-pink (opacity 30%)
border: 1px solid --border
border-radius: 12px
padding: 20px 16px
aspect-ratio: ~3/4
text-align: center
Cursor: pointer

Setelah diklik → animasi flip 3D (rotateY 180deg, 400ms ease)
Sisi belakang:
bg: #FFFFFF
Isi: teks kartu (DM Sans 14px, --text, text-align center)
Padding: 16px
Scroll jika teks panjang
```

---

### 6.8 Quiz Page (`/quiz`)

**Header:**
```
Back button
Judul: "Quiz Kita" (Cormorant 36px, --maroon, center)
Sub: "Seberapa hapal kamu tentang kita?" (DM Sans 14px, --muted, center)
```

**Layout Satu Pertanyaan:**
```
Progress bar atas: "Pertanyaan 2 dari 5" + progress bar --rose
(DM Sans 13px, --muted, progress bar height 4px, bg --cream, fill --rose)

[Card pertanyaan]
bg: #FFFFFF, shadow-sm, border-radius 16px, padding 28px 24px
Teks pertanyaan: Cormorant 24px, --maroon, text-align center

[Grid opsi jawaban] — 1 kolom (mobile) / 2 kolom (desktop)
gap: 12px

Setiap opsi:
┌─────────────────────────────────────┐
│  [A]  Teks jawaban                  │
└─────────────────────────────────────┘
bg: --cream, border: 1.5px solid --border, border-radius: 12px, padding: 16px
Letter badge [A/B/C/D]: 
  bg --soft-pink, warna --maroon, border-radius 50%, size 28px, font 13px bold

State setelah pilih:
- Benar: bg #D1FAE5, border #7DAF8C, ikon centang hijau
- Salah: bg #FEE2E2, border #D97070, ikon silang merah
- Jawaban benar (jika pilih salah): bg #FEF3C7
```

**Hasil Akhir:**
```
[Animasi sparkle + score display]
Score: "5 / 5" (Cormorant 56px, --rose)
Feedback teks (sesuai score):
  100%: "Tentu saja. Kamu pemeran utama di cerita ini."
  80%:  "Hampir sempurna — seperti biasa."
  <80%: "Tidak apa-apa. Yang penting kamu tetap orang favoritku."
Tombol: "Ulangi Quiz" + "Kembali ke Menu"
```

---

### 6.9 Plans Page (`/plans`)

**Header:**
```
Back button
Judul: "Rencana Kita" (Cormorant 36px, --maroon, center)
Sub: "Hal-hal yang ingin kita lakukan bersama." (DM Sans 14px, --muted, center)
```

**Layout Checklist:**
```
Setiap item rencana:
┌─────────────────────────────────────────┐
│  [Status Badge]  [Judul Rencana]        │  Cormorant 20px, --maroon
│                  [Deskripsi singkat]    │  DM Sans 13px, --muted
└─────────────────────────────────────────┘
bg: #FFFFFF, shadow-xs, border-radius: 12px, padding: 16px 20px
border-left: 3px solid [warna status]

Status Badge:
  "Ingin dilakukan"      → bg #FFF7F3, warna --rose-gold, border --soft-pink
  "Sedang direncanakan"  → bg #FEF3C7, warna #B45309, border #E4B96A
  "Sudah tercapai"       → bg #D1FAE5, warna #065F46, border #7DAF8C
  + ikon centang (✓) untuk "Sudah tercapai" dengan animasi muncul

Animasi: saat "Sudah tercapai" muncul → ikon centang scale dari 0 ke 1 dengan bounce
```

---

### 6.10 Final Surprise Page (`/final`)

**Sebelum Klik (setelah unlock):**
```
[Full viewport, center]
bg: gradient warm, sparkle sangat pelan

Ikon: kotak hadiah SVG (animated, bergetar pelan)
Judul: "Satu lagi yang aku simpan untukmu." (Cormorant italic 28px, --maroon)
Sub: "Ini bagian terakhir." (DM Sans 15px, --muted)
Tombol: "Buka Kejutan Terakhir" (primary, ukuran besar)
```

**Setelah Klik:**
```
Fase 1 (0–3 detik): Konfeti meledak + layar flash lembut
Fase 2 (1–5 detik): Foto utama fade in (full width, border-radius 20px, shadow-lg)
Fase 3 (3–6 detik): Pesan ulang tahun typing effect

Layout setelah terbuka:
│
├── Foto utama (max-width 480px, center, aspect 4/5 atau bebas)
│   Shadow: --shadow-lg + glow rose lembut
│
├── [Spacer 40px]
│
├── Teks pesan (typing effect, Cormorant 22px, --maroon, center, max-width 560px):
│   "Selamat ulang tahun, sayang."
│   [jeda 1 detik]
│   "Aku tidak tahu semua hal yang akan terjadi sampai hari ini,"
│   "tapi aku tahu satu hal: aku bersyukur karena kamu ada di hidupku."
│
├── [Spacer 32px]
│
├── Tanda tangan: "Dari Alex" (Cormorant italic 24px, --rose-gold, center)
│
└── [Spacer 48px]
    Tombol kecil: "← Kembali ke Menu" (ghost/text style)

Musik opsional: autoplay tidak disarankan (UX). 
Gunakan tombol "▶ Putar Musik" di pojok bawah kanan (floating, 48px, shadow-md)
```

---

### 6.11 Locked Page (`/locked`)

**Tujuan:** Redirect halaman terkunci yang cantik, bukan error 404.

```
[Full viewport, center]
bg: --background

[Ikon gembok SVG — animated, gentle pulse]
Ukuran ikon: 64px, warna --muted

Judul: "Belum saatnya." (Cormorant 32px, --maroon, center)

Teks:
"Bagian ini sedang aku siapkan pelan-pelan.
Nanti, 10 Desember 2026, kamu bisa melihat semua hal kecil
yang aku kumpulkan untukmu."
(DM Sans 15px, --text, center, max-width 400px, line-height 1.7)

Tombol: "Kembali ke Countdown" (primary, medium)
```

---

## 7. Rancangan Per Halaman — Admin

### 7.1 Admin Login (`/admin`)

```
[Full viewport, center]
bg: --background (sama dengan public — konsisten)

CARD (max-width: 400px, bg #FFFFFF, shadow-md, border-radius 16px, padding 40px)
│
├── Label kecil: "ADMIN" (DM Sans 11px uppercase, --rose-gold, letter-spacing)
├── Judul: "Untuk Nona" (Cormorant 32px, --maroon)
├── Sub: "Masuk sebagai admin" (DM Sans 14px, --muted)
├── [Spacer 24px]
├── Field Password:
│   Label: "Password"
│   Input: type="password", rounded-lg, border --border
│   Focus: border --rose, ring rose/20
│   Error: border --error, text merah di bawah: "Password salah. Coba lagi."
├── [Spacer 16px]
└── Tombol: "Masuk" (primary full-width)
```

---

### 7.2 Admin Dashboard (`/admin/dashboard`)

**Layout:**
```
DESKTOP: Sidebar (240px) + Content Area (flex-1)
MOBILE:  Hamburger/drawer sidebar + Content Area

SIDEBAR:
bg: --maroon
Teks: #FFF7F3 (cream terang)

├── Logo area: "Untuk Nona" (Cormorant 20px) + "admin panel" (DM Sans 11px, opacity 0.6)
├── [Spacer]
├── Nav items (DM Sans 14px, padding 12px 20px):
│   ├── 📊 Dashboard (active: bg rgba(255,255,255,0.15), border-radius 8px)
│   ├── 🕐 Kenangan
│   ├── ✉️ Surat
│   ├── 🎁 Memory Cards
│   ├── ❤️ Quiz
│   └── ⭐ Rencana
├── [Spacer auto]
└── Bottom: "← Lihat Public" + "🚪 Keluar" (DM Sans 13px, opacity 0.7)

CONTENT AREA:
Header: "Selamat datang, Alex 👋" (DM Sans 20px, --text)
Sub: "Ringkasan konten yang sudah kamu tambahkan." (DM Sans 14px, --muted)

STATS GRID (3 kolom desktop, 2 kolom tablet, 1 kolom mobile):
┌─────────────────┐
│  [nomor besar]  │  DM Sans 36px bold, --maroon
│  [label]        │  DM Sans 13px, --muted
└─────────────────┘
bg: #FFFFFF, shadow-xs, border-radius: 12px, padding: 20px
Border-top: 3px solid [warna unik per stat]

Stats: Kenangan | Foto | Surat | Memory Cards | Pertanyaan Quiz | Rencana

QUICK ACTIONS (grid 2–3 kolom):
Tombol outline + ikon untuk: Tambah Kenangan, Tambah Surat, Tambah Kartu, dst.

PREVIEW BUTTON:
Full width, outline --rose, ikon 👁, teks "Preview Tampilan Public (Mode Unlock)"
```

---

### 7.3 Admin Memories (`/admin/memories`)

**Layout:**
```
HEADER: "Kelola Kenangan" + tombol "+ Tambah Kenangan" (primary, kanan atas)

TABEL (desktop) / LIST (mobile):

Desktop table:
| Foto | Judul | Tanggal | Kategori | Status | Aksi |
|---|---|---|---|---|---|
| thumbnail 48px round | teks | teks | badge | badge | Edit | Hapus |

Mobile list:
Card per item dengan info esensial + menu 3 titik (⋮)

FORM TAMBAH / EDIT (Modal atau halaman baru):
┌──────────────────────────────────────┐
│  [Upload Foto] — drag & drop area    │
│  Teks: "Klik atau seret foto ke sini"│
│  Max: 10MB, format: JPG/PNG/WEBP    │
│  Preview foto setelah upload         │
├──────────────────────────────────────┤
│  Judul Kenangan *                    │
│  [Input text]                        │
├──────────────────────────────────────┤
│  Tanggal Kejadian *                  │
│  [Date picker]                       │
├──────────────────────────────────────┤
│  Kategori *                          │
│  [Select: Favorit/Lucu/Berharga/...] │
├──────────────────────────────────────┤
│  Cerita                              │
│  [Textarea, min 4 baris]             │
├──────────────────────────────────────┤
│  Status *                            │
│  [Radio: Draft / Aktif / Sembunyikan]│
├──────────────────────────────────────┤
│  [Batal]        [Simpan Kenangan]    │
└──────────────────────────────────────┘
```

---

### 7.4 Admin Letters (`/admin/letters`)

```
HEADER: "Kelola Surat" + tombol "+ Tambah Surat"

LIST SURAT:
Card per surat, flex row:
[Judul] [Status badge] [Edit] [Hapus]

FORM:
- Judul Surat *
- Isi Surat * (Textarea besar, min 8 baris, monospace jika diinginkan)
- Status * (Draft / Aktif / Sembunyikan)
- [Simpan]
```

---

### 7.5 Admin Memory Cards (`/admin/cards`)

```
HEADER: "Kelola Kartu Kenangan" + tombol "+ Tambah Kartu"

GRID preview kartu (2–3 kolom):
Kartu kecil dengan nomor urut, judul, dan tombol edit/hapus

FORM:
- Nomor Urut * (number input)
- Judul Kartu *
- Isi Kartu * (textarea)
- Kategori (select)
- Status *
```

---

### 7.6 Admin Quiz (`/admin/quiz`)

```
HEADER: "Kelola Quiz" + tombol "+ Tambah Pertanyaan"

LIST pertanyaan: numbered, drag handle untuk reorder

FORM:
- Pertanyaan * (textarea)
- Opsi A * | Opsi B * | Opsi C * | Opsi D *
- Jawaban Benar * (radio: A / B / C / D)
- Feedback Benar * (textarea kecil)
- Feedback Salah * (textarea kecil)
- Status *
```

---

### 7.7 Admin Plans (`/admin/plans`)

```
HEADER: "Kelola Rencana" + tombol "+ Tambah Rencana"

LIST: card per rencana dengan badge status

FORM:
- Judul Rencana *
- Deskripsi (textarea)
- Status Rencana * (select: Ingin dilakukan / Sedang direncanakan / Sudah tercapai)
- Status Publik * (select: Draft / Aktif / Sembunyikan)
```

---

## 8. Sistem Lock / Unlock

### Logic Implementasi (Client-side)

```typescript
// lib/unlock.ts

export const UNLOCK_DATE = new Date('2026-12-09T16:00:00.000Z'); // 10 Des 2026, 00:00 WITA

export function isUnlocked(): boolean {
  return new Date() >= UNLOCK_DATE;
}

export const LOCKED_ROUTES = [
  '/hub',
  '/timeline', 
  '/gallery', 
  '/letters', 
  '/memory-box', 
  '/quiz', 
  '/plans', 
  '/final'
];
```

### Middleware Next.js

```typescript
// middleware.ts
// Cek di setiap request apakah route termasuk LOCKED_ROUTES
// Jika belum unlock DAN bukan admin → redirect ke /locked
// Admin diidentifikasi via cookie session
```

### Admin Bypass
- Admin login menghasilkan cookie `admin_session=true` (httpOnly, secure)
- Middleware memeriksa cookie ini sebelum cek unlock date
- Admin bisa akses semua halaman kapan saja

---

## 9. Komponen UI Reusable

### 9.1 Button

```
VARIANTS:
Primary:  bg --rose, text #FFFFFF, hover bg --rose-dark
Outline:  bg transparent, border 1.5px --rose, text --rose, hover bg --soft-pink/20
Ghost:    bg transparent, text --muted, hover text --rose
Danger:   bg #D97070, text #FFFFFF (admin only)

SIZES:
sm: padding 8px 16px, font 13px, border-radius 8px
md: padding 12px 24px, font 15px, border-radius 12px (default)
lg: padding 16px 32px, font 16px, border-radius 14px

STATES:
Loading: spinner (20px) + "Menyimpan..."
Disabled: opacity 0.5, cursor not-allowed

Min height semua size: 44px (aksesibilitas touch)
```

### 9.2 Input Field

```
Label: DM Sans 13px, --text, font-weight 500, margin-bottom 6px
Input: 
  bg #FFFFFF, border 1.5px --border, border-radius 8px
  padding 12px 14px, font 15px --text
  Focus: border --rose, box-shadow 0 0 0 3px rgba(233,141,163,0.15)
  Error: border --error
  Disabled: bg --cream, opacity 0.7

Error message: DM Sans 12px, --error, margin-top 4px
Required marker: * warna --rose, margin-left 2px
```

### 9.3 Badge / Status Chip

```
Padding: 4px 10px
Border-radius: 9999px (pill)
Font: DM Sans 11px, font-weight 500
```

### 9.4 Modal / Dialog

```
Overlay: rgba(59,47,47,0.7), backdrop-blur(4px)
Modal container: bg #FFFFFF, border-radius 20px, padding 32px
Max-width: 540px (standard), 720px (foto/surat)
Animation masuk: scale(0.95) opacity(0) → scale(1) opacity(1), 200ms ease-out
Tombol tutup: × pojok kanan atas, 32px, --muted, hover --maroon
```

### 9.5 Skeleton Loader

```
bg: linear-gradient(90deg, #F5E8E0 25%, #EDD9CD 50%, #F5E8E0 75%)
background-size: 200% 100%
animation: shimmer 1.5s infinite
border-radius: sama dengan elemen asli
```

### 9.6 Empty State

```
Ikon: 48px, --muted (opacity 0.5)
Teks utama: DM Sans 16px, --muted, center
Teks sub: DM Sans 13px, --muted/70, center
CTA (opsional): tombol outline
```

---

## 10. Animasi & Micro-interaction

### Prinsip Animasi
- **Lambat dan lembut** — duration minimum 200ms, maksimum 800ms untuk transisi halaman
- **Ease-out untuk masuk**, ease-in-out untuk state change
- **Tidak ada animasi yang mengganggu** (tidak ada bounce agresif, tidak ada flash)
- **Dapat di-skip** — animasi panjang (typing effect) harus ada tombol skip

### Daftar Animasi

| Nama | Element | Duration | Easing | Trigger |
|---|---|---|---|---|
| `fadeIn` | Konten halaman | 400ms | ease-out | Page load |
| `slideUp` | Card / section | 500ms | ease-out | Scroll into view |
| `sparkle` | Bintang background | 3–6s per bintang | linear | Continuous (loop) |
| `flipCard` | Memory card | 400ms | ease-in-out | Klik kartu |
| `typing` | Teks surat / final | 30ms/char | linear | Buka surat |
| `confetti` | Kanvas confetti | 6s | physics | Birthday mode |
| `scaleIn` | Modal | 200ms | ease-out | Buka modal |
| `countdownTick` | Angka countdown | 300ms | ease-in-out | Setiap detik |
| `glow` | Tombol CTA | pulse 2s | ease-in-out | Continuous (idle) |
| `checkmark` | ✓ Rencana tercapai | 400ms | spring | Mount |

### Implementasi Confetti

```typescript
// Gunakan library: canvas-confetti
// npm install canvas-confetti @types/canvas-confetti

import confetti from 'canvas-confetti';

export function launchBirthdayConfetti() {
  const colors = ['#F5B7C6', '#C48A6A', '#E98DA3', '#FFF1E6', '#6D3B47'];
  
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.4 },
    colors,
    scalar: 0.9,
  });
  
  // Dua gelombang tambahan
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors }), 500);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors }), 700);
}
```

---

## 11. Responsivitas

### Breakpoints (Tailwind CSS)

```javascript
// tailwind.config.ts
screens: {
  'xs':  '380px',   // Smartphone kecil
  'sm':  '640px',   // Smartphone besar
  'md':  '768px',   // Tablet portrait
  'lg':  '1024px',  // Tablet landscape / laptop kecil
  'xl':  '1280px',  // Laptop / desktop
  '2xl': '1536px',  // Desktop besar
}
```

### Responsive Behavior Per Halaman

| Halaman | Mobile | Tablet | Desktop |
|---|---|---|---|
| Landing | Card full width, padding 24px | Card max-w 480px | Card max-w 480px, background lebih terlihat |
| Countdown | 2 kolom (hari+jam, menit+detik) | 4 kolom | 4 kolom + lebih besar |
| Hub | 2 kolom menu | 3 kolom | 3 kolom max-w 720px center |
| Timeline | 1 kolom vertikal | 1 kolom + lebih lebar | Alternating 2 kolom |
| Gallery | 2 kolom | 3 kolom | 4 kolom |
| Letters | Full width card | Max-w 640px | Max-w 720px |
| Memory Box | 2 kolom | 3 kolom | 4 kolom |
| Admin | Drawer sidebar | Collapsible sidebar | Fixed sidebar |

### Mobile-First Rules
- Touch target minimum: 44×44px
- Tidak ada hover-only interactions
- Scroll horizontal hanya pada komponen yang jelas (chip filter, galeri)
- Font size minimum body: 15px (bukan 12–13px seperti desktop)
- Tombol full-width pada mobile untuk CTA penting

---

## 12. Aksesibilitas

### Kontras Warna (WCAG AA)
| Foreground | Background | Rasio | Status |
|---|---|---|---|
| `--text` (#3B2F2F) | `--background` (#FFF7F3) | ~12:1 | ✅ AA+ |
| `--maroon` (#6D3B47) | `#FFFFFF` | ~9.5:1 | ✅ AA+ |
| `--muted` (#8B6F6F) | `#FFFFFF` | ~4.5:1 | ✅ AA |
| `#FFFFFF` | `--rose` (#E98DA3) | ~3.2:1 | ⚠️ Cukup untuk teks besar |
| `--rose-gold` (#C48A6A) | `#FFFFFF` | ~3.0:1 | ⚠️ Gunakan hanya untuk label kecil |

**Catatan:** Warna rose (#E98DA3) sebagai background tombol dengan teks putih masih dalam batas yang bisa diterima untuk teks large (18px+). Untuk teks body, pastikan kontras cukup.

### Praktik Aksesibilitas
- `alt` text deskriptif untuk semua foto
- `aria-label` untuk tombol ikon (tutup modal, navigasi)
- `aria-live` untuk area countdown (update setiap detik)
- Typing effect: tambahkan teks ke DOM secara utuh tapi tersembunyi untuk screen reader
- Focus ring visible (Tailwind: `focus:ring-2 focus:ring-rose/50`)
- Semua form input punya label yang benar (bukan hanya placeholder)
- Modal: focus trap saat terbuka, return focus saat ditutup

---

## 13. State & Feedback

### Loading States
```
Halaman pertama kali load → Skeleton shimmer (per komponen)
Foto gallery → Skeleton 1:1 square per slot
Surat terbuka → Skeleton 3 baris teks
Submit form admin → Tombol disabled + spinner
Upload foto → Progress bar + persentase
```

### Error States
```
Koneksi gagal → Card error: ikon wifi ⚠️ + "Gagal memuat. Coba lagi." + tombol Retry
Form invalid → Highlight field + pesan di bawah field
Admin login gagal → Shake animation card + pesan error inline
Upload gagal → Reset upload area + pesan error
```

### Empty States
```
Gallery kosong (belum ada foto di admin) → Ikon foto abu + "Belum ada foto yang ditambahkan."
Timeline kosong → Ikon kalender abu + "Belum ada kenangan yang ditambahkan."
```

### Success States
```
Admin simpan konten → Toast notification hijau sage (pojok kanan bawah, 3 detik)
Admin hapus konten → Toast merah dengan opsi "Urungkan" (5 detik)
Quiz selesai → Animasi sparkle + score tampil
Rencana dicentang → Animasi centang + warna berubah ke hijau
```

---

## 14. Prompt untuk AI Design Builder

### Prompt untuk v0.dev (Next.js + Tailwind)

```
[MULAI SALIN]

Build a romantic birthday gift website called "Untuk Nona" (For Nona) in Next.js with Tailwind CSS.

App Purpose: A digital birthday gift website for a girlfriend, featuring locked content that unlocks on December 10, 2026. Premium, soft, romantic, clean — like a handmade digital scrapbook.

Design Language:
- Soft romantic aesthetic, NOT kitschy or overly pink
- Glassmorphism for hero sections (light, not heavy)
- Serif display font (Cormorant Garamond) for emotional headings
- Sans-serif (DM Sans) for body and UI elements
- Very gentle animations: fade, float, sparkle
- Rounded cards with soft shadows

Color Palette:
- Background:  #FFF7F3
- Cream:       #FFF1E6
- Soft Pink:   #F5B7C6
- Rose (CTA):  #E98DA3
- Rose Gold:   #C48A6A
- Maroon:      #6D3B47
- Text:        #3B2F2F
- Muted:       #8B6F6F
- Border:      rgba(196, 138, 106, 0.22)

Page 1 — Landing (/):
- Full viewport, warm gradient background with gentle floating sparkles
- Glassmorphism card center (max-width 480px)
- Small ornament icon top
- Small uppercase label: "UNTUK NONA" rose-gold
- Display heading: "Untuk Nona" Cormorant 48px maroon
- Subtitle italic: "Untuk 10 Desember"
- Horizontal divider 48px
- Body text centered
- Tagline smaller muted text
- Large CTA button: "Masuk ke Cerita Kita" rose color, pill shape

Page 2 — Countdown (/countdown):
- Same background as landing
- "Menuju hari spesialmu" italic heading top
- 4-card countdown grid (days, hours, minutes, seconds) - 2 col mobile / 4 col desktop
- Large Cormorant numbers in each card
- Quote card with left border accent
- Locked notice card below

Page 3 — Locked Page (/locked):
- Centered, animated lock icon with gentle pulse
- Soft heading: "Belum saatnya."
- Explanation text max-width 400px
- CTA back to countdown

Typography rules:
- Headings/display: Cormorant Garamond (Google Fonts)
- Body/UI: DM Sans (Google Fonts)
- Minimum body size: 15px
- Line height body: 1.6–1.7

Avoid:
- Bright/neon colors
- Heavy shadows
- Aggressive animations
- Comic/cute illustration style
- Multiple CTAs per screen
- Small touch targets (<44px)

[SELESAI SALIN]
```

---

### Prompt untuk Figma AI (Desain Mockup)

```
[MULAI SALIN]

Design a romantic digital gift website UI for mobile and desktop.

Project: "Untuk Nona" — Birthday gift website
Tone: Romantic, warm, soft, premium minimal

Create these screens:
1. Landing Page (mobile + desktop)
2. Countdown Page (mobile)
3. Hub/Menu Page (mobile)
4. Gallery Page (mobile)
5. Letter Open State (mobile)
6. Admin Dashboard (desktop)

Style Guide:
- Colors: Background #FFF7F3, Rose #E98DA3, Maroon #6D3B47, Rose Gold #C48A6A, Muted #8B6F6F
- Fonts: Cormorant Garamond for headings, DM Sans for body
- Cards: White background, border-radius 16px, soft shadow
- Buttons: Rose pill-shaped, 44px min height
- Glassmorphism: Only for landing hero card
- Sparkle elements: Tiny star particles, very subtle

Mobile frame: 390 x 844 (iPhone 14)
Desktop frame: 1440 x 900

Visual mood references: soft editorial, love letter aesthetic, premium stationery
Do NOT use: cartoon illustrations, bubble fonts, bright gradients, heavy textures

[SELESAI SALIN]
```

---

## 15. Prioritas Implementasi

### Phase 1 — MVP Fungsional (Wajib sebelum 10 Des 2026)
| Prioritas | Halaman / Fitur | Keterangan |
|---|---|---|
| 🔴 P0 | Landing Page | Entry point, harus sempurna |
| 🔴 P0 | Countdown Page + Birthday Mode | Fungsi utama sebelum unlock |
| 🔴 P0 | Sistem Lock/Unlock | Core logic, client-side |
| 🔴 P0 | Locked Page | UX penting |
| 🔴 P0 | Admin Login + CRUD Letters | Konten emosional |
| 🔴 P0 | Letters Page | Bagian paling personal |
| 🟠 P1 | Admin CRUD Memories | Konten utama timeline/gallery |
| 🟠 P1 | Timeline Page | Kenangan kronologis |
| 🟠 P1 | Gallery Page | Foto kenangan |
| 🟠 P1 | Final Surprise Page | Puncak emosional |
| 🟡 P2 | Memory Box Page | Interaksi menyenangkan |
| 🟡 P2 | Quiz Page | Fun interaction |
| 🟡 P2 | Plans Page | Rencana ke depan |
| 🟢 P3 | Hub Page | Pusat navigasi post-unlock |
| 🟢 P3 | Musik (Final Page) | Nice-to-have |
| 🟢 P3 | Admin Preview Mode | Debugging |

### Catatan Akhir

> **Ingat:** Nona akan membuka website ini di smartphone, mungkin sendirian, mungkin malam hari. Setiap detail kecil — dari waktu loading, urutan animasi, sampai ukuran teks — membentuk momen yang dia rasakan.
>
> Desain yang bagus untuk website ini bukan yang paling kompleks. Tapi yang **paling terasa**.
>
> — dibuat dengan hati, untuk Alex.

---

*design.md v1.0 — Untukmu Project*  
*Last updated: Juni 2026*
