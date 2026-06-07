import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAdminRequest } from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'untukmu';
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary env belum lengkap.' }, { status: 500 });
  }

  const data = await request.formData();
  const file = data.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Hanya file gambar yang diizinkan.' }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Maksimal foto 5 MB.' }, { status: 400 });

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('timestamp', timestamp);
  form.append('folder', folder);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form
  });
  const json = await res.json();
  if (!res.ok) return NextResponse.json({ error: json.error?.message || 'Upload gagal.' }, { status: 500 });

  return NextResponse.json({
    secure_url: json.secure_url,
    public_id: json.public_id,
    width: json.width,
    height: json.height
  });
}
