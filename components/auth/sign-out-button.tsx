'use client';

import { useTransition } from 'react';

import { signOutAction } from '@/app/actions/auth';
import { Button, type ButtonProps } from '@/components/ui/button';

interface SignOutButtonProps extends ButtonProps {}

export function SignOutButton({ className, variant = 'ghost', size = 'sm' }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      variant={variant}
      size={size}
      className={className}
      disabled={isPending}
    >
      {isPending ? 'ログアウト中…' : 'ログアウト'}
    </Button>
  );
}
