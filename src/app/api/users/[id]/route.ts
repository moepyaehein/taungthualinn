import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser, isAdmin } from '@/lib/auth-helpers';

/**
 * PATCH /api/users/[id] — Update user status (admin only)
 * Body: { is_active?, trust_level?, role? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;
  const body = await request.json();

  const user = await getAuthUser(supabase);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await isAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updates: Record<string, unknown> = {};
  if (body.is_active !== undefined) updates.is_active = body.is_active;
  if (body.trust_level) updates.trust_level = body.trust_level;
  if (body.role) updates.role = body.role;

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'user_updated',
    details: `User ${id} updated: ${JSON.stringify(updates)}`,
  });

  return NextResponse.json({ data });
}
