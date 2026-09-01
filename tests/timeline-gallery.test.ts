import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Memory } from '../lib/types';
import Timeline, { sortMemoriesChronologically } from '../components/Timeline';
import MemoryGrid, { groupThematicClusters } from '../components/MemoryGrid';

const dummyMemory = (id: string, title: string, category = 'Momen Kecil', date = '2024-05-10', isFavorite = false): Memory => ({
  id,
  title,
  story: `Cerita kenangan ${title}`,
  memory_date: date,
  category,
  media_key: `originals/memories/${id}.jpg`,
  status: 'active',
  is_favorite: isFavorite,
  created_at: new Date().toISOString()
});

describe('Timeline & Gallery Multi-Scene Architecture (TASK-015, DEC-013)', () => {
  it('should export Timeline and MemoryGrid components as functions', () => {
    assert.strictEqual(typeof Timeline, 'function');
    assert.strictEqual(typeof MemoryGrid, 'function');
  });

  it('should sort memories chronologically for Timeline chapter', () => {
    const raw = [
      dummyMemory('3', 'Tahun 2025', 'Momen', '2025-01-01'),
      dummyMemory('1', 'Tahun 2023', 'Momen', '2023-01-01'),
      dummyMemory('2', 'Tahun 2024', 'Momen', '2024-01-01')
    ];

    const sorted = sortMemoriesChronologically(raw);
    assert.strictEqual(sorted[0].id, '1');
    assert.strictEqual(sorted[1].id, '2');
    assert.strictEqual(sorted[2].id, '3');
  });

  it('should return empty list when memories array is empty', () => {
    assert.deepStrictEqual(sortMemoriesChronologically([]), []);
    assert.deepStrictEqual(groupThematicClusters([]), []);
  });

  it('should group Gallery into distinct thematic clusters when multiple categories exist', () => {
    const memoriesByCat = [
      dummyMemory('1', 'Senyum Pagi', 'Keseharian'),
      dummyMemory('2', 'Jalan Sore', 'Perjalanan'),
      dummyMemory('3', 'Makan Malam', 'Keseharian'),
      dummyMemory('4', 'Bintang Malam', 'Malam')
    ];

    const clusters = groupThematicClusters(memoriesByCat);
    assert.strictEqual(clusters.length, 3);
    assert.strictEqual(clusters[0].title, 'Keseharian');
    assert.strictEqual(clusters[0].items.length, 2);
    assert.strictEqual(clusters[1].title, 'Perjalanan');
    assert.strictEqual(clusters[1].items.length, 1);
    assert.strictEqual(clusters[2].title, 'Malam');
    assert.strictEqual(clusters[2].items.length, 1);
  });

  it('should group Gallery into Favorites and Others when only 1 category exists with favorites', () => {
    const memoriesWithFav = [
      dummyMemory('1', 'Favorit 1', 'Momen Kecil', '2024-01-01', true),
      dummyMemory('2', 'Favorit 2', 'Momen Kecil', '2024-02-01', true),
      dummyMemory('3', 'Biasa 1', 'Momen Kecil', '2024-03-01', false)
    ];

    const clusters = groupThematicClusters(memoriesWithFav);
    assert.strictEqual(clusters.length, 2);
    assert.strictEqual(clusters[0].id, 'favorites');
    assert.strictEqual(clusters[0].items.length, 2);
    assert.strictEqual(clusters[1].id, 'moments');
    assert.strictEqual(clusters[1].items.length, 1);
  });

  it('should dynamically chunk large memories collection into thematic scenes without exceeding viewport', () => {
    const manyMemories = Array.from({ length: 11 }, (_, i) =>
      dummyMemory(`mem-${i}`, `Momen ke-${i + 1}`)
    );

    const clusters = groupThematicClusters(manyMemories);
    // 11 items chunked by 3 = 4 clusters (3 + 3 + 3 + 2)
    assert.strictEqual(clusters.length, 4);
    assert.strictEqual(clusters[0].items.length, 3);
    assert.strictEqual(clusters[3].items.length, 2);
  });
});
