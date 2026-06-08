import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { isAllowedResource, sanitizeContentInput } from '@/lib/resource';

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
  const supabase = getSupabaseAdmin();
  const query =
    resource === 'site_settings'
      ? supabase.from('site_settings').upsert({ ...body, id }, { onConflict: 'id' }).select('*').single()
      : supabase.from(resource).update(body).eq('id', id).select('*').single();
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { resource, id } = await params;
  if (!isAllowedResource(resource)) return NextResponse.json({ error: 'Resource tidak valid.' }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(resource).delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
