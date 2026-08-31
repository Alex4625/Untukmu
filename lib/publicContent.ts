import { getDb, memories, letters, memoryCards, quizQuestions, plans, siteSettings, type MemoryEntity } from './db';
import { getUnlockIso, isUnlockedNow } from './date';
import { getMediaUrl } from './media';
import type { Memory, PublicContent, SiteSettings } from './types';
import { asc, eq } from 'drizzle-orm';

export async function getPublicContent(preview = false): Promise<PublicContent> {
  const previewMode = Boolean(preview);
  const unlocked = previewMode || isUnlockedNow();

  if (!unlocked) {
    return {
      memories: [],
      letters: [],
      memory_cards: [],
      quiz_questions: [],
      plans: [],
      site_settings: await getLockedSettings(),
      unlocked: false,
      preview: false,
      unlockIso: getUnlockIso(),
      error: null
    };
  }

  const db = getDb();

  try {
    const [settingsList, memoriesList, lettersList, cardsList, quizList, plansList] = await Promise.all([
      db.select().from(siteSettings).where(eq(siteSettings.id, 'main')).limit(1),
      db.select().from(memories).where(eq(memories.status, 'active')).orderBy(asc(memories.memory_date)),
      db.select().from(letters).where(eq(letters.status, 'active')).orderBy(asc(letters.created_at)),
      db.select().from(memoryCards).where(eq(memoryCards.status, 'active')).orderBy(asc(memoryCards.sort_order)),
      db.select().from(quizQuestions).where(eq(quizQuestions.status, 'active')).orderBy(asc(quizQuestions.sort_order)),
      db.select().from(plans).where(eq(plans.status, 'active')).orderBy(asc(plans.sort_order))
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
      site_settings: settingsList[0] || null,
      unlocked,
      preview: previewMode,
      unlockIso: getUnlockIso(),
      error: null
    };
  } catch (error) {
    console.error('Error fetching public content:', error);
    return {
      memories: [],
      letters: [],
      memory_cards: [],
      quiz_questions: [],
      plans: [],
      site_settings: null,
      unlocked,
      preview: previewMode,
      unlockIso: getUnlockIso(),
      error: error instanceof Error ? error.message : 'Gagal memuat konten dari database.'
    };
  }
}

async function getLockedSettings(): Promise<SiteSettings | null> {
  try {
    const db = getDb();
    const settingsList = await db
      .select({
        id: siteSettings.id,
        music_url: siteSettings.music_url,
        updated_at: siteSettings.updated_at
      })
      .from(siteSettings)
      .where(eq(siteSettings.id, 'main'))
      .limit(1);

    if (!settingsList.length) return null;

    return {
      id: settingsList[0].id || 'main',
      birthday_message: null,
      final_message: null,
      music_url: settingsList[0].music_url || null,
      updated_at: settingsList[0].updated_at || new Date(0).toISOString()
    };
  } catch {
    return null;
  }
}
