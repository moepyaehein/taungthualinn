import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/dashboard/admin — Admin dashboard aggregates
 */
export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parallel queries for dashboard stats
  const [
    pendingPrices,
    flaggedPrices,
    activeMerchants,
    activeFarmers,
    recentActivity,
    activeEmergencies,
  ] = await Promise.all([
    supabase
      .from('price_submissions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'peer_verified']),
    supabase
      .from('price_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'flagged'),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'merchant')
      .eq('is_active', true),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'farmer')
      .eq('is_active', true),
    supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('emergencies')
      .select('*, region:regions!region_id(id, name_mm)')
      .eq('is_active', true),
  ]);

  return NextResponse.json({
    stats: {
      pending_verifications: pendingPrices.count || 0,
      flagged_prices: flaggedPrices.count || 0,
      active_merchants: activeMerchants.count || 0,
      active_farmers: activeFarmers.count || 0,
    },
    recent_activity: recentActivity.data || [],
    active_emergencies: activeEmergencies.data || [],
  });
}
