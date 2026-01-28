'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';

import { signInAction, initialAuthState } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'ログイン中...' : 'ログイン'}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(signInAction, initialAuthState);

  return (
    <form action={formAction} className="space-y-6">
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
          autoComplete="current-password"
          placeholder="********"
          required
        />
        {state.fieldErrors?.password ? (
          <p className="text-sm text-red-400">{state.fieldErrors.password}</p>
        ) : null}
      </div>

      {state.message ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        アカウントをお持ちでない方は{' '}
        <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
          新規登録
        </Link>
        
      </p>
    </form>
  );
}
