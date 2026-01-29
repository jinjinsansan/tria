import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TweetForm } from '@/components/ai/tweet-form';
import { NoteForm } from '@/components/ai/note-form';

export const metadata = {
  title: 'クリエイティブスタジオ | tria Japan Salon',
  description: '投稿や記事ドラフトを数秒で組み立て、発信のリズムを整えます。',
};

export default function AiPage() {
  return (
    <div className="space-y-10">
      <header className="rounded-[32px] border border-white/10 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-10 text-white">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">Creative Studio</p>
          <h1 className="text-4xl font-semibold">アウトプットを一瞬で整える</h1>
          <p className="text-sm text-white/80">
            テンプレを意識せずにXやnoteの草稿をまとめ、すぐに共有へつなげましょう。
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
