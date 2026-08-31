import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getMediaUrl } from '../lib/media';

describe('Media & Image Pipeline (R2 + Cloudflare Image Transformations)', () => {
  it('should return empty string for null or empty media key', () => {
    assert.strictEqual(getMediaUrl(null), '');
    assert.strictEqual(getMediaUrl(''), '');
    assert.strictEqual(getMediaUrl(undefined), '');
  });

  it('should transform R2 object keys to Cloudflare Image Transformation URLs', () => {
    const key = 'originals/memories/test-uuid-123.jpg';
    const url = getMediaUrl(key, 900);
    assert.strictEqual(
      url,
      '/cdn-cgi/image/format=auto,quality=85,width=900/originals/memories/test-uuid-123.jpg'
    );
  });

  it('should handle custom width parameters for responsive sizing', () => {
    const key = 'originals/memories/sample.png';
    const thumbUrl = getMediaUrl(key, 400);
    const heroUrl = getMediaUrl(key, 1200);

    assert.ok(thumbUrl.includes('width=400'));
    assert.ok(heroUrl.includes('width=1200'));
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
