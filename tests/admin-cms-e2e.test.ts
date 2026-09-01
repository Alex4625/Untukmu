import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getDb, memories, letters, memoryCards, quizQuestions, plans, siteSettings } from '../lib/db/index.js';
import { getAdminContent } from '../lib/adminContent';
import { getPublicContent } from '../lib/publicContent';
import { getMediaUrl } from '../lib/media';
import { eq } from 'drizzle-orm';

describe('Admin CMS & D1/R2 End-to-End Integration (TASK-021)', () => {
  const db = getDb();

  it('should perform CRUD operations on memories via D1', async () => {
    const testId = `mem-test-${Date.now()}`;
    const mediaKey = `originals/memories/${testId}.jpg`;

    // 1. Create
    await db.insert(memories).values({
      id: testId,
      title: 'Momen Tes Admin',
      story: 'Cerita uji coba admin panel',
      memory_date: '2024-08-15',
      category: 'Uji Coba',
      media_key: mediaKey,
      status: 'active',
      is_favorite: 1,
      created_at: new Date().toISOString()
    });

    // 2. Read
    const adminData = await getAdminContent();
    const created = adminData.memories.find((m) => m.id === testId);
    assert.ok(created, 'Created memory must exist in admin content');
    assert.strictEqual(created.title, 'Momen Tes Admin');
    assert.strictEqual(created.is_favorite, true);
    assert.strictEqual(created.media_key, mediaKey);
    // Verify media transformation pipeline connection
    assert.ok(created.image_url?.includes('/api/media/'));

    // 3. Update
    await db.update(memories).set({ title: 'Momen Tes Terupdate' }).where(eq(memories.id, testId));
    const updated = (await db.select().from(memories).where(eq(memories.id, testId)))[0];
    assert.strictEqual(updated.title, 'Momen Tes Terupdate');

    // 4. Delete (cleanup)
    await db.delete(memories).where(eq(memories.id, testId));
    const deleted = (await db.select().from(memories).where(eq(memories.id, testId)))[0];
    assert.strictEqual(deleted, undefined);
  });

  it('should perform CRUD operations on letters via D1', async () => {
    const testId = `let-test-${Date.now()}`;

    // Create
    await db.insert(letters).values({
      id: testId,
      title: 'Surat Tes',
      body: 'Isi surat tes admin',
      unlock_label: 'Tes Label',
      status: 'active',
      created_at: new Date().toISOString()
    });

    const adminData = await getAdminContent();
    const created = adminData.letters.find((l) => l.id === testId);
    assert.ok(created);
    assert.strictEqual(created.unlock_label, 'Tes Label');

    // Delete
    await db.delete(letters).where(eq(letters.id, testId));
  });

  it('should perform CRUD operations on memory_cards with sort_order via D1', async () => {
    const testId = `card-test-${Date.now()}`;

    await db.insert(memoryCards).values({
      id: testId,
      title: 'Kartu Tes',
      body: 'Pesan rahasia kartu',
      card_type: 'Alasan',
      status: 'active',
      sort_order: 42,
      created_at: new Date().toISOString()
    });

    const adminData = await getAdminContent();
    const created = adminData.memory_cards.find((c) => c.id === testId);
    assert.ok(created);
    assert.strictEqual(created.sort_order, 42);

    await db.delete(memoryCards).where(eq(memoryCards.id, testId));
  });

  it('should perform CRUD operations on quiz_questions with feedback via D1', async () => {
    const testId = `quiz-test-${Date.now()}`;

    await db.insert(quizQuestions).values({
      id: testId,
      question: 'Pertanyaan Uji Coba?',
      option_a: 'Jawaban A',
      option_b: 'Jawaban B',
      option_c: 'Jawaban C',
      option_d: 'Jawaban D',
      correct_option: 'B',
      feedback: 'Penjelasan emosional hangat untuk opsi B',
      status: 'active',
      sort_order: 10,
      created_at: new Date().toISOString()
    });

    const adminData = await getAdminContent();
    const created = adminData.quiz_questions.find((q) => q.id === testId);
    assert.ok(created);
    assert.strictEqual(created.correct_option, 'B');
    assert.strictEqual(created.feedback, 'Penjelasan emosional hangat untuk opsi B');

    await db.delete(quizQuestions).where(eq(quizQuestions.id, testId));
  });

  it('should perform CRUD operations on plans with plan_status via D1', async () => {
    const testId = `plan-test-${Date.now()}`;

    await db.insert(plans).values({
      id: testId,
      title: 'Rencana Tes Masa Depan',
      note: 'Catatan perjalanan',
      plan_status: 'direncanakan',
      status: 'active',
      sort_order: 5,
      created_at: new Date().toISOString()
    });

    const adminData = await getAdminContent();
    const created = adminData.plans.find((p) => p.id === testId);
    assert.ok(created);
    assert.strictEqual(created.plan_status, 'direncanakan');

    await db.delete(plans).where(eq(plans.id, testId));
  });

  it('should update and retrieve site_settings via D1', async () => {
    const initial = (await db.select().from(siteSettings).where(eq(siteSettings.id, 'main')))[0];

    const testFinalMessage = 'Pesan final puncak cerita tes ' + Date.now();
    await db
      .insert(siteSettings)
      .values({
        id: 'main',
        final_message: testFinalMessage,
        music_url: '/audio/about_you.mp3',
        updated_at: new Date().toISOString()
      })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: {
          final_message: testFinalMessage,
          updated_at: new Date().toISOString()
        }
      });

    const adminData = await getAdminContent();
    assert.strictEqual(adminData.site_settings?.final_message, testFinalMessage);

    // Restore previous setting
    if (initial?.final_message) {
      await db
        .update(siteSettings)
        .set({ final_message: initial.final_message })
        .where(eq(siteSettings.id, 'main'));
    }
  });

  it('should verify preview mode allows viewing content across Scene system before unlock date', async () => {
    // 1. Preview = true unlocks content even before unlock date
    const previewContent = await getPublicContent(true);
    assert.strictEqual(previewContent.preview, true);
    assert.strictEqual(previewContent.unlocked, true);
    assert.ok(Array.isArray(previewContent.memories));
    assert.ok(Array.isArray(previewContent.letters));
    assert.ok(Array.isArray(previewContent.memory_cards));
    assert.ok(Array.isArray(previewContent.quiz_questions));
    assert.ok(Array.isArray(previewContent.plans));

    // 2. Preview = false before unlock date returns locked state
    const lockedContent = await getPublicContent(false);
    assert.strictEqual(lockedContent.preview, false);
    assert.strictEqual(lockedContent.unlocked, false);
    assert.strictEqual(lockedContent.memories.length, 0);
  });

  it('should verify image pipeline getMediaUrl formats R2 keys correctly for responsive Scene usage', () => {
    const sampleKey = 'originals/memories/photo-123.jpg';
    const transformedUrl = getMediaUrl(sampleKey, 1080);
    assert.ok(transformedUrl.startsWith('/api/media/'));
    assert.ok(transformedUrl.includes(sampleKey));
  });
});
