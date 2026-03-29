import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/prices/[id]/verify — Peer-verify or flag a price submission
 * Body: { is_verified: boolean }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id } = await params;
  const body = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Insert peer verification
  const { error: verifyError } = await supabase
    .from('peer_verifications')
    .insert({
      price_submission_id: parseInt(id),
      verifier_id: user.id,
      is_verified: body.is_verified,
    });

  if (verifyError) {
    return NextResponse.json({ error: verifyError.message }, { status: 500 });
  }

  // If flagged, update the submission status
  if (!body.is_verified) {
    await supabase
      .from('price_submissions')
      .update({ status: 'flagged' })
      .eq('id', parseInt(id));
  } else {
    // Check if we have enough peer verifications to auto-verify
    const { count } = await supabase
      .from('peer_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('price_submission_id', parseInt(id))
      .eq('is_verified', true);

    if (count && count >= 2) {
      await supabase
        .from('price_submissions')
        .update({ status: 'peer_verified' })
        .eq('id', parseInt(id));
    }
  }

  // Audit log
  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: body.is_verified ? 'peer_verified' : 'peer_flagged',
    details: `Price #${id} ${body.is_verified ? 'verified' : 'flagged'} by peer`,
  });

  return NextResponse.json({ success: true });
}
