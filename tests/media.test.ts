import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getMediaUrl } from '../lib/media';

describe('Media & Image Pipeline (R2 + Cloudflare Image Transformations)', () => {
  it('should return empty string for null or empty media key', () => {
    assert.strictEqual(getMediaUrl(null), '');
    assert.strictEqual(getMediaUrl(''), '');
    assert.strictEqual(getMediaUrl(undefined), '');
  });

  it('should transform R2 object keys to internal media route URLs', () => {
    const key = 'originals/memories/test-uuid-123.jpg';
    const url = getMediaUrl(key, 900);
    assert.strictEqual(url, '/api/media/originals/memories/test-uuid-123.jpg');
  });

  it('should handle custom width parameters gracefully', () => {
    const key = 'originals/memories/sample.png';
    const url = getMediaUrl(key, 400);
    assert.strictEqual(url, '/api/media/originals/memories/sample.png');
  });

  it('should preserve external HTTP/HTTPS URLs', () => {
    const externalUrl = 'https://example.com/photo.jpg';
    assert.strictEqual(getMediaUrl(externalUrl), externalUrl);
  });

  it('should preserve local paths like /uploads/ or /audio/', () => {
    const localPath = '/audio/about_you.mp3';
    assert.strictEqual(getMediaUrl(localPath), localPath);
  });

  it('should handle legacy Cloudinary URLs by appending auto format and quality', () => {
    const cloudUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    const transformed = getMediaUrl(cloudUrl, 800);
    assert.ok(transformed.includes('f_auto,q_auto,w_800'));
  });
});
