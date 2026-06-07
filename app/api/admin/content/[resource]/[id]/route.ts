import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { isAllowedResource } from '@/lib/resource';

export async function PUT(request: Request, { params }: { params: { resource: string; id: string } }) {
  if (!isAdminRequest()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAllowedResource(params.resource)) return NextResponse.json({ error: 'Resource tidak valid.' }, { status: 400 });
  const body = await request.json();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from(params.resource).update(body).eq('id', params.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: { resource: string; id: string } }) {
  if (!isAdminRequest()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isAllowedResource(params.resource)) return NextResponse.json({ error: 'Resource tidak valid.' }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(params.resource).delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
