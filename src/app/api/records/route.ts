import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/records — List farmer's sale records
 * Query params: product_id, limit, offset
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const productId = searchParams.get('product_id');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabase
    .from('farmer_records')
    .select(`
      *,
      product:products!product_id(id, name_mm)
    `)
    .eq('farmer_id', user.id)
    .order('sale_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (productId) query = query.eq('product_id', parseInt(productId));

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Compute summary stats
  const totalSold = data?.reduce((sum, r) => sum + (r.harvest_qty || 0) - (r.storage_qty || 0), 0) || 0;
  const totalRevenue = data?.reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0;
  const avgPrice = data && data.length > 0
    ? data.reduce((sum, r) => sum + (r.sale_price || 0), 0) / data.length
    : 0;

  return NextResponse.json({
    data,
    summary: {
      total_sold: totalSold,
      total_revenue: totalRevenue,
      avg_price: Math.round(avgPrice),
      record_count: data?.length || 0,
    },
  });
}

/**
 * POST /api/records — Add a new farmer record
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const totalAmount = body.sale_price && body.harvest_qty
    ? body.sale_price * (body.harvest_qty - (body.storage_qty || 0))
    : null;

  const { data, error } = await supabase
    .from('farmer_records')
    .insert({
      farmer_id: user.id,
      product_id: body.product_id,
      harvest_qty: body.harvest_qty || null,
      storage_qty: body.storage_qty || null,
      sale_date: body.sale_date || null,
      sale_price: body.sale_price || null,
      total_amount: totalAmount,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
