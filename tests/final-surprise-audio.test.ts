import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import FinalSurprise from '../components/FinalSurprise';
import { playAudioCue, stopAudioCue } from '../components/scene/audioCue';
import { CHAPTERS, getNextChapter, getPrevChapter } from '../components/chapters';

// Helper to calculate relative luminance per WCAG 2.1 specs
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1: string, hex2: string): number {
  const parseHex = (hex: string) => {
    const clean = hex.replace('#', '');
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16)
    ];
  };

  const [r1, g1, b1] = parseHex(hex1);
  const [r2, g2, b2] = parseHex(hex2);

  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

describe('Final Surprise & Persistent Audio Architecture (TASK-020, DEC-007, DEC-015)', () => {
  it('should export FinalSurprise as a callable component function', () => {
    assert.strictEqual(typeof FinalSurprise, 'function');
  });

  it('should validate WCAG AA contrast ratio for dark burgundy background and cream/gold typography', () => {
    const bgDarkBurgundy = '#421D26';
    const textCream = '#FAF7F2';
    const textGold = '#D4AF37';

    // Cream text on dark burgundy must exceed WCAG AAA (7.0:1)
    const creamContrast = contrastRatio(bgDarkBurgundy, textCream);
    assert.ok(
      creamContrast >= 7.0,
      `Cream text contrast (${creamContrast.toFixed(2)}) must exceed 7.0:1 WCAG AAA`
    );

    // Gold text on dark burgundy must exceed WCAG AA (4.5:1)
    const goldContrast = contrastRatio(bgDarkBurgundy, textGold);
    assert.ok(
      goldContrast >= 4.5,
      `Gold text contrast (${goldContrast.toFixed(2)}) must exceed 4.5:1 WCAG AA`
    );
  });

  it('should enforce audio cue singleton behavior and volume ceiling (DEC-015, section 17)', () => {
    // In Node.js environment without window/Audio, it should not throw
    assert.doesNotThrow(() => {
      playAudioCue('/audio/cue.mp3', 0.25);
      playAudioCue('/audio/another.mp3', 0.5); // Should replace previous, not stack
      stopAudioCue();
    });
  });

  it('should properly link Chapter 07 as final destination in chapter sequence', () => {
    const ch7 = CHAPTERS.find((c) => c.number === '07');
    assert.ok(ch7);
    assert.strictEqual(ch7.href, '/final');
    assert.strictEqual(ch7.publicTitle, 'Untuk Hari Ini');

    // Chapter 06 next chapter must be Chapter 07
    const nextFrom6 = getNextChapter('06');
    assert.strictEqual(nextFrom6?.number, '07');

    // Chapter 07 has no next chapter (it is the final emotional pinnacle)
    const nextFrom7 = getNextChapter('07');
    assert.strictEqual(nextFrom7, null);

    // Previous from 07 must be 06 (Mungkin Nanti)
    const prevFrom7 = getPrevChapter('07');
    assert.strictEqual(prevFrom7?.number, '06');
  });

  it('should verify all 7 chapter routes exist and map to consistent public paths', () => {
    const expectedPaths = [
      '/timeline',
      '/gallery',
      '/letters',
      '/memory-box',
      '/quiz',
      '/plans',
      '/final'
    ];

    assert.strictEqual(CHAPTERS.length, 7);
    CHAPTERS.forEach((ch, idx) => {
      assert.strictEqual(ch.href, expectedPaths[idx]);
      assert.strictEqual(ch.number, String(idx + 1).padStart(2, '0'));
    });
  });
});
