import { NextResponse } from 'next/server';

import { getAuthUser, isAdmin } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';

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

export async function GET() {
  const supabase = await createClient();
  const user = await getAuthUser(supabase);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await isAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }

  try {
    const response = await fetch(
      `${getFastApiBaseUrl()}/training/status?admin_key=${encodeURIComponent(getMlAdminKey())}`,
      {
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      },
    );

    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to load ML status',
      },
      { status: 503 },
    );
  }
}
