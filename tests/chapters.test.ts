import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS, getChapterByPath, getNextChapter, getPrevChapter } from '../components/chapters';

describe('Chapter Navigation & Metadata (DESIGN.md v2)', () => {
  it('should have exactly 7 chapters matching specification', () => {
    assert.strictEqual(CHAPTERS.length, 7);
  });

  it('should map technical names to public titles correctly', () => {
    const expected = [
      { number: '01', slug: 'timeline', technical: 'Timeline', public: 'Sebuah Awal' },
      { number: '02', slug: 'gallery', technical: 'Gallery', public: 'Momen Kecil' },
      { number: '03', slug: 'letters', technical: 'Letters', public: 'Yang Aku Ingat' },
      { number: '04', slug: 'memory-box', technical: 'Memory Box', public: 'Yang Tak Terucap' },
      { number: '05', slug: 'quiz', technical: 'Quiz', public: 'Tentang Kamu' },
      { number: '06', slug: 'plans', technical: 'Plans', public: 'Mungkin Nanti' },
      { number: '07', slug: 'final', technical: 'Final Surprise', public: 'Untuk Hari Ini' }
    ];

    expected.forEach((exp, idx) => {
      const ch = CHAPTERS[idx];
      assert.strictEqual(ch.number, exp.number);
      assert.strictEqual(ch.slug, exp.slug);
      assert.strictEqual(ch.technicalName, exp.technical);
      assert.strictEqual(ch.publicTitle, exp.public);
    });
  });

  it('should resolve chapter by pathname', () => {
    assert.strictEqual(getChapterByPath('/timeline')?.number, '01');
    assert.strictEqual(getChapterByPath('/gallery')?.number, '02');
    assert.strictEqual(getChapterByPath('/letters')?.number, '03');
    assert.strictEqual(getChapterByPath('/memory-box')?.number, '04');
    assert.strictEqual(getChapterByPath('/quiz')?.number, '05');
    assert.strictEqual(getChapterByPath('/plans')?.number, '06');
    assert.strictEqual(getChapterByPath('/final')?.number, '07');
    assert.strictEqual(getChapterByPath('/hub'), undefined);
  });

  it('should calculate next and previous chapters correctly', () => {
    assert.strictEqual(getNextChapter('01')?.number, '02');
    assert.strictEqual(getNextChapter('06')?.number, '07');
    assert.strictEqual(getNextChapter('07'), null);

    assert.strictEqual(getPrevChapter('07')?.number, '06');
    assert.strictEqual(getPrevChapter('02')?.number, '01');
    assert.strictEqual(getPrevChapter('01'), null);
  });
});
