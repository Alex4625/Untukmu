import { getSupabaseAdmin } from './supabaseAdmin';
import { getUnlockIso, isUnlockedNow } from './date';
import type { PublicContent, SiteSettings } from './types';

export async function getPublicContent(preview = false): Promise<PublicContent> {
  const supabase = getSupabaseAdmin();
  const unlocked = preview || isUnlockedNow();
  const settings = await supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle();
  if (settings.error) throw settings.error;

  if (!unlocked) {
    return {
      memories: [],
      letters: [],
      memory_cards: [],
      quiz_questions: [],
      plans: [],
      site_settings: settings.data ? lockedSettings(settings.data) : null,
      unlocked: false,
      unlockIso: getUnlockIso()
    };
  }

  const active = { status: 'active' };
  const [memories, letters, cards, quiz, plans] = await Promise.all([
    supabase.from('memories').select('*').match(active).order('memory_date', { ascending: true }),
    supabase.from('letters').select('*').match(active).order('created_at', { ascending: true }),
    supabase.from('memory_cards').select('*').match(active).order('sort_order', { ascending: true }),
    supabase.from('quiz_questions').select('*').match(active).order('sort_order', { ascending: true }),
    supabase.from('plans').select('*').match(active).order('sort_order', { ascending: true })
  ]);

  const err = [memories.error, letters.error, cards.error, quiz.error, plans.error].find(Boolean);
  if (err) throw err;

  return {
    memories: memories.data || [],
    letters: letters.data || [],
    memory_cards: cards.data || [],
    quiz_questions: quiz.data || [],
    plans: plans.data || [],
    site_settings: settings.data || null,
    unlocked,
    unlockIso: getUnlockIso()
  };
}

function lockedSettings(settings: SiteSettings): SiteSettings {
  return {
    ...settings,
    birthday_message: null,
    final_message: null
  };
}
