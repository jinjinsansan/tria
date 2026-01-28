import Link from 'next/link';
import type { SupabaseClient } from '@supabase/supabase-js';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { cn, formatDate } from '@/lib/utils';

async function getFeaturedArticles(client: SupabaseClient) {
  const { data } = await client
    .from('articles')
    .select('id, title, category, slug, updated_at')
    .eq('is_published', true)
    .order('order_index', { ascending: true })
    .limit(3);
  return data ?? [];
}

export default async function HomePage() {
  const supabase = await createClient();
  const [featuredArticles, { data: { user } }] = await Promise.all([
    getFeaturedArticles(supabase),
    supabase.auth.getUser(),
  ]);

  if (!user) {
    return (
      <div className="space-y-12">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-purple-500/10 to-teal-500/20 p-10 text-white shadow-2xl">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
                <span className="h-2 w-2 rounded-full bg-accent" />
                日本一triaを学べる無料オンラインサロン
              </p>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                日本語で最も詳しいtria解説と
                <br />コミュニティサポートをワンパッケージで
              </h1>
              <p className="text-lg text-white/80">
                登録は5分。学習コンテンツ、Q&Aフィード、AI補助ツールを活用してtria活用力を最速で高めましょう。
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className={buttonVariants({ variant: 'gradient', size: 'lg' })}
                >
                  無料で参加する
                </Link>
                <Link
                  href="/learn"
                  className={buttonVariants({ variant: 'outline', size: 'lg' })}
                >
                  triaとは？
                </Link>
              </div>
            </div>
            <div className="w-full max-w-md rounded-3xl border border-white/15 bg-black/40 p-6 backdrop-blur-xl">
              <h2 className="text-lg font-semibold">サロンでできること</h2>
              <ul className="mt-6 space-y-4 text-sm text-white/80">
                <li>・ Supabaseによる安心の認証基盤</li>
                <li>・ tria専門の学習カリキュラム</li>
                <li>・ メンバー同士で助け合えるQ&Aフィード</li>
                <li>・ 投稿/記事作成を助けるAI補助ツール</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'トレーニングコンテンツ',
              desc: 'triaの基礎から応用まで、カテゴリ別に整理された学習記事を提供。',
            },
            {
              title: 'コミュニティQ&A',
              desc: '困ったらすぐに質問。経験豊富なメンバーがベストプラクティスを共有。',
            },
            {
              title: 'AIサポート',
              desc: 'X投稿やnote記事の草稿をAIが作成。アウトプットを自動化。',
            },
          ].map((card) => (
            <Card key={card.title} className="border-white/5 bg-card/70">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{card.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">注目のコンテンツ</h2>
            <Link href="/learn" className="text-sm text-primary hover:underline">
              すべて見る
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredArticles.length
              ? featuredArticles.map((article) => (
                  <Card key={article.id} className="border-white/5 bg-card/60">
                    <CardHeader>
                      <p className="text-xs uppercase tracking-[0.25em] text-primary">
                        {article.category}
                      </p>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <CardDescription>
                        最終更新：{formatDate(article.updated_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={`/learn/${article.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        記事を読む →
                      </Link>
                    </CardContent>
                  </Card>
                ))
              : (
                  <p className="text-sm text-muted-foreground">
                    公開済みの記事はまだありません。準備中です。
                  </p>
                )}
          </div>
        </section>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('users')
    .select(
      'display_name, contribution_points, total_downlines, tria_referral_url, last_login_at'
    )
    .eq('id', user.id)
    .maybeSingle();

  const stats = [
    {
      label: '貢献度ポイント',
      value: profile?.contribution_points ?? 0,
      helper: '今週 +5pt',
    },
    {
      label: '累計ダウンライン',
      value: profile?.total_downlines ?? 0,
      helper: 'オーガニック割り当て待ち',
    },
    {
      label: '最終ログイン',
      value: profile?.last_login_at
        ? formatDate(profile.last_login_at)
        : '初回ログイン',
      helper: '継続ログインで毎日+1pt',
    },
  ];

  const quickActions = [
    { label: '質問を投稿', href: '/feed', description: '疑問点を共有して回答を得る' },
    { label: '記事を読む', href: '/learn', description: 'カテゴリ別の学習コンテンツ' },
    { label: 'AIで投稿作成', href: '/ai', description: 'SNS / note出稿を最短で' },
  ];

  return (
    <div className="space-y-12">
      <section className="rounded-[32px] border border-white/5 bg-white/5 p-8 shadow-2xl">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-primary">おかえりなさい</p>
            <h1 className="text-3xl font-semibold text-white">
              {profile?.display_name ?? user.email} さん
            </h1>
            <p className="text-sm text-muted-foreground">
              コミュニティ活動で貢献度を高め、オートプレースメントで成果を最大化しましょう。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-white/5 bg-card/70">
                <CardHeader className="space-y-1">
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                  <p className="text-xs text-muted-foreground">{stat.helper}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6 text-sm text-primary-foreground">
            あなたのtria紹介URL:{' '}
            {profile?.tria_referral_url ? (
              <a
                href={profile.tria_referral_url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline"
              >
                {profile.tria_referral_url}
              </a>
            ) : (
              <Link href="/settings" className="underline">
                設定ページから登録しましょう
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/5 bg-card/70">
          <CardHeader>
            <CardTitle>おすすめ学習ステップ</CardTitle>
            <CardDescription>直近で更新されたコンテンツから着手しましょう。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredArticles.length ? (
              featuredArticles.map((article) => (
                <div
                  key={article.id}
                  className="rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">
                    {article.category}
                  </p>
                  <p className="text-lg font-semibold text-white">{article.title}</p>
                  <Link
                    href={`/learn/${article.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    続きを読む →
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                まだ表示できる記事がありません。公開までお待ちください。
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-card/70">
          <CardHeader>
            <CardTitle>コミュニティの様子</CardTitle>
            <CardDescription>フィードで質問や回答を投稿して貢献度を積み上げましょう。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-xl border border-white/5 bg-white/5 p-4">
              <p className="font-semibold text-white">投稿サンプル</p>
              <p className="mt-2">
                「KYCが保留になっています。必要書類のコツがあれば教えてください。」
              </p>
              <p className="mt-4 text-xs text-primary">回答で+10pt / ベストアンサーで+30pt</p>
            </div>
            <Link
              href="/feed"
              className={cn(
                buttonVariants({ variant: 'gradient' }),
                'inline-flex justify-center'
              )}
            >
              フィードを開く
            </Link>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-white/5 bg-card/70">
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>今すぐ行動して貢献度を伸ばしましょう。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <div key={action.href} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className="text-lg font-semibold text-white">{action.label}</p>
                <p className="mt-2 text-sm text-muted-foreground">{action.description}</p>
                <Link href={action.href} className="mt-4 inline-flex items-center text-sm text-primary hover:underline">
                  開く →
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
