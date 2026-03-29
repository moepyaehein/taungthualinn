import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/emergencies/[id]/respond — Merchant responds to emergency
 * Body: { product_id, quantity, price, location, pickup_available }
 */
export async function POST(
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

  // Get the emergency details
  const { data: emergency } = await supabase
    .from('emergencies')
    .select('*')
    .eq('id', parseInt(id))
    .single();

  if (!emergency) {
    return NextResponse.json({ error: 'Emergency not found' }, { status: 404 });
  }

  // Create an emergency listing
  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      merchant_id: user.id,
      type: 'buy',
      product_id: body.product_id,
      quantity: body.quantity,
      quantity_unit: 'တင်း',
      target_price: body.price,
      region_id: emergency.region_id,
      availability: 'immediate',
      is_emergency: true,
      pickup_available: body.pickup_available ?? true,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'emergency_response',
    details: `Merchant responded to emergency #${id} with buy offer`,
  });

  return NextResponse.json({ data: listing }, { status: 201 });
}
