import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({
    memories: memories.data || [],
    letters: letters.data || [],
    memory_cards: cards.data || [],
    quiz_questions: quiz.data || [],
    plans: plans.data || [],
    site_settings: settings.data || null
  });
}
