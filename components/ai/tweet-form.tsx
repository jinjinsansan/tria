'use client';

import { useFormState } from 'react-dom';

import { generateTweetAction, initialAiState } from '@/app/actions/ai';
import { AiResult } from '@/components/ui/ai-result';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function TweetForm() {
  const [state, formAction] = useFormState(generateTweetAction, initialAiState);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>X投稿生成</CardTitle>
          <CardDescription>トピックとトーンを入力すると日本語のX投稿案を生成します。</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={formAction}>
            <div className="space-y-2">
              <Label htmlFor="topic">トピック</Label>
              <Textarea id="topic" name="topic" rows={3} placeholder="例: triaのウォレット利回りが上がった件" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">トーン/スタイル</Label>
              <Input id="style" name="style" placeholder="例: informative / casual / promotional" />
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="include_tria" value="true" defaultChecked />
                triaリンクを挿入
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="include_salon" value="true" defaultChecked />
                サロンリンクを挿入
              </label>
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

      <AiResult title="生成された投稿" content={state.result} />
    </div>
  );
}
