import { sqliteTable, text, integer, index, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const memories = sqliteTable(
  'memories',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    story: text('story'),
    memory_date: text('memory_date'),
    category: text('category').notNull().default('Momen Kecil'),
    media_key: text('media_key'),
    media_original_name: text('media_original_name'),
    media_size_bytes: integer('media_size_bytes'),
    media_mime_type: text('media_mime_type'),
    status: text('status').notNull().default('draft'),
    is_favorite: integer('is_favorite').notNull().default(0),
    created_at: text('created_at').notNull()
  },
  (table) => [
    check('memories_status_check', sql`${table.status} IN ('draft', 'active', 'hidden')`),
    index('memories_status_date_idx').on(table.status, table.memory_date)
  ]
);

export const letters = sqliteTable(
  'letters',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    unlock_label: text('unlock_label'),
    status: text('status').notNull().default('draft'),
    created_at: text('created_at').notNull()
  },
  (table) => [
    check('letters_status_check', sql`${table.status} IN ('draft', 'active', 'hidden')`),
    index('letters_status_created_idx').on(table.status, table.created_at)
  ]
);

export const memoryCards = sqliteTable(
  'memory_cards',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    card_type: text('card_type').notNull().default('Alasan'),
    status: text('status').notNull().default('draft'),
    sort_order: integer('sort_order').notNull().default(0),
    created_at: text('created_at').notNull()
  },
  (table) => [
    check('memory_cards_status_check', sql`${table.status} IN ('draft', 'active', 'hidden')`),
    index('memory_cards_status_sort_idx').on(table.status, table.sort_order)
  ]
);

export const quizQuestions = sqliteTable(
  'quiz_questions',
  {
    id: text('id').primaryKey(),
    question: text('question').notNull(),
    option_a: text('option_a').notNull(),
    option_b: text('option_b').notNull(),
    option_c: text('option_c').notNull(),
    option_d: text('option_d').notNull(),
    correct_option: text('correct_option').notNull().default('A'),
    feedback: text('feedback'),
    status: text('status').notNull().default('draft'),
    sort_order: integer('sort_order').notNull().default(0),
    created_at: text('created_at').notNull()
  },
  (table) => [
    check('quiz_questions_correct_opt_check', sql`${table.correct_option} IN ('A', 'B', 'C', 'D')`),
    check('quiz_questions_status_check', sql`${table.status} IN ('draft', 'active', 'hidden')`),
    index('quiz_questions_status_sort_idx').on(table.status, table.sort_order)
  ]
);

export const plans = sqliteTable(
  'plans',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    note: text('note'),
    plan_status: text('plan_status').notNull().default('ingin_dilakukan'),
    status: text('status').notNull().default('draft'),
    sort_order: integer('sort_order').notNull().default(0),
    created_at: text('created_at').notNull()
  },
  (table) => [
    check('plans_plan_status_check', sql`${table.plan_status} IN ('ingin_dilakukan', 'direncanakan', 'tercapai')`),
    check('plans_status_check', sql`${table.status} IN ('draft', 'active', 'hidden')`),
    index('plans_status_sort_idx').on(table.status, table.sort_order)
  ]
);

export const siteSettings = sqliteTable('site_settings', {
  id: text('id').primaryKey().default('main'),
  birthday_message: text('birthday_message'),
  final_message: text('final_message'),
  music_url: text('music_url'),
  updated_at: text('updated_at').notNull()
});

export type MemoryEntity = typeof memories.$inferSelect;
export type NewMemoryEntity = typeof memories.$inferInsert;

export type LetterEntity = typeof letters.$inferSelect;
export type NewLetterEntity = typeof letters.$inferInsert;

export type MemoryCardEntity = typeof memoryCards.$inferSelect;
export type NewMemoryCardEntity = typeof memoryCards.$inferInsert;

export type QuizQuestionEntity = typeof quizQuestions.$inferSelect;
export type NewQuizQuestionEntity = typeof quizQuestions.$inferInsert;

export type PlanEntity = typeof plans.$inferSelect;
export type NewPlanEntity = typeof plans.$inferInsert;

export type SiteSettingsEntity = typeof siteSettings.$inferSelect;
export type NewSiteSettingsEntity = typeof siteSettings.$inferInsert;
