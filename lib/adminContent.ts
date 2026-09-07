import { getDb, memories, letters, memoryCards, quizQuestions, plans, siteSettings, deskPolaroids, type MemoryEntity, type DeskPolaroidEntity } from './db';
import { getMediaUrl } from './media';
import type { PublicContent, Memory, DeskPolaroid } from './types';
import { asc, desc, eq } from 'drizzle-orm';

export type AdminContent = Omit<PublicContent, 'unlocked' | 'unlockIso' | 'preview'>;

export async function getAdminContent(): Promise<AdminContent> {
  const db = getDb();

  let deskPolaroidsList: DeskPolaroid[] = [];
  try {
    const rawPolaroids = await db.select().from(deskPolaroids).orderBy(asc(deskPolaroids.sort_order));
    deskPolaroidsList = rawPolaroids.map((p: DeskPolaroidEntity) => ({
      ...p,
      status: p.status as DeskPolaroid['status'],
      rotation_deg: p.rotation_deg ?? -3,
      sort_order: p.sort_order ?? 0,
      image_url: getMediaUrl(p.media_key)
    }));
  } catch {
    deskPolaroidsList = [];
  }

  const [memoriesList, lettersList, cardsList, quizList, plansList, settingsList] = await Promise.all([
    db.select().from(memories).orderBy(desc(memories.created_at)),
    db.select().from(letters).orderBy(desc(letters.created_at)),
    db.select().from(memoryCards).orderBy(asc(memoryCards.sort_order)),
    db.select().from(quizQuestions).orderBy(asc(quizQuestions.sort_order)),
    db.select().from(plans).orderBy(asc(plans.sort_order)),
    db.select().from(siteSettings).where(eq(siteSettings.id, 'main')).limit(1)
  ]);

  const formattedMemories: Memory[] = memoriesList.map((m: MemoryEntity) => ({
    ...m,
    status: m.status as Memory['status'],
    is_favorite: Boolean(m.is_favorite),
    image_url: getMediaUrl(m.media_key)
  }));

  return {
    memories: formattedMemories,
    letters: lettersList.map((l) => ({ ...l, status: l.status as Memory['status'] })),
    memory_cards: cardsList.map((c) => ({ ...c, status: c.status as Memory['status'] })),
    quiz_questions: quizList.map((q) => ({ ...q, status: q.status as Memory['status'], correct_option: q.correct_option as 'A'|'B'|'C'|'D' })),
    plans: plansList.map((p) => ({ ...p, status: p.status as Memory['status'], plan_status: p.plan_status as 'ingin_dilakukan'|'direncanakan'|'tercapai' })),
    desk_polaroids: deskPolaroidsList,
    site_settings: settingsList[0] || null
  };
}
