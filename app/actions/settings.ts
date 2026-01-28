'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { isValidTriaUrl } from '@/lib/utils';

export type SettingsFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<'tria_referral_url', string>>;
};

export const initialSettingsState: SettingsFormState = { ok: true };

export async function updateReferralSettingsAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: 'ログインが必要です' };
  }

  const triaReferralUrl = (formData.get('tria_referral_url') as string | null)?.trim();

  if (!triaReferralUrl) {
    return {
      ok: false,
      fieldErrors: { tria_referral_url: 'tria紹介URLを入力してください' },
    };
  }

  if (!isValidTriaUrl(triaReferralUrl)) {
    return {
      ok: false,
      fieldErrors: { tria_referral_url: 'tria関連のURLを入力してください' },
    };
  }

  const { error } = await supabase
    .from('users')
    .update({ tria_referral_url: triaReferralUrl })
    .eq('id', user.id);

  if (error) {
    return { ok: false, message: '更新に失敗しました。時間をおいて再度お試しください。' };
  }

  revalidatePath('/settings');
  return { ok: true, message: '保存しました' };
}
