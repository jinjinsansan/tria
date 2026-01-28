'use client';

import { useFormState, useFormStatus } from 'react-dom';

import {
  initialSettingsState,
  updateReferralSettingsAction,
} from '@/app/actions/settings';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ReferralFormProps {
  defaultValue?: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={buttonVariants({ variant: 'gradient' })}
      disabled={pending}
    >
      {pending ? '保存中...' : '保存する'}
    </button>
  );
}

export function ReferralForm({ defaultValue }: ReferralFormProps) {
  const [state, formAction] = useFormState(updateReferralSettingsAction, initialSettingsState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tria_referral_url">tria公式紹介URL</Label>
        <Input
          id="tria_referral_url"
          name="tria_referral_url"
          defaultValue={defaultValue ?? ''}
          placeholder="https://app.tria.so/r/xxxx"
          required
        />
        {state.fieldErrors?.tria_referral_url ? (
          <p className="text-sm text-red-400">{state.fieldErrors.tria_referral_url}</p>
        ) : null}
      </div>

      {state.message ? (
        <p
          className={cn(
            'text-sm',
            state.ok ? 'text-primary' : 'text-red-400'
          )}
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
