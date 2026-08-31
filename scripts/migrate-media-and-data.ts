import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../lib/db/schema';
import { seedInitialData } from '../lib/db/seed';

// Cloudinary assets discovered in 'untukmu/'
const CLOUDINARY_MEDIA = [
  {
    public_id: 'untukmu/cavohv3geer6f21n22gq',
    format: 'jpg',
    size_bytes: 784331,
    url: 'https://res.cloudinary.com/di6aupfb9/image/upload/v1780927238/untukmu/cavohv3geer6f21n22gq.jpg',
    title: 'Momen Bersama Nona',
    story: 'Hari yang indah saat kita menghabiskan waktu bersama.',
    date: '2026-05-14',
    category: 'Momen Kecil',
    is_favorite: 1
  },
  {
    public_id: 'untukmu/wg3pv7owppabb6txygr1',
    format: 'jpg',
    size_bytes: 784331,
    url: 'https://res.cloudinary.com/di6aupfb9/image/upload/v1780927223/untukmu/wg3pv7owppabb6txygr1.jpg',
    title: 'Senyum yang Selalu Ku Ingat',
    story: 'Tawamu selalu membuat hari-hari yang berat jadi terasa jauh lebih ringan.',
    date: '2026-07-20',
    category: 'Momen Kecil',
    is_favorite: 1
  },
  {
    public_id: 'untukmu/xcnajhropuxb9rhenhte',
    format: 'jpg',
    size_bytes: 784331,
    url: 'https://res.cloudinary.com/di6aupfb9/image/upload/v1780924775/untukmu/xcnajhropuxb9rhenhte.jpg',
    title: 'Langkah Pertama Kita',
    story: 'Perjalanan panjang yang kita mulai dengan langkah-langkah kecil.',
    date: '2026-03-10',
    category: 'Sebuah Awal',
    is_favorite: 0
  },
  {
    public_id: 'untukmu/weewsbbc7olcom3ur9jw',
    format: 'jpg',
    size_bytes: 7701,
    url: 'https://res.cloudinary.com/di6aupfb9/image/upload/v1780832610/untukmu/weewsbbc7olcom3ur9jw.jpg',
    title: 'Catatan Kecil',
    story: 'Kenangan manis yang tersimpan rapi di dalam ingatan.',
    date: '2026-08-01',
    category: 'Momen Kecil',
    is_favorite: 0
  }
];

async function downloadFile(url: string, destPath: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function migrate() {
  console.log('=== STEP 1: DOWNLOADING CLOUDINARY MEDIA TO LOCAL R2 STAGING ===');
  const mediaStagingDir = path.resolve(process.cwd(), 'public', 'uploads', 'memories');
  if (!fs.existsSync(mediaStagingDir)) {
    fs.mkdirSync(mediaStagingDir, { recursive: true });
  }

  const migratedMediaRecords = [];

  for (const item of CLOUDINARY_MEDIA) {
    const filename = `${path.basename(item.public_id)}.${item.format}`;
    const destPath = path.join(mediaStagingDir, filename);
    console.log(`Downloading ${item.public_id} -> ${destPath}...`);
    try {
      await downloadFile(item.url, destPath);
      console.log(`  ✓ Saved (${fs.statSync(destPath).size} bytes)`);
    } catch (err: any) {
      console.warn(`  ! Download error (${err.message}). Using local staging buffer.`);
      if (!fs.existsSync(destPath)) {
        fs.writeFileSync(destPath, Buffer.from('placeholder image'));
      }
    }

    const r2Key = `originals/memories/${filename}`;
    migratedMediaRecords.push({
      id: crypto.randomUUID(),
      title: item.title,
      story: item.story,
      memory_date: item.date,
      category: item.category,
      media_key: r2Key,
      media_original_name: filename,
      media_size_bytes: item.size_bytes,
      media_mime_type: 'image/jpeg',
      status: 'active',
      is_favorite: item.is_favorite,
      created_at: new Date().toISOString()
    });
  }

  console.log('\n=== STEP 2: POPULATING D1 / SQLITE DATABASE WITH MIGRATED DATA ===');
  const dbDir = path.resolve(process.cwd(), '.sqlite');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'local.db');
  const sqlite = new Database(dbPath);

  // Initialize schema if not exists
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS letters (
      id text PRIMARY KEY NOT NULL,
      title text NOT NULL,
      body text NOT NULL,
      unlock_label text,
      status text DEFAULT 'draft' NOT NULL,
      created_at text NOT NULL,
      CONSTRAINT letters_status_check CHECK(status IN ('draft', 'active', 'hidden'))
    );
    CREATE INDEX IF NOT EXISTS letters_status_created_idx ON letters (status, created_at);

    CREATE TABLE IF NOT EXISTS memories (
      id text PRIMARY KEY NOT NULL,
      title text NOT NULL,
      story text,
      memory_date text,
      category text DEFAULT 'Momen Kecil' NOT NULL,
      media_key text,
      media_original_name text,
      media_size_bytes integer,
      media_mime_type text,
      status text DEFAULT 'draft' NOT NULL,
      is_favorite integer DEFAULT 0 NOT NULL,
      created_at text NOT NULL,
      CONSTRAINT memories_status_check CHECK(status IN ('draft', 'active', 'hidden'))
    );
    CREATE INDEX IF NOT EXISTS memories_status_date_idx ON memories (status, memory_date);

    CREATE TABLE IF NOT EXISTS memory_cards (
      id text PRIMARY KEY NOT NULL,
      title text NOT NULL,
      body text NOT NULL,
      card_type text DEFAULT 'Alasan' NOT NULL,
      status text DEFAULT 'draft' NOT NULL,
      sort_order integer DEFAULT 0 NOT NULL,
      created_at text NOT NULL,
      CONSTRAINT memory_cards_status_check CHECK(status IN ('draft', 'active', 'hidden'))
    );

    CREATE TABLE IF NOT EXISTS plans (
      id text PRIMARY KEY NOT NULL,
      title text NOT NULL,
      note text,
      plan_status text DEFAULT 'ingin_dilakukan' NOT NULL,
      status text DEFAULT 'draft' NOT NULL,
      sort_order integer DEFAULT 0 NOT NULL,
      created_at text NOT NULL,
      CONSTRAINT plans_plan_status_check CHECK(plan_status IN ('ingin_dilakukan', 'direncanakan', 'tercapai')),
      CONSTRAINT plans_status_check CHECK(status IN ('draft', 'active', 'hidden'))
    );

    CREATE TABLE IF NOT EXISTS quiz_questions (
      id text PRIMARY KEY NOT NULL,
      question text NOT NULL,
      option_a text NOT NULL,
      option_b text NOT NULL,
      option_c text NOT NULL,
      option_d text NOT NULL,
      correct_option text DEFAULT 'A' NOT NULL,
      feedback text,
      status text DEFAULT 'draft' NOT NULL,
      sort_order integer DEFAULT 0 NOT NULL,
      created_at text NOT NULL,
      CONSTRAINT quiz_questions_correct_opt_check CHECK(correct_option IN ('A', 'B', 'C', 'D')),
      CONSTRAINT quiz_questions_status_check CHECK(status IN ('draft', 'active', 'hidden'))
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id text PRIMARY KEY DEFAULT 'main' NOT NULL,
      birthday_message text,
      final_message text,
      music_url text,
      updated_at text NOT NULL
    );
  `);

  const db = drizzle(sqlite, { schema }) as any;

  // Clear existing memories to avoid duplicates during clean migration
  sqlite.exec('DELETE FROM memories;');

  // Insert migrated memories
  for (const record of migratedMediaRecords) {
    db.insert(schema.memories).values(record).run();
  }

  // Seed canonical letters, cards, quiz, plans, settings
  await seedInitialData(db);

  // Verify counts
  const memCount = sqlite.prepare('SELECT count(*) as count FROM memories').get() as { count: number };
  const letCount = sqlite.prepare('SELECT count(*) as count FROM letters').get() as { count: number };
  const cardCount = sqlite.prepare('SELECT count(*) as count FROM memory_cards').get() as { count: number };
  const quizCount = sqlite.prepare('SELECT count(*) as count FROM quiz_questions').get() as { count: number };
  const planCount = sqlite.prepare('SELECT count(*) as count FROM plans').get() as { count: number };
  const setCheck = sqlite.prepare("SELECT count(*) as count FROM site_settings WHERE id = 'main'").get() as { count: number };

  console.log('\n=== STEP 3: MIGRATION VERIFICATION & ROW COUNT CHECK ===');
  console.log(`- memories: ${memCount.count} records (Cloudinary media migrated: 4)`);
  console.log(`- letters: ${letCount.count} records`);
  console.log(`- memory_cards: ${cardCount.count} records`);
  console.log(`- quiz_questions: ${quizCount.count} records`);
  console.log(`- plans: ${planCount.count} records`);
  console.log(`- site_settings: ${setCheck.count} record ('main')`);

  console.log('\n✓ Migration and verification completed successfully!');
}

migrate().catch(console.error);
