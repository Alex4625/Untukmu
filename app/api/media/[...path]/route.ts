import { NextRequest } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!path || !path.length) {
    return new Response('Path required', { status: 400 });
  }
  const key = path.join('/');

  try {
    const ctx = await getCloudflareContext({ async: true });
    const env = ctx?.env as { MEDIA_BUCKET?: { get: (k: string) => Promise<{ httpMetadata?: { contentType?: string }; httpEtag?: string; body: ReadableStream | ArrayBuffer | Blob | null } | null> } } | undefined;
    if (!env?.MEDIA_BUCKET) {
      return new Response('Media bucket unavailable', { status: 503 });
    }

    const object = await env.MEDIA_BUCKET.get(key);
    if (!object) {
      return new Response('Not Found', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (object.httpEtag) {
      headers.set('ETag', object.httpEtag);
    }

    return new Response(object.body, { headers });
  } catch {
    return new Response('Error retrieving media', { status: 500 });
  }
}
