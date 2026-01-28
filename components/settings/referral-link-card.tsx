'use client';

import { useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ReferralLinkCardProps {
  referralCode?: string | null;
  referralUrl: string;
}

export function ReferralLinkCard({ referralCode, referralUrl }: ReferralLinkCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      setCopied(false);
    }
  }

  return (
    <Card className="border-white/10 bg-card/80">
      <CardHeader>
        <CardTitle>紹介リンク</CardTitle>
        <CardDescription>このリンクを共有すると、新規登録時にあなたが紹介者として紐づきます。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Referral Code</p>
          <p className="text-lg font-semibold text-white">{referralCode ?? '登録後に自動発行されます'}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          <p className="break-all">{referralUrl}</p>
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          className={cn(buttonVariants({ variant: 'gradient' }), 'w-full md:w-auto')}
        >
          {copied ? 'コピーしました' : 'リンクをコピー'}
        </button>
      </CardContent>
    </Card>
  );
}
