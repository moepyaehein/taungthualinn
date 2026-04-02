import { NextRequest, NextResponse } from 'next/server';

import { getAuthUser, isAdmin } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';

async function parseProxyResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    const normalized = text.replace(/\s+/g, ' ').trim();
    return {
      error: normalized.startsWith('<')
        ? 'ML service returned an HTML error page. It may still be waking up on Render.'
        : normalized.slice(0, 200),
    };
  }
}

function getFastApiBaseUrl() {
  const configured = process.env.FASTAPI_BASE_URL?.trim();
  if (!configured) {
    throw new Error('FASTAPI_BASE_URL is not configured.');
  }
  return configured.replace(/\/$/, '');
}

function getMlAdminKey() {
  const configured = process.env.ML_ADMIN_KEY?.trim();
  if (!configured) {
    throw new Error('ML_ADMIN_KEY is not configured.');
  }
  return configured;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const user = await getAuthUser(supabase);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await isAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const includePendingDemo = Boolean(body.include_pending_demo);

  try {
    const response = await fetch(
      `${getFastApiBaseUrl()}/retrain?admin_key=${encodeURIComponent(getMlAdminKey())}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ include_pending_demo: includePendingDemo }),
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      },
    );

    const payload = await parseProxyResponse(response);
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to start retraining',
      },
      { status: 503 },
    );
  }
}
