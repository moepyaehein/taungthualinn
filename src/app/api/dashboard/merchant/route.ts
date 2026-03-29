import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/dashboard/merchant — Merchant dashboard data
 */
export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [
    todaySubmissions,
    pendingVerifications,
    verifiedThisWeek,
    emergencyRequests,
    myListings,
    notifications,
  ] = await Promise.all([
    // Today's price submissions
    supabase
      .from('price_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('merchant_id', user.id)
      .gte('created_at', new Date().toISOString().substring(0, 10)),
    // Pending verifications for peer review
    supabase
      .from('price_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .neq('merchant_id', user.id),
    // Verified this week
    supabase
      .from('price_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('merchant_id', user.id)
      .eq('status', 'admin_verified')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()),
    // Emergency requests
    supabase
      .from('emergencies')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    // My active listings
    supabase
      .from('listings')
      .select('*, product:products!product_id(id, name_mm), region:regions!region_id(id, name_mm)')
      .eq('merchant_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5),
    // Unread notifications
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return NextResponse.json({
    stats: {
      today_submissions: todaySubmissions.count || 0,
      pending_peer_review: pendingVerifications.count || 0,
      verified_this_week: verifiedThisWeek.count || 0,
      emergency_requests: emergencyRequests.count || 0,
    },
    my_listings: myListings.data || [],
    unread_notifications: notifications.data || [],
  });
}
