import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/listings — List buy/sell offers
 * Query params: type, product_id, region_id, status, is_emergency, limit, offset
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const type = searchParams.get('type');
  const productId = searchParams.get('product_id');
  const regionId = searchParams.get('region_id');
  const status = searchParams.get('status');
  const isEmergency = searchParams.get('is_emergency');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabase
    .from('listings')
    .select(`
      *,
      merchant:profiles!merchant_id(id, full_name),
      product:products!product_id(id, name_mm),
      region:regions!region_id(id, name_mm)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (type) query = query.eq('type', type);
  if (productId) query = query.eq('product_id', parseInt(productId));
  if (regionId) query = query.eq('region_id', parseInt(regionId));
  if (status) query = query.eq('status', status);
  if (isEmergency === 'true') query = query.eq('is_emergency', true);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/**
 * POST /api/listings — Create a new listing
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('listings')
    .insert({
      merchant_id: user.id,
      type: body.type,
      product_id: body.product_id,
      quantity: body.quantity,
      quantity_unit: body.quantity_unit || 'တင်း',
      target_price: body.target_price,
      region_id: body.region_id,
      availability: body.availability || 'immediate',
      is_emergency: body.is_emergency || false,
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
    action: 'listing_created',
    details: `${body.type} listing for product ${body.product_id}, qty ${body.quantity}`,
  });

  return NextResponse.json({ data }, { status: 201 });
}
