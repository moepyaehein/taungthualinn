import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/prices/bulk — Process a bulk CSV upload of prices
 * Body: { rows: Array<{ category, product, market, buy_price, sell_price }>, filename: string }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows: Array<{
    product_id: number;
    market_id: number;
    buy_price: number;
    sell_price: number;
    unit?: string;
  }> = body.rows || [];

  let errorCount = 0;
  const successRows: typeof rows = [];

  for (const row of rows) {
    if (!row.product_id || !row.market_id || !row.buy_price || !row.sell_price) {
      errorCount++;
      continue;
    }
    if (row.buy_price <= 0 || row.sell_price <= 0 || row.sell_price < row.buy_price) {
      errorCount++;
      continue;
    }
    successRows.push(row);
  }

  // Record the bulk upload
  const { data: upload, error: uploadError } = await supabase
    .from('bulk_uploads')
    .insert({
      merchant_id: user.id,
      filename: body.filename || 'upload.csv',
      row_count: rows.length,
      error_count: errorCount,
      status: 'pending',
    })
    .select()
    .single();

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Insert valid price submissions
  if (successRows.length > 0) {
    const priceInserts = successRows.map((row) => ({
      merchant_id: user.id,
      product_id: row.product_id,
      market_id: row.market_id,
      buy_price: row.buy_price,
      sell_price: row.sell_price,
      unit: (row.unit as 'basket' | 'viss' | 'ton') || 'basket',
      quality: 'standard' as const,
      frequency: 'daily' as const,
      status: 'pending' as const,
      notes: `Bulk upload: ${body.filename}`,
    }));

    await supabase.from('price_submissions').insert(priceInserts);
  }

  return NextResponse.json({
    data: upload,
    summary: {
      total: rows.length,
      success: successRows.length,
      errors: errorCount,
    },
  }, { status: 201 });
}
