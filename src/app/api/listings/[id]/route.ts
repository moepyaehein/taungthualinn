import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/listings/[id] — Update a listing (status, pause, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;
  const body = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updates: Record<string, unknown> = {};
  if (body.status) updates.status = body.status;
  if (body.quantity) updates.quantity = body.quantity;
  if (body.target_price) updates.target_price = body.target_price;
  if (body.pickup_available !== undefined) updates.pickup_available = body.pickup_available;

  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', parseInt(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/**
 * DELETE /api/listings/[id] — Remove a listing
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', parseInt(id))
    .eq('merchant_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
