import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser, isAdmin } from '@/lib/auth-helpers';

/**
 * GET /api/emergencies — List active emergencies
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const regionId = searchParams.get('region_id');
  const isActive = searchParams.get('is_active');

  let query = supabase
    .from('emergencies')
    .select(`
      *,
      region:regions!region_id(id, name_mm)
    `)
    .order('created_at', { ascending: false });

  if (regionId) query = query.eq('region_id', parseInt(regionId));
  if (isActive !== null) query = query.eq('is_active', isActive !== 'false');

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/**
 * POST /api/emergencies — Create an emergency alert (admin only)
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const user = await getAuthUser(supabase);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await isAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('emergencies')
    .insert({
      title: body.title,
      description: body.description,
      region_id: body.region_id,
      risk_level: body.risk_level || 'medium',
      affected_farmers: body.affected_farmers || 0,
      affected_merchants: body.affected_merchants || 0,
      crop_damage_estimate: body.crop_damage_estimate || null,
      is_active: true,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from('broadcasts').insert({
    type: 'emergency',
    target: 'all',
    region_id: body.region_id,
    content: `အရေးပေါ်: ${body.title} — ${body.description}`,
    created_by: user.id,
  });

  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'emergency_created',
    details: `Emergency: ${body.title} (${body.risk_level})`,
  });

  return NextResponse.json({ data }, { status: 201 });
}
