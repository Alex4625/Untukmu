import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { uploadToStorage } from '@/lib/mediaServer';

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.formData().catch(() => null);
  if (!data) {
    return NextResponse.json({ error: 'Data form tidak valid.' }, { status: 400 });
  }

  const file = data.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Hanya file gambar yang diizinkan.' }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Maksimal foto 5 MB.' }, { status: 400 });
  }

  try {
    const result = await uploadToStorage(file, 'memories');
    return NextResponse.json({
      ok: true,
      media_key: result.media_key,
      secure_url: result.url,
      image_url: result.url,
      media_original_name: result.media_original_name,
      media_size_bytes: result.media_size_bytes,
      media_mime_type: result.media_mime_type
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal mengunggah media.' },
      { status: 500 }
    );
  }
}
