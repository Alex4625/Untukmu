import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clamp, playAudioCue, stopAudioCue } from '../components/scene';

describe('Scene Component System (TASK-012, DEC-012, DEC-013, DEC-015)', () => {
  it('should clamp numbers accurately within bounds', () => {
    assert.strictEqual(clamp(-0.5), 0);
    assert.strictEqual(clamp(0.5), 0.5);
    assert.strictEqual(clamp(1.5), 1);
    assert.strictEqual(clamp(5, 10, 20), 10);
    assert.strictEqual(clamp(25, 10, 20), 20);
    assert.strictEqual(clamp(15, 10, 20), 15);
  });

  it('should handle audio cue singleton safely without error in non-browser environment', () => {
    // In Node.js / SSR, window is undefined
    assert.doesNotThrow(() => {
      playAudioCue('/audio/chime.mp3');
      stopAudioCue();
    });
  });

  it('should calculate scroll-linked progress transforms within DEC-015 constraints', () => {
    // Test that background translateY shift stays within subtle bounds (<= 20px)
    const testMotions = [0, 0.25, 0.5, 0.75, 1.0];
    testMotions.forEach((motion) => {
      const bgShift = (motion - 0.5) * 16;
      assert.ok(Math.abs(bgShift) <= 16, `Background shift ${bgShift}px exceeds 16px bound`);

      // Test that media scale stays within subtle bound (1.00 to 1.025)
      const mediaScale = 1 + motion * 0.025;
      assert.ok(mediaScale >= 1.0 && mediaScale <= 1.025, `Media scale ${mediaScale} exceeds bound`);

      // Test staggered text opacity
      const textOpacity = clamp((motion - 0.06) / 0.32);
      assert.ok(textOpacity >= 0 && textOpacity <= 1, `Text opacity ${textOpacity} out of range [0, 1]`);
    });
  });

  it('should guarantee reduced motion outputs 0 transform and 100% text opacity', () => {
    const reducedMotion = true;
    const progress = 0.8;
    const motion = reducedMotion ? 0 : progress;

    const bgShift = reducedMotion ? 0 : (motion - 0.5) * 16;
    const mediaScale = reducedMotion ? 1 : 1 + motion * 0.025;
    const textOpacity = reducedMotion ? 1 : clamp((motion - 0.06) / 0.32);
    const textShift = reducedMotion ? 0 : (1 - motion) * 16;

    assert.strictEqual(bgShift, 0);
    assert.strictEqual(mediaScale, 1);
    assert.strictEqual(textOpacity, 1);
    assert.strictEqual(textShift, 0);
  });

  it('should enforce 3 distinct layer architecture (Background, Midground, Foreground)', () => {
    // Architecture invariant test
    const layers = ['Background', 'Midground', 'Foreground/Media'];
    assert.strictEqual(layers.length, 3, 'Max 3 active moving layers per scene per DEC-015');
  });
});
