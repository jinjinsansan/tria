'use client';

import { useFormState } from 'react-dom';

import { initialSettingsState, updateContributionSettingsAction } from '@/app/actions/admin-settings';
import { buttonVariants } from '@/components/ui/button';

const POINT_FIELDS = [
  { key: 'post_create', label: '質問投稿', description: '新しい質問を投稿した際の基本ポイント' },
  { key: 'comment_create', label: '回答投稿', description: '回答やコメントを投稿した際のポイント' },
  { key: 'best_answer', label: 'ベストアンサー', description: '回答がベストアンサーに選ばれた際の加点' },
  { key: 'like_received', label: 'いいね獲得', description: '投稿や回答にいいねが付いた際の加点' },
  { key: 'daily_login', label: 'デイリーログイン', description: '1日に1回のログインボーナス' },
  { key: 'article_read', label: '記事閲覧', description: '学習コンテンツを読んだ際のポイント' },
  { key: 'sns_share', label: 'SNSシェア', description: 'Xやnoteでの共有完了時のポイント' },
 ] as const;

type ContributionFieldKey = (typeof POINT_FIELDS)[number]['key'];
type ContributionSettings = Record<ContributionFieldKey, number>;

interface ContributionSettingsFormProps {
  defaultValues: ContributionSettings;
}

export function ContributionSettingsForm({ defaultValues }: ContributionSettingsFormProps) {
  const [state, formAction] = useFormState(updateContributionSettingsAction, initialSettingsState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {POINT_FIELDS.map((field) => (
          <div key={field.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label htmlFor={field.key} className="text-sm font-medium text-white">
              {field.label}
            </label>
            <p className="text-xs text-muted-foreground">{field.description}</p>
            <input
              id={field.key}
              type="number"
              name={field.key}
              defaultValue={defaultValues[field.key] ?? 0}
              className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>
      {state.message ? (
        <p className={`text-sm ${state.ok ? 'text-primary' : 'text-red-400'}`}>{state.message}</p>
      ) : null}
      <button type="submit" className={buttonVariants({ variant: 'gradient' })}>
        ポイント設定を更新
      </button>
    </form>
  );
}
