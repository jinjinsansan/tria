'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    throw new Error('Not authorized');
  }

  return supabase;
}

export async function toggleAdminAction(formData: FormData) {
  try {
    const supabase = await requireAdmin();
    const targetId = formData.get('user_id');
    const makeAdmin = formData.get('make_admin') === 'true';

    if (!targetId || typeof targetId !== 'string') return;

    await supabase.from('users').update({ is_admin: makeAdmin }).eq('id', targetId);
    revalidatePath('/admin/users');
  } catch (error) {
    console.error(error);
  }
}

export async function adjustContributionAction(formData: FormData) {
  try {
    const supabase = await requireAdmin();
    const targetId = formData.get('user_id');
    const pointsRaw = formData.get('points');

    if (!targetId || typeof targetId !== 'string') return;
    const points = Number(pointsRaw);
    if (Number.isNaN(points)) return;

    await supabase.rpc('add_contribution_points', {
      p_user_id: targetId,
      p_action: points >= 0 ? 'manual_adjust_add' : 'manual_adjust_sub',
      p_points: points,
      p_description: 'Admin manual adjustment',
    });

    revalidatePath('/admin/users');
  } catch (error) {
    console.error(error);
  }
}
