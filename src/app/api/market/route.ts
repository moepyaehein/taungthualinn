import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runRecommendationPrediction } from '@/lib/recommendation/server';

/**
 * GET /api/market — Aggregated market prices with filters
 * Query params: product_id, region_id, market_id, category_id
 * Returns latest verified prices grouped by market
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mode = searchParams.get('mode');

  if (mode === 'recommendation') {
    const role = searchParams.get('role');
    const crop = searchParams.get('crop');
    const region = searchParams.get('region');
    const market = searchParams.get('market') || undefined;
    const quality = searchParams.get('quality') || undefined;
    const unit = searchParams.get('unit') || undefined;

    if ((role !== 'farmer' && role !== 'merchant') || !crop || !region) {
      return NextResponse.json(
        { error: 'Missing or invalid recommendation params: role, crop, region' },
        { status: 400 },
      );
    }

    try {
      const data = await runRecommendationPrediction({
        role,
        crop,
        region,
        market,
        quality,
        unit,
      });

      return NextResponse.json({ data });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Prediction failed';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const supabase = await createClient();

  const productId = searchParams.get('product_id');
  const regionId = searchParams.get('region_id');
  const marketId = searchParams.get('market_id');
  const categoryId = searchParams.get('category_id');

  // Get latest verified prices per market for the given product
  let query = supabase
    .from('price_submissions')
    .select(`
      id, buy_price, sell_price, created_at, status, comparison_label,
      product:products!product_id(id, name_mm, category_id),
      market:markets!market_id(id, name_mm, region_id, region:regions!region_id(id, name_mm))
    `)
    .in('status', ['admin_verified', 'peer_verified'])
    .order('created_at', { ascending: false });

  if (productId) query = query.eq('product_id', parseInt(productId));
  if (marketId) query = query.eq('market_id', parseInt(marketId));
  if (regionId) query = query.eq('market.region_id', parseInt(regionId));

  const { data: prices, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Filter by category if needed (post-query since it's a nested field)
  let filtered = prices || [];
  if (categoryId) {
    filtered = filtered.filter(
      (p) => p.product && typeof p.product === 'object' && 'category_id' in p.product && p.product.category_id === parseInt(categoryId),
    );
  }

  // Group by market, take latest per market
  const latestByMarket = new Map<number, typeof filtered[0]>();
  for (const price of filtered) {
    if (price.market && typeof price.market === 'object' && 'id' in price.market) {
      const mktId = price.market.id as number;
      if (!latestByMarket.has(mktId)) {
        latestByMarket.set(mktId, price);
      }
    }
  }

  return NextResponse.json({
    data: Array.from(latestByMarket.values()),
  });
}
