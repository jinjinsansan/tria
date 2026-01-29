'use server';

import { revalidatePath } from 'next/cache';

import { CONTRIBUTION_POINTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

type SettingsActionState = {
  ok: boolean;
  message?: string;
};

export const initialSettingsState: SettingsActionState = { ok: true };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).maybeSingle();

  if (!profile?.is_admin) {
    throw new Error('Not authorized');
  }

  return supabase;
}

export async function updatePlacementSettingsAction(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  try {
    const supabase = await requireAdmin();
    const ratioValue = Number(formData.get('admin_ratio'));

    if (Number.isNaN(ratioValue)) {
      return { ok: false, message: '数値を入力してください。' };
    }

    const adminRatio = Math.min(Math.max(ratioValue, 0), 1);

    const { error } = await supabase.from('settings').upsert(
      { key: 'placement_settings', value: { admin_ratio: adminRatio } },
      { onConflict: 'key' }
    );

    if (error) throw error;

    revalidatePath('/admin/settings');
    revalidatePath('/admin');
    return { ok: true, message: 'プレースメント設定を更新しました。' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: '更新に失敗しました。' };
  }
}

export async function updateContributionSettingsAction(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  try {
    const supabase = await requireAdmin();
    const entries = Object.keys(CONTRIBUTION_POINTS).map((key) => {
      const value = Number(formData.get(key));
      return [key, Number.isNaN(value) ? CONTRIBUTION_POINTS[key as keyof typeof CONTRIBUTION_POINTS] : value];
    });

    const payload = Object.fromEntries(entries);

    const { error } = await supabase.from('settings').upsert(
      { key: 'contribution_points', value: payload },
      { onConflict: 'key' }
    );

    if (error) throw error;

    revalidatePath('/admin/settings');
    return { ok: true, message: '貢献度ポイントを更新しました。' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: '更新に失敗しました。' };
  }
}
