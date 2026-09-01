import test from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS, getChapterByPath, getNextChapter, getPrevChapter } from '../components/chapters';
import { previewPath } from '../lib/publicUrl';

test('Page Transitions & 7 Chapter Narrative Routing (TASK-TRANSITIONS)', async (t) => {
  await t.test('should define exactly 7 narrative chapters in sequential order', () => {
    assert.equal(CHAPTERS.length, 7);
    
    assert.deepEqual(CHAPTERS.map((c) => c.number), ['01', '02', '03', '04', '05', '06', '07']);
    assert.deepEqual(CHAPTERS.map((c) => c.slug), [
      'timeline',
      'gallery',
      'letters',
      'memory-box',
      'quiz',
      'plans',
      'final'
    ]);
    assert.deepEqual(CHAPTERS.map((c) => c.href), [
      '/timeline',
      '/gallery',
      '/letters',
      '/memory-box',
      '/quiz',
      '/plans',
      '/final'
    ]);
  });

  await t.test('should identify chapter by path correctly', () => {
    assert.equal(getChapterByPath('/timeline')?.number, '01');
    assert.equal(getChapterByPath('/gallery')?.number, '02');
    assert.equal(getChapterByPath('/letters')?.number, '03');
    assert.equal(getChapterByPath('/memory-box')?.number, '04');
    assert.equal(getChapterByPath('/quiz')?.number, '05');
    assert.equal(getChapterByPath('/plans')?.number, '06');
    assert.equal(getChapterByPath('/final')?.number, '07');
    assert.equal(getChapterByPath('/hub'), undefined);
    assert.equal(getChapterByPath('/'), undefined);
  });

  await t.test('should resolve next chapter correctly across all 7 chapters', () => {
    assert.equal(getNextChapter('01')?.number, '02');
    assert.equal(getNextChapter('02')?.number, '03');
    assert.equal(getNextChapter('03')?.number, '04');
    assert.equal(getNextChapter('04')?.number, '05');
    assert.equal(getNextChapter('05')?.number, '06');
    assert.equal(getNextChapter('06')?.number, '07');
    assert.equal(getNextChapter('07'), null);
    assert.equal(getNextChapter('99'), null);
  });

  await t.test('should resolve previous chapter correctly across all 7 chapters', () => {
    assert.equal(getPrevChapter('01'), null);
    assert.equal(getPrevChapter('02')?.number, '01');
    assert.equal(getPrevChapter('03')?.number, '02');
    assert.equal(getPrevChapter('04')?.number, '03');
    assert.equal(getPrevChapter('05')?.number, '04');
    assert.equal(getPrevChapter('06')?.number, '05');
    assert.equal(getPrevChapter('07')?.number, '06');
    assert.equal(getPrevChapter('99'), null);
  });

  await t.test('should format preview paths correctly during chapter navigation', () => {
    assert.equal(previewPath('/timeline', true), '/timeline?preview=unlocked');
    assert.equal(previewPath('/timeline', false), '/timeline');
    assert.equal(previewPath('/gallery?sort=asc', true), '/gallery?sort=asc&preview=unlocked');
  });
});
