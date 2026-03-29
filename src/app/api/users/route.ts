import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser, isAdmin } from '@/lib/auth-helpers';

/**
 * GET /api/users — List users (admin only)
 * Query params: role, status, search, limit, offset
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

  const role = searchParams.get('role');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabase
    .from('profiles')
    .select(`
      *,
      region:regions!region_id(id, name_mm)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (role) query = query.eq('role', role);
  if (status === 'active') query = query.eq('is_active', true);
  if (status === 'suspended') query = query.eq('is_active', false);
  if (status === 'flagged') query = query.eq('trust_level', 'flagged');
  if (search) query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}
