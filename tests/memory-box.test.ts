import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { MemoryCard } from '../lib/types';
import MemoryBox, { groupMemoryCardsIntoScenes } from '../components/MemoryBox';

const dummyCard = (id: string, title: string, cardType = 'Alasan', status: MemoryCard['status'] = 'active'): MemoryCard => ({
  id,
  title,
  body: `Pesan rahasia untuk kartu ${title}`,
  card_type: cardType,
  status,
  sort_order: 0,
  created_at: new Date().toISOString()
});

describe('Memory Box Chapter (TASK-017, DESIGN.md section 13)', () => {
  it('should export MemoryBox as a function component', () => {
    assert.strictEqual(typeof MemoryBox, 'function');
  });

  it('should return empty group when cards array is empty', () => {
    assert.deepStrictEqual(groupMemoryCardsIntoScenes([]), []);
  });

  it('should group 1 to 6 cards into strictly 1 unified scene', () => {
    const cards = [
      dummyCard('1', 'Alasan Pertama'),
      dummyCard('2', 'Alasan Kedua'),
      dummyCard('3', 'Alasan Ketiga'),
      dummyCard('4', 'Alasan Keempat')
    ];

    const groups = groupMemoryCardsIntoScenes(cards);
    assert.strictEqual(groups.length, 1);
    assert.strictEqual(groups[0].cards.length, 4);
  });

  it('should group >6 cards with distinct card_types into strictly 2 thematic scenes', () => {
    const cards = [
      dummyCard('1', 'Alasan 1', 'Alasan'),
      dummyCard('2', 'Alasan 2', 'Alasan'),
      dummyCard('3', 'Alasan 3', 'Alasan'),
      dummyCard('4', 'Alasan 4', 'Alasan'),
      dummyCard('5', 'Doa 1', 'Doa'),
      dummyCard('6', 'Doa 2', 'Doa'),
      dummyCard('7', 'Doa 3', 'Doa')
    ];

    const groups = groupMemoryCardsIntoScenes(cards);
    assert.strictEqual(groups.length, 2, 'Must strictly produce 2 scenes');
    assert.strictEqual(groups[0].cards.length, 4);
    assert.strictEqual(groups[1].cards.length, 3);
  });

  it('should split >6 cards with uniform category evenly into strictly 2 scenes', () => {
    const cards = Array.from({ length: 10 }, (_, i) =>
      dummyCard(`card-${i}`, `Kartu ke-${i + 1}`, 'Alasan')
    );

    const groups = groupMemoryCardsIntoScenes(cards);
    assert.strictEqual(groups.length, 2, 'Must strictly cap at 2 scenes');
    assert.strictEqual(groups[0].cards.length, 5);
    assert.strictEqual(groups[1].cards.length, 5);
  });

  it('should ignore inactive (draft or hidden) cards during grouping', () => {
    const cards: MemoryCard[] = [
      dummyCard('1', 'Kartu Aktif', 'Alasan', 'active'),
      dummyCard('2', 'Kartu Draf', 'Alasan', 'draft'),
      dummyCard('3', 'Kartu Tersembunyi', 'Alasan', 'hidden')
    ];

    const groups = groupMemoryCardsIntoScenes(cards);
    assert.strictEqual(groups.length, 1);
    assert.strictEqual(groups[0].cards.length, 1);
    assert.strictEqual(groups[0].cards[0].id, '1');
  });
});
