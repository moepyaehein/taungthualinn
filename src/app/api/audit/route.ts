import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser, isAdmin } from '@/lib/auth-helpers';

/**
 * GET /api/audit — List audit log entries (admin only)
 * Query params: action, user_id, from_date, limit, offset
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const user = await getAuthUser(supabase);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await isAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const action = searchParams.get('action');
  const userId = searchParams.get('user_id');
  const fromDate = searchParams.get('from_date');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabase
    .from('audit_log')
    .select(`
      *,
      user:profiles!user_id(id, full_name, role)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (action) query = query.eq('action', action);
  if (userId) query = query.eq('user_id', userId);
  if (fromDate) query = query.gte('created_at', fromDate);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
