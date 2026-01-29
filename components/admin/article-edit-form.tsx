'use client';

import { useFormState } from 'react-dom';

import { deleteArticleAction, initialArticleState, updateArticleAction } from '@/app/actions/articles';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import type { Article } from '@/types';

interface ArticleEditFormProps {
  article: Article;
}

export function ArticleEditForm({ article }: ArticleEditFormProps) {
  const [state, formAction] = useFormState(updateArticleAction, initialArticleState);

  return (
    <details className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <summary className="cursor-pointer text-white">{article.title}</summary>
      <div className="mt-4 space-y-4 text-sm text-muted-foreground">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="article_id" value={article.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`title-${article.id}`}>タイトル</Label>
              <Input id={`title-${article.id}`} name="title" defaultValue={article.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`slug-${article.id}`}>スラッグ</Label>
              <Input id={`slug-${article.id}`} name="slug" defaultValue={article.slug} required />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`category-${article.id}`}>カテゴリ</Label>
              <select
                id={`category-${article.id}`}
                name="category"
                className="w-full rounded-lg border border-border bg-card/70 px-4 py-2 text-sm"
                defaultValue={article.category}
                required
              >
                {ARTICLE_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`order-${article.id}`}>並び順</Label>
              <Input
                id={`order-${article.id}`}
                name="order_index"
                type="number"
                defaultValue={article.order_index ?? 0}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`content-${article.id}`}>本文</Label>
            <Textarea id={`content-${article.id}`} name="content" rows={5} defaultValue={article.content} required />
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_published" value="true" defaultChecked={article.is_published} /> 公開する
          </label>
          {state.message ? (
            <p className={`text-sm ${state.ok ? 'text-primary' : 'text-red-400'}`}>{state.message}</p>
          ) : null}
          <button type="submit" className={buttonVariants({ variant: 'gradient', size: 'sm' })}>
            更新
          </button>
        </form>
        <form action={deleteArticleAction} className="mt-3">
          <input type="hidden" name="article_id" value={article.id} />
          <button type="submit" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            削除
          </button>
        </form>
      </div>
    </details>
  );
}
