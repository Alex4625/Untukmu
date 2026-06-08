import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { isAllowedResource, sanitizeContentInput } from '@/lib/resource';
import { formatSupabaseMutationError, getSupabaseWriteAccessStatus } from '@/lib/supabaseWriteAccess';

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { resource } = await params;
  if (!isAllowedResource(resource)) return NextResponse.json({ error: 'Resource tidak valid.' }, { status: 400 });
  const json = await request.json().catch(() => null);
  let body: Record<string, unknown>;
  try {
    body = sanitizeContentInput(resource, json, 'create');
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Body tidak valid.' }, { status: 400 });
  }
  const writeAccess = getSupabaseWriteAccessStatus();
  if (!writeAccess.ok) return NextResponse.json({ error: writeAccess.detail }, { status: 503 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from(resource).insert(body).select('*').single();
  if (error) return NextResponse.json({ error: formatSupabaseMutationError(error.message) }, { status: 500 });
  return NextResponse.json(data);
}
