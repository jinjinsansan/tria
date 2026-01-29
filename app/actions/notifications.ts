'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

async function getUserContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  return { supabase, userId: user.id };
}

export async function markNotificationReadAction(formData: FormData) {
  try {
    const { supabase, userId } = await getUserContext();
    const notificationId = formData.get('notification_id');
    if (!notificationId || typeof notificationId !== 'string') return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    revalidatePath('/notifications');
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error(error);
  }
}

export async function markAllNotificationsReadAction() {
  try {
    const { supabase, userId } = await getUserContext();
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    revalidatePath('/notifications');
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error(error);
  }
}
