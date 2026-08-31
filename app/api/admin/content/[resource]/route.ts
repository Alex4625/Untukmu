import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getDb, memories, letters, memoryCards, quizQuestions, plans, siteSettings } from '@/lib/db';
import { isAllowedResource } from '@/lib/resource';
import { sanitizeContentInput } from '@/lib/resource';
import { getMediaUrl } from '@/lib/media';

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { resource } = await params;
  if (!isAllowedResource(resource)) return NextResponse.json({ error: 'Resource tidak valid.' }, { status: 400 });

  const json = await request.json().catch(() => null);
  let body: Record<string, unknown>;
  try {
    body = sanitizeContentInput(resource, json, 'create');
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Body tidak valid.' }, { status: 400 });
  }

  const db = getDb();
  const id = (typeof body.id === 'string' && body.id) ? body.id : crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    let result: Record<string, unknown>;

    switch (resource) {
      case 'memories': {
        const inserted = await db.insert(memories).values({
          id,
          title: String(body.title || ''),
          story: body.story ? String(body.story) : null,
          memory_date: body.memory_date ? String(body.memory_date) : null,
          category: String(body.category || 'Momen Kecil'),
          media_key: body.media_key ? String(body.media_key) : null,
          media_original_name: body.media_original_name ? String(body.media_original_name) : null,
          media_size_bytes: typeof body.media_size_bytes === 'number' ? body.media_size_bytes : null,
          media_mime_type: body.media_mime_type ? String(body.media_mime_type) : null,
          status: (body.status as 'draft' | 'active' | 'hidden') || 'draft',
          is_favorite: body.is_favorite ? 1 : 0,
          created_at: now
        }).returning();
        result = {
          ...inserted[0],
          image_url: getMediaUrl(inserted[0]?.media_key || null)
        };
        break;
      }
      case 'letters': {
        const inserted = await db.insert(letters).values({
          id,
          title: String(body.title || ''),
          body: String(body.body || ''),
          unlock_label: body.unlock_label ? String(body.unlock_label) : null,
          status: (body.status as 'draft' | 'active' | 'hidden') || 'draft',
          created_at: now
        }).returning();
        result = inserted[0];
        break;
      }
      case 'memory_cards': {
        const inserted = await db.insert(memoryCards).values({
          id,
          title: String(body.title || ''),
          body: String(body.body || ''),
          card_type: String(body.card_type || 'Alasan'),
          status: (body.status as 'draft' | 'active' | 'hidden') || 'draft',
          sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
          created_at: now
        }).returning();
        result = inserted[0];
        break;
      }
      case 'quiz_questions': {
        const inserted = await db.insert(quizQuestions).values({
          id,
          question: String(body.question || ''),
          option_a: String(body.option_a || ''),
          option_b: String(body.option_b || ''),
          option_c: String(body.option_c || ''),
          option_d: String(body.option_d || ''),
          correct_option: (body.correct_option as 'A' | 'B' | 'C' | 'D') || 'A',
          feedback: body.feedback ? String(body.feedback) : null,
          status: (body.status as 'draft' | 'active' | 'hidden') || 'draft',
          sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
          created_at: now
        }).returning();
        result = inserted[0];
        break;
      }
      case 'plans': {
        const inserted = await db.insert(plans).values({
          id,
          title: String(body.title || ''),
          note: body.note ? String(body.note) : null,
          plan_status: (body.plan_status as 'ingin_dilakukan' | 'direncanakan' | 'tercapai') || 'ingin_dilakukan',
          status: (body.status as 'draft' | 'active' | 'hidden') || 'draft',
          sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
          created_at: now
        }).returning();
        result = inserted[0];
        break;
      }
      case 'site_settings': {
        const inserted = await db.insert(siteSettings).values({
          id: 'main',
          birthday_message: body.birthday_message ? String(body.birthday_message) : null,
          final_message: body.final_message ? String(body.final_message) : null,
          music_url: body.music_url ? String(body.music_url) : null,
          updated_at: now
        }).returning();
        result = inserted[0];
        break;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menyimpan data.' },
      { status: 500 }
    );
  }
}
