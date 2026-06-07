import { getSupabaseAdmin } from './supabaseAdmin';
import { getUnlockIso, isUnlockedNow } from './date';
import type { PublicContent } from './types';

export async function getPublicContent(preview = false): Promise<PublicContent> {
  const supabase = getSupabaseAdmin();
  const unlocked = preview || isUnlockedNow();

  if (!unlocked) {
    return {
      memories: [],
      letters: [],
      memory_cards: [],
      quiz_questions: [],
      plans: [],
      site_settings: null,
      unlocked: false,
      unlockIso: getUnlockIso()
    };
  }

  const active = { status: 'active' };
  const [memories, letters, cards, quiz, plans, settings] = await Promise.all([
    supabase.from('memories').select('*').match(active).order('memory_date', { ascending: true }),
    supabase.from('letters').select('*').match(active).order('created_at', { ascending: true }),
    supabase.from('memory_cards').select('*').match(active).order('sort_order', { ascending: true }),
    supabase.from('quiz_questions').select('*').match(active).order('sort_order', { ascending: true }),
    supabase.from('plans').select('*').match(active).order('sort_order', { ascending: true }),
    supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle()
  ]);

  const err = [memories.error, letters.error, cards.error, quiz.error, plans.error, settings.error].find(Boolean);
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
