import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../lib/db/schema';
import { seedInitialData } from '../lib/db/seed';
import { eq, asc } from 'drizzle-orm';

describe('Database & D1 SQLite Schema (DATABASE.md)', () => {
  let db: BetterSQLite3Database<typeof schema>;
  let sqlite: ReturnType<typeof Database>;

  before(async () => {
    sqlite = new Database(':memory:');

    // Create tables matching schema
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

    db = drizzle(sqlite, { schema }) as unknown as BetterSQLite3Database<typeof schema>;
    await seedInitialData(db);
  });

  it('should seed default records across all 6 tables', async () => {
    const settings = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 'main'));
    assert.strictEqual(settings.length, 1);
    assert.strictEqual(settings[0].id, 'main');

    const seededLetters = await db.select().from(schema.letters);
    assert.ok(seededLetters.length >= 1);

    const cards = await db.select().from(schema.memoryCards);
    assert.ok(cards.length >= 2);

    const quiz = await db.select().from(schema.quizQuestions);
    assert.ok(quiz.length >= 1);

    const seededPlans = await db.select().from(schema.plans);
    assert.ok(seededPlans.length >= 1);
  });

  it('should enforce status CHECK constraint on SQLite level', () => {
    assert.throws(() => {
      sqlite.prepare(`
        INSERT INTO memories (id, title, status, is_favorite, created_at)
        VALUES ('test-id', 'Test Title', 'invalid_status', 0, '2026-01-01T00:00:00Z')
      `).run();
    });
  });

  it('should enforce plan_status CHECK constraint on SQLite level', () => {
    assert.throws(() => {
      sqlite.prepare(`
        INSERT INTO plans (id, title, plan_status, status, sort_order, created_at)
        VALUES ('plan-id', 'Test Plan', 'invalid_plan_status', 'active', 0, '2026-01-01T00:00:00Z')
      `).run();
    });
  });

  it('should filter active status for public queries and ignore draft/hidden', async () => {
    const now = new Date().toISOString();
    await db.insert(schema.memories).values([
      {
        id: crypto.randomUUID(),
        title: 'Active Memory',
        category: 'Momen Kecil',
        status: 'active',
        is_favorite: 1,
        created_at: now
      },
      {
        id: crypto.randomUUID(),
        title: 'Draft Memory',
        category: 'Momen Kecil',
        status: 'draft',
        is_favorite: 0,
        created_at: now
      },
      {
        id: crypto.randomUUID(),
        title: 'Hidden Memory',
        category: 'Momen Kecil',
        status: 'hidden',
        is_favorite: 0,
        created_at: now
      }
    ]);

    const activeOnly = await db
      .select()
      .from(schema.memories)
      .where(eq(schema.memories.status, 'active'))
      .orderBy(asc(schema.memories.created_at));

    assert.strictEqual(activeOnly.some((m) => m.title === 'Active Memory'), true);
    assert.strictEqual(activeOnly.some((m) => m.title === 'Draft Memory'), false);
    assert.strictEqual(activeOnly.some((m) => m.title === 'Hidden Memory'), false);
  });
});
