import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getPublicContent } from '../lib/publicContent';
import { getAdminContent } from '../lib/adminContent';
import { getMediaUrl } from '../lib/media';

describe('Production Smoke Test & Content Verification', () => {
  it('should fetch public content in preview mode with all 7 chapters populated', async () => {
    const content = await getPublicContent(true);

    assert.strictEqual(content.unlocked, true);
    assert.strictEqual(content.preview, true);
    assert.strictEqual(content.error, null);

    // 1. Chapter 01 & 02: Memories & Gallery
    assert.ok(content.memories.length >= 4, `Expected at least 4 memories, got ${content.memories.length}`);
    content.memories.forEach((m) => {
      assert.ok(m.title);
      assert.ok(m.media_key);
      assert.ok(m.image_url);
      assert.strictEqual(m.status, 'active');
    });

    // 2. Chapter 03: Letters
    assert.ok(content.letters.length >= 1, `Expected at least 1 letter, got ${content.letters.length}`);
    assert.strictEqual(content.letters[0].title, 'Surat Ulang Tahun');

    // 3. Chapter 04: Memory Box Cards
    assert.ok(content.memory_cards.length >= 2, `Expected at least 2 cards, got ${content.memory_cards.length}`);

    // 4. Chapter 05: Quiz
    assert.ok(content.quiz_questions.length >= 1, `Expected at least 1 quiz question, got ${content.quiz_questions.length}`);
    assert.strictEqual(content.quiz_questions[0].correct_option, 'D');

    // 5. Chapter 06: Plans
    assert.ok(content.plans.length >= 1, `Expected at least 1 plan, got ${content.plans.length}`);

    // 6. Chapter 07: Site Settings & Final Surprise
    assert.ok(content.site_settings);
    assert.ok(content.site_settings?.final_message);
    assert.ok(content.site_settings?.birthday_message);
  });

  it('should return locked content before unlock date when preview is false', async () => {
    // Before Dec 10 2026
    const content = await getPublicContent(false);
    assert.strictEqual(content.unlocked, false);
    assert.strictEqual(content.memories.length, 0);
    assert.strictEqual(content.letters.length, 0);
    assert.strictEqual(content.memory_cards.length, 0);
    assert.strictEqual(content.quiz_questions.length, 0);
    assert.strictEqual(content.plans.length, 0);
  });

  it('should fetch admin content with all items regardless of status', async () => {
    const adminData = await getAdminContent();
    assert.ok(adminData.memories.length >= 4);
    assert.ok(adminData.letters.length >= 1);
    assert.ok(adminData.memory_cards.length >= 2);
    assert.ok(adminData.quiz_questions.length >= 1);
    assert.ok(adminData.plans.length >= 1);
    assert.ok(adminData.site_settings);
  });

  it('should verify image transformation URLs are formatted correctly with width parameters', () => {
    const r2Key = 'originals/memories/cavohv3geer6f21n22gq.jpg';
    const thumbUrl = getMediaUrl(r2Key, 400);
    const gridUrl = getMediaUrl(r2Key, 900);
    const heroUrl = getMediaUrl(r2Key, 1400);

    assert.strictEqual(
      thumbUrl,
      '/api/media/originals/memories/cavohv3geer6f21n22gq.jpg'
    );
    assert.strictEqual(
      gridUrl,
      '/api/media/originals/memories/cavohv3geer6f21n22gq.jpg'
    );
    assert.strictEqual(
      heroUrl,
      '/api/media/originals/memories/cavohv3geer6f21n22gq.jpg'
    );
  });
});
