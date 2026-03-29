import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/market/chart — Time-series price data for charts
 * Query params: product_id, market_id, days (7/30/90)
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const productId = searchParams.get('product_id') || '1';
  const marketId = searchParams.get('market_id') || '1';
  const days = parseInt(searchParams.get('days') || '7');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('price_submissions')
    .select('sell_price, buy_price, created_at')
    .eq('product_id', parseInt(productId))
    .eq('market_id', parseInt(marketId))
    .in('status', ['admin_verified', 'peer_verified'])
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Format for charting — group by day, take latest per day
  const byDay = new Map<string, { date: string; sell_price: number; buy_price: number }>();
  for (const row of data || []) {
    const day = row.created_at.substring(0, 10);
    byDay.set(day, {
      date: day,
      sell_price: row.sell_price,
      buy_price: row.buy_price,
    });
  }

  const chartData = Array.from(byDay.values()).sort(
    (a, b) => a.date.localeCompare(b.date),
  );

  // Compute stats
  const prices = chartData.map((d) => d.sell_price);
  const stats = {
    current: prices[prices.length - 1] || 0,
    high: Math.max(...prices, 0),
    low: Math.min(...(prices.length ? prices : [0])),
    change: prices.length >= 2
      ? ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100
      : 0,
  };

  return NextResponse.json({ data: chartData, stats });
}
