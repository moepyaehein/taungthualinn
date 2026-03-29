import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/dashboard/farmer — Farmer dashboard data
 */
export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, region:regions!region_id(id, name_mm)')
    .eq('id', user.id)
    .single();

  // Get latest prices for common products in farmer's region
  const [latestPrices, emergencies, notifications, records] = await Promise.all([
    supabase
      .from('price_submissions')
      .select('sell_price, product:products!product_id(id, name_mm), market:markets!market_id(id, name_mm)')
      .in('status', ['admin_verified', 'peer_verified'])
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('emergencies')
      .select('*, region:regions!region_id(id, name_mm)')
      .eq('is_active', true)
      .limit(3),
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('farmer_records')
      .select('*, product:products!product_id(id, name_mm)')
      .eq('farmer_id', user.id)
      .order('sale_date', { ascending: false })
      .limit(5),
  ]);

  return NextResponse.json({
    profile,
    latest_prices: latestPrices.data || [],
    emergencies: emergencies.data || [],
    unread_notifications: notifications.data || [],
    recent_records: records.data || [],
  });
}
