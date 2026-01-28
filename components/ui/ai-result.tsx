'use client';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AiResultProps {
  title: string;
  content?: string;
}

export function AiResult({ title, content }: AiResultProps) {
  const { copied, copy } = useCopyToClipboard();

  if (!content) return null;

  return (
    <Card className="border-white/10 bg-card/80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>生成結果をコピーして編集にご利用ください。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white">
          {content}
        </pre>
        <button
          type="button"
          className={cn(buttonVariants({ variant: 'outline' }), 'w-full md:w-auto')}
          onClick={() => copy(content)}
        >
          {copied ? 'コピーしました' : 'コピーする'}
        </button>
      </CardContent>
    </Card>
  );
}
