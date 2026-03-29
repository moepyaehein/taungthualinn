import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser, isAdmin } from '@/lib/auth-helpers';

/**
 * GET /api/broadcasts — List broadcasts
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const type = searchParams.get('type');
  const target = searchParams.get('target');
  const limit = parseInt(searchParams.get('limit') || '20');

  let query = supabase
    .from('broadcasts')
    .select(`
      *,
      region:regions!region_id(id, name_mm),
      creator:profiles!created_by(id, full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (type) query = query.eq('type', type);
  if (target) query = query.eq('target', target);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/**
 * POST /api/broadcasts — Create a broadcast (admin only)
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const user = await getAuthUser(supabase);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await isAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('broadcasts')
    .insert({
      type: body.type || 'announcement',
      target: body.target || 'all',
      region_id: body.region_id || null,
      content: body.content,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'broadcast_sent',
    details: `${body.type}: ${body.content.substring(0, 100)}`,
  });

  return NextResponse.json({ data }, { status: 201 });
}
