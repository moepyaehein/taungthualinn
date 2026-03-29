import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/notifications — List user's notifications
 * Query params: unread_only, limit
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const unreadOnly = searchParams.get('unread_only') === 'true';
  const limit = parseInt(searchParams.get('limit') || '30');

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) query = query.eq('is_read', false);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Count unread
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  return NextResponse.json({
    data,
    unread_count: unreadCount || 0,
  });
}

/**
 * PATCH /api/notifications — Mark notifications as read
 * Body: { ids: number[] } or { mark_all: true }
 */
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (body.mark_all) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (body.ids && Array.isArray(body.ids)) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', body.ids)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
