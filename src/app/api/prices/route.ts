import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/prices — List price submissions with filters
 * Query params: status, product_id, market_id, region_id, limit, offset
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const status = searchParams.get('status');
  const productId = searchParams.get('product_id');
  const marketId = searchParams.get('market_id');
  const regionId = searchParams.get('region_id');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabase
    .from('price_submissions')
    .select(`
      *,
      merchant:profiles!merchant_id(id, full_name, trust_level),
      product:products!product_id(id, name_mm, category_id),
      market:markets!market_id(id, name_mm, region_id)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);
  if (productId) query = query.eq('product_id', parseInt(productId));
  if (marketId) query = query.eq('market_id', parseInt(marketId));
  if (regionId) query = query.eq('market.region_id', parseInt(regionId));

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}

/**
 * POST /api/prices — Submit a new price
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('price_submissions')
    .insert({
      merchant_id: user.id,
      product_id: body.product_id,
      market_id: body.market_id,
      buy_price: body.buy_price,
      sell_price: body.sell_price,
      unit: body.unit || 'basket',
      quality: body.quality || 'standard',
      frequency: body.frequency || 'daily',
      status: 'pending',
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create audit log entry
  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'price_submitted',
    details: `Price submitted for product ${body.product_id} at market ${body.market_id}`,
  });

  return NextResponse.json({ data }, { status: 201 });
}
