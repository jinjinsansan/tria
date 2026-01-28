import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

import { createAdminClient, createClient } from '@/lib/supabase/server';

const DEFAULT_TRIA_URL = process.env.NEXT_PUBLIC_TRIA_REDIRECT_URL ?? 'https://app.tria.so';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const ref = url.searchParams.get('ref');
  const source = url.searchParams.get('source');
  const utmSource = url.searchParams.get('utm_source');
  const utmMedium = url.searchParams.get('utm_medium');
  const utmCampaign = url.searchParams.get('utm_campaign');

  const supabase = await createClient();

  const cookieStore = await cookies();
  let visitorId = cookieStore.get('organic_visitor_id')?.value;
  let shouldSetCookie = false;

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    shouldSetCookie = true;
  }

  if (ref) {
    const { data: refUser } = await supabase
      .from('users')
      .select('tria_referral_url')
      .eq('referral_code', ref.toUpperCase())
      .maybeSingle();

    const redirectUrl = refUser?.tria_referral_url ?? DEFAULT_TRIA_URL;
    const response = NextResponse.redirect(redirectUrl.startsWith('http') ? redirectUrl : DEFAULT_TRIA_URL);
    if (shouldSetCookie && visitorId) {
      response.cookies.set('organic_visitor_id', visitorId, {
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return response;
  }

  const adminClient = await createAdminClient();

  const { data: queueRecord } = await adminClient
    .from('organic_queue')
    .insert({
      visitor_id: visitorId,
      source: source ?? 'organic',
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
    })
    .select('id')
    .single();

  let assignedUserId: string | null = null;

  if (queueRecord?.id) {
    const { data: assigned } = await adminClient.rpc('execute_auto_placement', {
      p_queue_id: queueRecord.id,
    });
    if (assigned) {
      assignedUserId = assigned as string;
    }
  }

  let redirectTarget = DEFAULT_TRIA_URL;

  if (assignedUserId) {
    const { data: assignedUser } = await adminClient
      .from('users')
      .select('tria_referral_url')
      .eq('id', assignedUserId)
      .maybeSingle();

    if (assignedUser?.tria_referral_url) {
      redirectTarget = assignedUser.tria_referral_url;
    }
  }

  const safeRedirect = redirectTarget.startsWith('http') ? redirectTarget : DEFAULT_TRIA_URL;
  const response = NextResponse.redirect(safeRedirect);
  if (shouldSetCookie && visitorId) {
    response.cookies.set('organic_visitor_id', visitorId, {
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}
