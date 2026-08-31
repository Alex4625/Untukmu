import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzleBetterSqlite, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { seedInitialData } from './seed';
import path from 'path';
import fs from 'fs';

type DbInstance = BetterSQLite3Database<typeof schema>;
let localDbInstance: DbInstance | null = null;

export function getDb(): DbInstance {
  // 1. Check for Cloudflare D1 context (Cloudflare Workers via OpenNext)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env?.DB) {
      return drizzleD1(ctx.env.DB, { schema }) as unknown as DbInstance;
    }
  } catch {
    // Ignore when not in OpenNext worker runtime
  }

  // 2. Fallback to local SQLite (Node.js / Local Dev / CI / Tests)
  if (!localDbInstance) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require('better-sqlite3');
    const dbDir = path.resolve(process.cwd(), '.sqlite');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, 'local.db');
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');

    // Create tables if not exist (ensures seamless local dev out of the box)
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
      CREATE INDEX IF NOT EXISTS memory_cards_status_sort_idx ON memory_cards (status, sort_order);

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
      CREATE INDEX IF NOT EXISTS plans_status_sort_idx ON plans (status, sort_order);

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
      CREATE INDEX IF NOT EXISTS quiz_questions_status_sort_idx ON quiz_questions (status, sort_order);

      CREATE TABLE IF NOT EXISTS site_settings (
        id text PRIMARY KEY DEFAULT 'main' NOT NULL,
        birthday_message text,
        final_message text,
        music_url text,
        updated_at text NOT NULL
      );
    `);

    localDbInstance = drizzleBetterSqlite(sqlite, { schema });
    // Seed initial data if empty
    seedInitialData(localDbInstance).catch((err: unknown) => {
      console.warn('Initial seeding warning:', err);
    });
  }

  return localDbInstance;
}

export * from './schema';
export { seedInitialData } from './seed';
