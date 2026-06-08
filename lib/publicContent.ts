import { getSupabaseAdmin } from './supabaseAdmin';
import { getUnlockIso, isUnlockedNow } from './date';
import type { PublicContent, SiteSettings } from './types';

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
      unlockIso: getUnlockIso()
    };
  }

  const supabase = getSupabaseAdmin();
  const active = { status: 'active' };
  const [settings, memories, letters, cards, quiz, plans] = await Promise.all([
    supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle(),
    supabase.from('memories').select('*').match(active).order('memory_date', { ascending: true }),
    supabase.from('letters').select('*').match(active).order('created_at', { ascending: true }),
    supabase.from('memory_cards').select('*').match(active).order('sort_order', { ascending: true }),
    supabase.from('quiz_questions').select('*').match(active).order('sort_order', { ascending: true }),
    supabase.from('plans').select('*').match(active).order('sort_order', { ascending: true })
  ]);

  const err = [settings.error, memories.error, letters.error, cards.error, quiz.error, plans.error].find(Boolean);
  if (err) throw err;

  return {
    memories: memories.data || [],
    letters: letters.data || [],
    memory_cards: cards.data || [],
    quiz_questions: quiz.data || [],
    plans: plans.data || [],
    site_settings: settings.data || null,
    unlocked,
    preview: previewMode,
    unlockIso: getUnlockIso()
  };
}

async function getLockedSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await getSupabaseAdmin()
      .from('site_settings')
      .select('id,music_url,updated_at')
      .eq('id', 'main')
      .maybeSingle();
    if (settings.error || !settings.data) return null;

    return {
      id: settings.data.id || 'main',
      birthday_message: null,
      final_message: null,
      music_url: settings.data.music_url || null,
      updated_at: settings.data.updated_at || new Date(0).toISOString()
    };
  } catch {
    return null;
  }
}
