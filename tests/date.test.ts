import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatDateID, getUnlockIso, isUnlockedNow } from '../lib/date';

describe('Date & Unlock Logic', () => {
  it('should format date to Indonesian locale string', () => {
    const formatted = formatDateID('2026-12-10');
    assert.strictEqual(formatted, '10 Desember 2026');
  });

  it('should return empty string for null or empty date', () => {
    assert.strictEqual(formatDateID(null), '');
    assert.strictEqual(formatDateID(''), '');
  });

  it('should return valid default ISO unlock timestamp (10 Dec 2026 00:00 WITA = 9 Dec 2026 16:00 UTC)', () => {
    const iso = getUnlockIso();
    assert.ok(iso);
    const date = new Date(iso);
    assert.ok(!isNaN(date.getTime()));
    assert.strictEqual(iso, '2026-12-09T16:00:00.000Z');
  });

  it('should determine unlock status accurately based on current timestamp', () => {
    // A timestamp in year 2025 is locked
    const pastCheck = isUnlockedNow(new Date('2025-10-01T00:00:00Z'));
    assert.strictEqual(pastCheck, false);

    // A timestamp on or after 10 Dec 2026 00:00 WITA (09 Dec 2026 16:00 UTC) is unlocked
    const futureCheck = isUnlockedNow(new Date('2026-12-10T00:00:00Z'));
    assert.strictEqual(futureCheck, true);
  });
});
