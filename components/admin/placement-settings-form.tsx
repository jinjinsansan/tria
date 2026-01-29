'use client';

import { useFormState } from 'react-dom';

import { initialSettingsState, updatePlacementSettingsAction } from '@/app/actions/admin-settings';
import { buttonVariants } from '@/components/ui/button';

interface PlacementSettingsFormProps {
  defaultRatio: number;
}

export function PlacementSettingsForm({ defaultRatio }: PlacementSettingsFormProps) {
  const [state, formAction] = useFormState(updatePlacementSettingsAction, initialSettingsState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="admin_ratio" className="text-sm text-muted-foreground">
          管理者への自動配分比率（0〜1）
        </label>
        <input
          id="admin_ratio"
          type="number"
          name="admin_ratio"
          step="0.05"
          min="0"
          max="1"
          defaultValue={defaultRatio}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          オートプレースメント時に管理者へ割り当てられる確率を指定します。
        </p>
      </div>
      {state.message ? (
        <p className={`text-sm ${state.ok ? 'text-primary' : 'text-red-400'}`}>{state.message}</p>
      ) : null}
      <button type="submit" className={buttonVariants({ variant: 'gradient' })}>
        更新する
      </button>
    </form>
  );
}
