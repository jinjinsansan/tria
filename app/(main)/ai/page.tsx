import { generateNoteAction, generateTweetAction, initialAiState } from '@/app/actions/ai';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AiResult } from '@/components/ui/ai-result';
import { TweetForm } from '@/components/ai/tweet-form';
import { NoteForm } from '@/components/ai/note-form';

export const metadata = {
  title: 'AI補助 | tria Japan Salon',
  description: 'X投稿やnote記事の草稿をAIで素早く生成できます。',
};

export default function AiPage() {
  return (
    <div className="space-y-10">
      <header className="rounded-[32px] border border-white/10 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-10 text-white">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">AI Assist</p>
          <h1 className="text-4xl font-semibold">アウトプットをAIで加速</h1>
          <p className="text-sm text-white/80">
            サロンで得た知識をXやnoteで共有し、貢献度と紹介のチャンスを最大化しましょう。
          </p>
        </div>
      </header>

      <Tabs defaultValue="tweet" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tweet">X投稿生成</TabsTrigger>
          <TabsTrigger value="note">note記事生成</TabsTrigger>
        </TabsList>
        <TabsContent value="tweet">
          <TweetForm />
        </TabsContent>
        <TabsContent value="note">
          <NoteForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
