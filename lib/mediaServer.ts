import path from 'path';
import fs from 'fs';
import { getMediaUrl } from './media';

export type UploadResult = {
  media_key: string;
  media_original_name: string;
  media_size_bytes: number;
  media_mime_type: string;
  url: string;
};

export async function uploadToStorage(file: File, folder = 'memories'): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || '.jpg';
  const id = crypto.randomUUID();
  const mediaKey = `originals/${folder}/${id}${ext}`;

  // 1. Try Cloudflare R2 binding
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env?.MEDIA_BUCKET) {
      await ctx.env.MEDIA_BUCKET.put(mediaKey, buffer, {
        httpMetadata: { contentType: file.type }
      });
      return {
        media_key: mediaKey,
        media_original_name: file.name,
        media_size_bytes: file.size,
        media_mime_type: file.type,
        url: getMediaUrl(mediaKey)
      };
    }
  } catch {
    // Ignore when not in Cloudflare Worker runtime
  }

  // 2. Fallback to local public storage for local Next.js dev
  const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const localFileName = `${id}${ext}`;
  const localFilePath = path.join(uploadDir, localFileName);
  fs.writeFileSync(localFilePath, buffer);

  const localUrl = `/uploads/${folder}/${localFileName}`;
  return {
    media_key: localUrl,
    media_original_name: file.name,
    media_size_bytes: file.size,
    media_mime_type: file.type,
    url: localUrl
  };
}
