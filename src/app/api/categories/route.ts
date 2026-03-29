import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser, isAdmin } from '@/lib/auth-helpers';

/**
 * GET /api/categories — List all categories with products
 */
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      products(id, name_mm, name_en, sort_order)
    `)
    .order('sort_order');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/**
 * POST /api/categories — Create a new category (admin only)
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const user = await getAuthUser(supabase);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await isAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name_mm: body.name_mm,
      name_en: body.name_en || null,
      sort_order: body.sort_order || 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

/**
 * PATCH /api/categories — Update a category (admin only)
 */
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const user = await getAuthUser(supabase);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await isAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updates: Record<string, unknown> = {};
  if (body.name_mm) updates.name_mm = body.name_mm;
  if (body.name_en !== undefined) updates.name_en = body.name_en;
  if (body.sort_order !== undefined) updates.sort_order = body.sort_order;

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
