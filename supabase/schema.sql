-- Jalankan file ini di Supabase SQL Editor.
-- Project ini memakai API route Next.js + service role key, sehingga frontend publik tidak langsung menulis ke database.

create extension if not exists "pgcrypto";

do $$ begin
  create type content_status as enum ('draft', 'active', 'hidden');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type plan_progress_status as enum ('ingin_dilakukan', 'direncanakan', 'tercapai');
exception when duplicate_object then null;
end $$;

create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  story text,
  memory_date date,
  category text default 'Momen Kecil',
  image_url text,
  cloudinary_public_id text,
  status content_status not null default 'draft',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  unlock_label text,
  status content_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists memory_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  card_type text default 'Alasan',
  status content_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null default 'A' check (correct_option in ('A','B','C','D')),
  feedback text,
  status content_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  note text,
  plan_status plan_progress_status not null default 'ingin_dilakukan',
  status content_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  id text primary key default 'main',
  birthday_message text,
  final_message text,
  music_url text,
  updated_at timestamptz not null default now()
);

insert into site_settings (id, birthday_message, final_message, music_url)
values (
  'main',
  'Selamat ulang tahun, sayang. Sekarang semua bagian yang aku siapin sudah bisa dibuka.',
  'Selamat ulang tahun, sayang. Aku tidak tahu semua hal yang akan terjadi sampai hari ini, tapi aku tahu satu hal: aku bersyukur karena kamu ada di hidupku.\n\nDari Alex.',
  null
)
on conflict (id) do nothing;

-- Contoh data awal. Boleh dihapus setelah admin sudah dipakai.
insert into letters (title, body, unlock_label, status)
select 'Surat Ulang Tahun', 'Untuk kamu,

Selamat ulang tahun. Aku mungkin tidak selalu pandai menyusun kata, tapi aku ingin kamu tahu bahwa kamu sangat berarti. Website kecil ini aku siapin pelan-pelan, dengan hati.

Dari Alex.', 'Surat utama', 'active'
where not exists (select 1 from letters where title = 'Surat Ulang Tahun');

insert into memory_cards (title, body, card_type, status, sort_order)
select 'Alasan kecil', 'Aku suka caramu tetap berusaha kuat, bahkan saat kamu sedang capek.', 'Alasan', 'active', 1
where not exists (select 1 from memory_cards where title = 'Alasan kecil');

insert into memory_cards (title, body, card_type, status, sort_order)
select 'Doa kecil', 'Semoga di umur yang baru, kamu makin kuat, makin bahagia, dan selalu dikelilingi hal-hal baik.', 'Doa', 'active', 2
where not exists (select 1 from memory_cards where title = 'Doa kecil');

insert into quiz_questions (question, option_a, option_b, option_c, option_d, correct_option, feedback, status, sort_order)
select 'Siapa pemeran utama di website ini?', 'Aku', 'Kamu', 'Kita', 'Semuanya benar', 'D', 'Tentu saja semuanya benar.', 'active', 1
where not exists (select 1 from quiz_questions where question = 'Siapa pemeran utama di website ini?');

insert into plans (title, note, plan_status, status, sort_order)
select 'Foto bareng lebih banyak', 'Bukan karena harus sempurna, tapi supaya ada lebih banyak cerita yang bisa kita ingat.', 'ingin_dilakukan', 'active', 1
where not exists (select 1 from plans where title = 'Foto bareng lebih banyak');
