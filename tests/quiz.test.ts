import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { QuizQuestion } from '../lib/types';
import Quiz, { getActiveQuestions } from '../components/Quiz';

const dummyQuestion = (
  id: string,
  sortOrder = 0,
  status: QuizQuestion['status'] = 'active',
  correct: QuizQuestion['correct_option'] = 'A'
): QuizQuestion => ({
  id,
  question: `Pertanyaan ke-${sortOrder + 1}?`,
  option_a: 'Pilihan Pertama',
  option_b: 'Pilihan Kedua',
  option_c: 'Pilihan Ketiga',
  option_d: 'Pilihan Keempat',
  correct_option: correct,
  feedback: 'Catatan feedback hangat untuk pertanyaan ini.',
  status,
  sort_order: sortOrder,
  created_at: new Date().toISOString()
});

describe('Quiz Chapter Multi-Scene Architecture (TASK-018, DESIGN.md section 13)', () => {
  it('should export Quiz as a functional component', () => {
    assert.strictEqual(typeof Quiz, 'function');
  });

  it('should return empty list when questions array is empty', () => {
    assert.deepStrictEqual(getActiveQuestions([]), []);
  });

  it('should filter active questions and sort strictly by sort_order ascending', () => {
    const raw: QuizQuestion[] = [
      dummyQuestion('3', 3, 'active'),
      dummyQuestion('1', 1, 'active'),
      dummyQuestion('d-1', 0, 'draft'),
      dummyQuestion('2', 2, 'active'),
      dummyQuestion('h-1', 4, 'hidden')
    ];

    const active = getActiveQuestions(raw);
    assert.strictEqual(active.length, 3);
    assert.strictEqual(active[0].id, '1');
    assert.strictEqual(active[1].id, '2');
    assert.strictEqual(active[2].id, '3');
  });

  it('should produce exactly 1 scene when 1 question is active', () => {
    const single = [dummyQuestion('single', 0, 'active')];
    const active = getActiveQuestions(single);
    assert.strictEqual(active.length, 1);
  });

  it('should dynamically scale to multiple scenes matching active questions count', () => {
    const questions = Array.from({ length: 6 }, (_, i) =>
      dummyQuestion(`q-${i}`, i, 'active')
    );

    const active = getActiveQuestions(questions);
    assert.strictEqual(active.length, 6);
  });
});
