'use client';

import { useFormState } from 'react-dom';

import { createArticleAction, initialArticleState } from '@/app/actions/articles';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ARTICLE_CATEGORIES } from '@/lib/constants';

export function ArticleCreateForm() {
  const [state, formAction] = useFormState(createArticleAction, initialArticleState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">タイトル</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">スラッグ</Label>
          <Input id="slug" name="slug" required placeholder="例: tria-wallet-guide" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">カテゴリ</Label>
          <select
            id="category"
            name="category"
            required
            className="w-full rounded-lg border border-border bg-card/70 px-4 py-2 text-sm"
          >
            <option value="">選択してください</option>
            {ARTICLE_CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order_index">並び順</Label>
          <Input id="order_index" name="order_index" type="number" defaultValue="0" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">本文（Markdown）</Label>
        <Textarea id="content" name="content" rows={6} required />
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_published" value="true" /> 公開する
      </label>
      {state.message ? (
        <p className={`text-sm ${state.ok ? 'text-primary' : 'text-red-400'}`}>{state.message}</p>
      ) : null}
      <button type="submit" className={buttonVariants({ variant: 'gradient' })}>
        作成する
      </button>
    </form>
  );
}
