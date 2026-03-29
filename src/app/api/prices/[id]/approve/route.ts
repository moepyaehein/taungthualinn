import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser, isAdmin } from '@/lib/auth-helpers';

/**
 * PATCH /api/prices/[id]/approve — Admin approve or reject a price
 * Body: { action: 'approve' | 'reject' }
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
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }

  const newStatus = body.action === 'approve' ? 'admin_verified' : 'rejected';

  const { data, error } = await supabase
    .from('price_submissions')
    .update({ status: newStatus })
    .eq('id', parseInt(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: body.action === 'approve' ? 'price_verified' : 'price_rejected',
    details: `Price #${id} ${body.action === 'approve' ? 'approved' : 'rejected'} by admin`,
  });

  if (data) {
    await supabase.from('notifications').insert({
      user_id: (data as { merchant_id: string }).merchant_id,
      title: body.action === 'approve' ? 'စျေးအတည်ပြုပြီး' : 'စျေးပယ်ချပြီး',
      body: `သင့်စျေးနှုန်း #${id} ကို Admin ${body.action === 'approve' ? 'အတည်ပြု' : 'ပယ်ချ'}ပြီးပါပြီ။`,
      type: 'price',
      is_read: false,
    });
  }

  return NextResponse.json({ data });
}
