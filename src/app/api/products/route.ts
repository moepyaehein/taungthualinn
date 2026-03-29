import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/products — List products
 * Query params: category_id
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const categoryId = searchParams.get('category_id');

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories!category_id(id, name_mm)
    `)
    .order('sort_order');

  if (categoryId) query = query.eq('category_id', parseInt(categoryId));

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
