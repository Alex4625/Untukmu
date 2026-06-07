import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { isAllowedResource } from '@/lib/resource';

export async function POST(request: Request, { params }: { params: { resource: string } }) {
  if (!isAdminRequest()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAllowedResource(params.resource)) return NextResponse.json({ error: 'Resource tidak valid.' }, { status: 400 });
  const body = await request.json();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from(params.resource).insert(body).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
