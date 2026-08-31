import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedResource, sanitizeContentInput } from '../lib/resource';

describe('Resource Validation & Input Sanitization', () => {
  it('should identify valid resources', () => {
    assert.strictEqual(isAllowedResource('memories'), true);
    assert.strictEqual(isAllowedResource('letters'), true);
    assert.strictEqual(isAllowedResource('memory_cards'), true);
    assert.strictEqual(isAllowedResource('quiz_questions'), true);
    assert.strictEqual(isAllowedResource('plans'), true);
    assert.strictEqual(isAllowedResource('site_settings'), true);

    assert.strictEqual(isAllowedResource('users'), false);
    assert.strictEqual(isAllowedResource('passwords'), false);
  });

  it('should sanitize memories input and enforce title presence on create', () => {
    assert.throws(() => {
      sanitizeContentInput('memories', { title: '' }, 'create');
    });

    const sanitized = sanitizeContentInput(
      'memories',
      {
        title: ' Foto Kenangan ',
        story: 'Cerita indah',
        category: 'Momen Kecil',
        is_favorite: true,
        status: 'active'
      },
      'create'
    );

    assert.strictEqual(sanitized.title, 'Foto Kenangan');
    assert.strictEqual(sanitized.status, 'active');
    assert.strictEqual(sanitized.is_favorite, true);
  });

  it('should sanitize quiz question options and correct_option check', () => {
    assert.throws(() => {
      sanitizeContentInput('quiz_questions', { question: 'Pertanyaan', correct_option: 'E' }, 'create');
    });

    const sanitized = sanitizeContentInput(
      'quiz_questions',
      {
        question: 'Pertanyaan',
        option_a: 'A',
        option_b: 'B',
        option_c: 'C',
        option_d: 'D',
        correct_option: 'B'
      },
      'create'
    );

    assert.strictEqual(sanitized.correct_option, 'B');
  });

  it('should sanitize plan status and enforce enum constraint', () => {
    assert.throws(() => {
      sanitizeContentInput('plans', { title: 'Rencana', plan_status: 'invalid_status' }, 'create');
    });

    const sanitized = sanitizeContentInput(
      'plans',
      { title: 'Rencana', plan_status: 'tercapai' },
      'create'
    );

    assert.strictEqual(sanitized.plan_status, 'tercapai');
  });
});
