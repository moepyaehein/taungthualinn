import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/regions — List all regions with their markets
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const withMarkets = searchParams.get('with_markets') !== 'false';

  let query;
  if (withMarkets) {
    query = supabase
      .from('regions')
      .select(`
        *,
        markets(id, name_mm, name_en)
      `)
      .order('name_mm');
  } else {
    query = supabase
      .from('regions')
      .select('*')
      .order('name_mm');
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
