import { getSupabaseAdmin } from './supabaseAdmin';
import type { PublicContent } from './types';

export type AdminContent = Omit<PublicContent, 'unlocked' | 'unlockIso' | 'preview'>;

export async function getAdminContent(): Promise<AdminContent> {
  const supabase = getSupabaseAdmin();
  const [memories, letters, cards, quiz, plans, settings] = await Promise.all([
    supabase.from('memories').select('*').order('created_at', { ascending: false }),
    supabase.from('letters').select('*').order('created_at', { ascending: false }),
    supabase.from('memory_cards').select('*').order('sort_order', { ascending: true }),
    supabase.from('quiz_questions').select('*').order('sort_order', { ascending: true }),
    supabase.from('plans').select('*').order('sort_order', { ascending: true }),
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
    site_settings: settings.data || null
  };
}
