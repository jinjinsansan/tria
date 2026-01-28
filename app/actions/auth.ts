'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createAdminClient, createClient } from '@/lib/supabase/server';

type FieldErrorKey = 'email' | 'password' | 'display_name' | 'referral_code';

export type AuthFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<FieldErrorKey, string>>;
};

export const initialAuthState: AuthFormState = { ok: true };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildValidationErrors(
  values: Partial<Record<FieldErrorKey, string>>
): AuthFormState {
  return {
    ok: false,
    fieldErrors: values,
  };
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const password = (formData.get('password') as string | null)?.trim() ?? '';

  const fieldErrors: Record<string, string> = {};
  if (!email.length) {
    fieldErrors.email = 'メールアドレスを入力してください';
  } else if (!emailRegex.test(email)) {
    fieldErrors.email = '有効なメールアドレスを入力してください';
  }

  if (!password.length) {
    fieldErrors.password = 'パスワードを入力してください';
  }

  if (Object.keys(fieldErrors).length) {
    return buildValidationErrors(fieldErrors);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      ok: false,
      message: 'メールアドレスまたはパスワードが正しくありません',
    };
  }

  revalidatePath('/');
  revalidatePath('/settings');
  redirect('/');
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const password = (formData.get('password') as string | null)?.trim() ?? '';
  const displayName =
    (formData.get('display_name') as string | null)?.trim() ?? '';
  const referralCode =
    (formData.get('referral_code') as string | null)?.trim().toUpperCase() ?? '';

  const fieldErrors: Record<string, string> = {};

  if (!displayName.length) {
    fieldErrors.display_name = '表示名を入力してください';
  }

  if (!email.length) {
    fieldErrors.email = 'メールアドレスを入力してください';
  } else if (!emailRegex.test(email)) {
    fieldErrors.email = '有効なメールアドレスを入力してください';
  }

  if (password.length < 8) {
    fieldErrors.password = '8文字以上のパスワードを設定してください';
  }

  if (Object.keys(fieldErrors).length) {
    return buildValidationErrors(fieldErrors);
  }

  const supabase = await createClient();

  let referrerId: string | null = null;

  if (referralCode.length) {
    const { data: referrer, error: referrerError } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .maybeSingle();

    if (!referrer || referrerError) {
      return buildValidationErrors({
        referral_code: '紹介コードが見つかりません',
      });
    }

    referrerId = referrer.id;
  }

  const emailRedirectTo = `${
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  }/auth/callback`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  if (referrerId && data.user?.id && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const adminClient = await createAdminClient();
      await adminClient
        .from('users')
        .update({ referrer_id: referrerId })
        .eq('id', data.user.id);
    } catch (err) {
      console.error('Failed to attach referrer', err);
    }
  }

  redirect('/login?status=check-email');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/');
  revalidatePath('/settings');
  redirect('/');
}
