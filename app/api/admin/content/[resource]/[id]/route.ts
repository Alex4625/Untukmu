import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getDb, memories, letters, memoryCards, quizQuestions, plans, siteSettings } from '@/lib/db';
import { isAllowedResource } from '@/lib/resource';
import { sanitizeContentInput } from '@/lib/resource';
import { getMediaUrl } from '@/lib/media';
import { eq } from 'drizzle-orm';

export async function PUT(request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { resource, id } = await params;
  if (!isAllowedResource(resource)) return NextResponse.json({ error: 'Resource tidak valid.' }, { status: 400 });

  const json = await request.json().catch(() => null);
  let body: Record<string, unknown>;
  try {
    body = sanitizeContentInput(resource, json, 'update');
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Body tidak valid.' }, { status: 400 });
  }

  const db = getDb();
  const now = new Date().toISOString();

  try {
    let result: Record<string, unknown>;

    switch (resource) {
      case 'memories': {
        const updateValues: Partial<typeof memories.$inferInsert> = {};
        if (typeof body.title === 'string') updateValues.title = body.title;
        if (typeof body.story !== 'undefined') updateValues.story = body.story ? String(body.story) : null;
        if (typeof body.memory_date !== 'undefined') updateValues.memory_date = body.memory_date ? String(body.memory_date) : null;
        if (typeof body.category === 'string') updateValues.category = body.category;
        if (typeof body.media_key !== 'undefined') updateValues.media_key = body.media_key ? String(body.media_key) : null;
        if (typeof body.media_original_name !== 'undefined') updateValues.media_original_name = body.media_original_name ? String(body.media_original_name) : null;
        if (typeof body.media_size_bytes !== 'undefined') updateValues.media_size_bytes = typeof body.media_size_bytes === 'number' ? body.media_size_bytes : null;
        if (typeof body.media_mime_type !== 'undefined') updateValues.media_mime_type = body.media_mime_type ? String(body.media_mime_type) : null;
        if (typeof body.status === 'string') updateValues.status = body.status as 'draft' | 'active' | 'hidden';
        if (typeof body.is_favorite !== 'undefined') updateValues.is_favorite = body.is_favorite ? 1 : 0;

        const updated = await db.update(memories).set(updateValues).where(eq(memories.id, id)).returning();
        result = {
          ...updated[0],
          image_url: getMediaUrl(updated[0]?.media_key || null)
        };
        break;
      }
      case 'letters': {
        const updateValues: Partial<typeof letters.$inferInsert> = {};
        if (typeof body.title === 'string') updateValues.title = body.title;
        if (typeof body.body === 'string') updateValues.body = body.body;
        if (typeof body.unlock_label !== 'undefined') updateValues.unlock_label = body.unlock_label ? String(body.unlock_label) : null;
        if (typeof body.status === 'string') updateValues.status = body.status as 'draft' | 'active' | 'hidden';

        const updated = await db.update(letters).set(updateValues).where(eq(letters.id, id)).returning();
        result = updated[0];
        break;
      }
      case 'memory_cards': {
        const updateValues: Partial<typeof memoryCards.$inferInsert> = {};
        if (typeof body.title === 'string') updateValues.title = body.title;
        if (typeof body.body === 'string') updateValues.body = body.body;
        if (typeof body.card_type === 'string') updateValues.card_type = body.card_type;
        if (typeof body.status === 'string') updateValues.status = body.status as 'draft' | 'active' | 'hidden';
        if (typeof body.sort_order === 'number') updateValues.sort_order = body.sort_order;

        const updated = await db.update(memoryCards).set(updateValues).where(eq(memoryCards.id, id)).returning();
        result = updated[0];
        break;
      }
      case 'quiz_questions': {
        const updateValues: Partial<typeof quizQuestions.$inferInsert> = {};
        if (typeof body.question === 'string') updateValues.question = body.question;
        if (typeof body.option_a === 'string') updateValues.option_a = body.option_a;
        if (typeof body.option_b === 'string') updateValues.option_b = body.option_b;
        if (typeof body.option_c === 'string') updateValues.option_c = body.option_c;
        if (typeof body.option_d === 'string') updateValues.option_d = body.option_d;
        if (typeof body.correct_option === 'string') updateValues.correct_option = body.correct_option as 'A' | 'B' | 'C' | 'D';
        if (typeof body.feedback !== 'undefined') updateValues.feedback = body.feedback ? String(body.feedback) : null;
        if (typeof body.status === 'string') updateValues.status = body.status as 'draft' | 'active' | 'hidden';
        if (typeof body.sort_order === 'number') updateValues.sort_order = body.sort_order;

        const updated = await db.update(quizQuestions).set(updateValues).where(eq(quizQuestions.id, id)).returning();
        result = updated[0];
        break;
      }
      case 'plans': {
        const updateValues: Partial<typeof plans.$inferInsert> = {};
        if (typeof body.title === 'string') updateValues.title = body.title;
        if (typeof body.note !== 'undefined') updateValues.note = body.note ? String(body.note) : null;
        if (typeof body.plan_status === 'string') updateValues.plan_status = body.plan_status as 'ingin_dilakukan' | 'direncanakan' | 'tercapai';
        if (typeof body.status === 'string') updateValues.status = body.status as 'draft' | 'active' | 'hidden';
        if (typeof body.sort_order === 'number') updateValues.sort_order = body.sort_order;

        const updated = await db.update(plans).set(updateValues).where(eq(plans.id, id)).returning();
        result = updated[0];
        break;
      }
      case 'site_settings': {
        const updateValues: Partial<typeof siteSettings.$inferInsert> = { updated_at: now };
        if (typeof body.birthday_message !== 'undefined') updateValues.birthday_message = body.birthday_message ? String(body.birthday_message) : null;
        if (typeof body.final_message !== 'undefined') updateValues.final_message = body.final_message ? String(body.final_message) : null;
        if (typeof body.music_url !== 'undefined') updateValues.music_url = body.music_url ? String(body.music_url) : null;

        const existing = await db.select().from(siteSettings).where(eq(siteSettings.id, 'main')).limit(1);
        if (existing.length === 0) {
          const inserted = await db.insert(siteSettings).values({ ...updateValues, id: 'main', updated_at: now }).returning();
          result = inserted[0];
        } else {
          const updated = await db.update(siteSettings).set(updateValues).where(eq(siteSettings.id, 'main')).returning();
          result = updated[0];
        }
        break;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memperbarui data.' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { resource, id } = await params;
  if (!isAllowedResource(resource)) return NextResponse.json({ error: 'Resource tidak valid.' }, { status: 400 });

  const db = getDb();

  try {
    switch (resource) {
      case 'memories':
        await db.delete(memories).where(eq(memories.id, id));
        break;
      case 'letters':
        await db.delete(letters).where(eq(letters.id, id));
        break;
      case 'memory_cards':
        await db.delete(memoryCards).where(eq(memoryCards.id, id));
        break;
      case 'quiz_questions':
        await db.delete(quizQuestions).where(eq(quizQuestions.id, id));
        break;
      case 'plans':
        await db.delete(plans).where(eq(plans.id, id));
        break;
      case 'site_settings':
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghapus data.' },
      { status: 500 }
    );
  }
}
