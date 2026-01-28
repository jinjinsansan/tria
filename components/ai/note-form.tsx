'use client';

import { useFormState } from 'react-dom';

import { generateNoteAction, initialAiState } from '@/app/actions/ai';
import { AiResult } from '@/components/ui/ai-result';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function NoteForm() {
  const [state, formAction] = useFormState(generateNoteAction, initialAiState);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>note記事生成</CardTitle>
          <CardDescription>テーマとキーワードを入力すると構成付きのドラフトを生成します。</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">テーマ</Label>
              <Textarea id="theme" name="theme" rows={3} placeholder="例: triaウォレット入金ガイド" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">キーワード</Label>
              <Input id="keywords" name="keywords" placeholder="例: ガス代, XP, 紹介" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">ボリューム</Label>
              <select
                id="length"
                name="length"
                className="w-full rounded-lg border border-border bg-card/70 px-4 py-2 text-sm"
                defaultValue="medium"
              >
                <option value="short">短め</option>
                <option value="medium">標準</option>
                <option value="long">詳しく</option>
              </select>
            </div>
            {state.message && !state.ok ? (
              <p className="text-sm text-red-400">{state.message}</p>
            ) : null}
            <button type="submit" className={buttonVariants({ variant: 'gradient' })}>
              生成する
            </button>
          </form>
        </CardContent>
      </Card>

      <AiResult title="生成された記事ドラフト" content={state.result} />
    </div>
  );
}
