import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Letter } from '../lib/types';
import Letters, { getActiveLetters } from '../components/Letters';

const dummyLetter = (id: string, title: string, status: Letter['status'] = 'active'): Letter => ({
  id,
  title,
  body: `Isi surat ${title} yang ditulis dengan lembut dan penuh perasaan.`,
  unlock_label: 'Surat Rahasia',
  status,
  created_at: new Date().toISOString()
});

describe('Letters Chapter Multi-Scene Architecture (TASK-016, DESIGN.md section 13)', () => {
  it('should export Letters as a function component', () => {
    assert.strictEqual(typeof Letters, 'function');
  });

  it('should filter active letters and ignore draft or hidden status', () => {
    const list: Letter[] = [
      dummyLetter('1', 'Surat Pertama', 'active'),
      dummyLetter('2', 'Surat Draf', 'draft'),
      dummyLetter('3', 'Surat Tersembunyi', 'hidden'),
      dummyLetter('4', 'Surat Kedua', 'active')
    ];

    const active = getActiveLetters(list);
    assert.strictEqual(active.length, 2);
    assert.strictEqual(active[0].id, '1');
    assert.strictEqual(active[1].id, '4');
  });

  it('should dynamically produce 0 scenes when no active letters exist', () => {
    const list: Letter[] = [
      dummyLetter('1', 'Surat Draf', 'draft')
    ];

    const active = getActiveLetters(list);
    assert.strictEqual(active.length, 0);
  });

  it('should dynamically produce exactly 1 scene when exactly 1 active letter exists', () => {
    const list: Letter[] = [
      dummyLetter('1', 'Surat Tunggal', 'active')
    ];

    const active = getActiveLetters(list);
    assert.strictEqual(active.length, 1);
  });

  it('should dynamically scale scene count to match multiple active letters', () => {
    const list: Letter[] = Array.from({ length: 5 }, (_, i) =>
      dummyLetter(`letter-${i}`, `Surat ke-${i + 1}`, 'active')
    );

    const active = getActiveLetters(list);
    assert.strictEqual(active.length, 5);
  });
});
