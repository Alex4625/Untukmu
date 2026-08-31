import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { createAdminToken, verifyAdminToken } from '../lib/adminAuth';

describe('Admin Authentication (Web Crypto API)', () => {
  before(() => {
    process.env.ADMIN_SESSION_SECRET = 'super-secret-key-at-least-32-chars-long-for-testing';
  });

  it('should generate a valid HMAC-signed token', async () => {
    const token = await createAdminToken();
    assert.ok(token);
    assert.ok(token.includes('.'));
    const [payload, signature] = token.split('.');
    assert.ok(payload);
    assert.ok(signature);
  });

  it('should verify a valid token successfully', async () => {
    const token = await createAdminToken();
    const isValid = await verifyAdminToken(token);
    assert.strictEqual(isValid, true);
  });

  it('should reject a tampered payload', async () => {
    const token = await createAdminToken();
    const [, signature] = token.split('.');
    const fakePayload = btoa(JSON.stringify({ role: 'admin', exp: Date.now() + 100000 }));
    const tamperedToken = `${fakePayload}.${signature}`;
    const isValid = await verifyAdminToken(tamperedToken);
    assert.strictEqual(isValid, false);
  });

  it('should reject a tampered signature', async () => {
    const token = await createAdminToken();
    const [payload] = token.split('.');
    const tamperedToken = `${payload}.badsignature1234567890abcdef`;
    const isValid = await verifyAdminToken(tamperedToken);
    assert.strictEqual(isValid, false);
  });

  it('should reject empty or malformed tokens', async () => {
    assert.strictEqual(await verifyAdminToken(''), false);
    assert.strictEqual(await verifyAdminToken(null), false);
    assert.strictEqual(await verifyAdminToken('not-a-token'), false);
    assert.strictEqual(await verifyAdminToken('a.b.c.d'), false);
  });
});
