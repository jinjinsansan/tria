'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export async function assignQueueItemAction(formData: FormData) {
  const queueId = formData.get('queue_id');
  if (!queueId || typeof queueId !== 'string') {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data: userRecord } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!userRecord?.is_admin) {
    return;
  }

  await supabase.rpc('execute_auto_placement', {
    p_queue_id: queueId,
  });

  revalidatePath('/admin/queue');
  revalidatePath('/feed');
}
