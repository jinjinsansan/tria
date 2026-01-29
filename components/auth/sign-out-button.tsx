'use client';

import { signOutAction } from '@/app/actions/auth';
import { Button, type ButtonProps } from '@/components/ui/button';

interface SignOutButtonProps extends ButtonProps {}

export function SignOutButton({ className, variant = 'ghost', size = 'sm' }: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant={variant} size={size} className={className}>
        ログアウト
      </Button>
    </form>
  );
}
