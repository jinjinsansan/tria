'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';

import { initialAuthState, signUpAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignupFormProps {
  defaultReferralCode?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? '登録処理中...' : '登録する'}
    </Button>
  );
}

export function SignupForm({ defaultReferralCode }: SignupFormProps) {
  const [state, formAction] = useFormState(signUpAction, initialAuthState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="display_name">表示名</Label>
        <Input
          id="display_name"
          name="display_name"
          placeholder="tria太郎"
          required
        />
        {state.fieldErrors?.display_name ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.display_name}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        {state.fieldErrors?.email ? (
          <p className="text-sm text-red-400">{state.fieldErrors.email}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">パスワード</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="********"
          required
        />
        <p className="text-xs text-muted-foreground">8文字以上で設定してください。</p>
        {state.fieldErrors?.password ? (
          <p className="text-sm text-red-400">{state.fieldErrors.password}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="referral_code">紹介コード（任意）</Label>
        <Input
          id="referral_code"
          name="referral_code"
          placeholder="TRIA0000"
          defaultValue={defaultReferralCode}
        />
        {state.fieldErrors?.referral_code ? (
          <p className="text-sm text-red-400">
            {state.fieldErrors.referral_code}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        すでにアカウントをお持ちの場合は{' '}
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          ログイン
        </Link>
        
      </p>
    </form>
  );
}
