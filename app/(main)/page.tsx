import Image from 'next/image';
import Link from 'next/link';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ArrowRight, Sparkles } from 'lucide-react';

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

const publicStats = [
  { label: '登録ユーザー', value: '200,000+', helper: '世界中のtriaメンバー' },
  { label: '総トランザクション', value: '$100M+', helper: 'リアルユースで検証済み' },
  { label: 'アンバサダー', value: '6,000+', helper: '現地での布教ネットワーク' },
  { label: '対応国 / 店舗', value: '150+ / 130M+', helper: 'Apple Pay / Google Pay対応' },
];

const pillars = [
  {
    tag: 'EARN',
    title: '世界基準の資産運用',
    description: '自己保管・オンチェーンで可視化された利回り。トークンのまま増やす選択肢。',
  },
  {
    tag: 'CARD',
    title: 'どこでも使える暗号資産カード',
    description: '1,000種類以上のトークンをチャージし即利用。フェラーリもコンビニもこの1枚で。',
  },
  {
    tag: 'PERPS',
    title: 'クロスチェーンのレバレッジ取引',
    description: 'BestPathが最適ルートを自動探索。スリッページと時間ロスを最小化。',
  },
  {
    tag: 'SWAP',
    title: 'ガスフリーの自動スワップ',
    description: 'チェーンを跨いでも同一UX。ユーザーは銘柄を選ぶだけで完結。',
  },
  {
    tag: 'REWARDS',
    title: 'ポイントではなく実利',
    description: 'Triapointsはオンチェーンで可視化。活動すべてが報酬に直結。',
  },
  {
    tag: 'US BANK',
    title: '国境を越えるバンキング',
    description: 'どこからでもUS口座を開設し、法人/個人決済を一元管理。',
  },
];

const cardProducts = [
  {
    name: 'Virtual Card',
    features: ['即日発行・オンライン決済対応', 'Apple Pay / Google Pay 連携', '日次上限 $50,000'],
  },
  {
    name: 'Signature Card',
    features: ['リアルカード & 金属素材', 'キャッシュバック特典', '日次上限 $250,000'],
  },
  {
    name: 'Premium Card',
    features: ['エリート向けプレミアム枠', '空港ラウンジ / コンシェルジュ', '日次上限 $1,000,000'],
  },
];

const ambassadors = [
  {
    handle: '@mikiv21',
    title: 'TradFi × Web3 ブリッジ',
    desc: '従来金融と暗号資産の橋渡しを担当。誰でもアクセスできる金融を広げています。',
    rank: '#3',
  },
  {
    handle: '@parth_',
    title: 'DeFi エバンジェリスト',
    desc: '透明性の高い金融インフラを世界に。コミュニティ育成と教育をリード。',
    rank: '#2',
  },
  {
    handle: '@vasu_tria',
    title: 'コミュニティ戦略家',
    desc: 'オフライン/オンライン両輪でユーザーをサポート。リアルな資産活用を推進。',
    rank: '#1',
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const [featuredArticles, { data: { user } }] = await Promise.all([
    getFeaturedArticles(supabase),
    supabase.auth.getUser(),
  ]);

  if (!user) {
    return (
      <div className="space-y-16">
        <section className="relative overflow-hidden rounded-[48px] border border-white/10 bg-[#070910] px-6 py-12 text-white shadow-[0_25px_120px_rgba(3,4,10,0.75)] md:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,154,60,0.25),_transparent_55%),_radial-gradient(circle_at_80%_30%,_rgba(0,245,255,0.25),_transparent_45%)]" />
          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em]">
                <Sparkles className="h-4 w-4" /> Tria Points : Season 1
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[1.2em] text-white/70">
                  Your Life is Global. Your Bank Should Be Too.
                </p>
                <h1 className="text-4xl leading-tight md:text-6xl md:leading-[1.1]">
                  すべての暗号資産アクションを
                  <br />ひとつのカードで完結。
                </h1>
                <p className="text-lg text-white/80">
                  トレード / 決済 / 積立 / 紹介報酬まで、triaカードを中心に日常へインストール。日本語で学べる唯一の公式サロンです。
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className={buttonVariants({ variant: 'gradient', size: 'lg' })}>
                  無料で参加する
                </Link>
                <Link
                  href="https://app.tria.so"
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white/40 text-white hover:border-white hover:bg-white/5'
                  )}
                >
                  アプリを開く
                </Link>
                <Link
                  href="/learn"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'text-white hover:text-white'
                  )}
                >
                  triaとは？
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    label: 'リアルユースでXP獲得',
                    value: 'Tria Points',
                    helper: '利用するほどランキング上昇',
                  },
                  {
                    label: 'BestPath AVS',
                    value: 'AI Routing',
                    helper: '手数料/時間を自動最適化',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80"
                  >
                    <p className="text-xs uppercase tracking-[0.4em] text-primary">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                    <p className="text-white/70">{item.helper}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 translate-x-8 translate-y-8 rounded-[40px] bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 blur-3xl" />
              <div className="relative rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-2xl">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/70">
                  <span>Tria Card</span>
                  <span>Global Access</span>
                </div>
                <h2 className="mt-6 text-3xl font-semibold text-white">暗号資産で日常を払う。</h2>
                <p className="mt-3 text-sm text-white/80">
                  BTC / SOL / 1000+トークンからチャージ。Apple Pay / Google Pay対応、オンチェーン担保で即座に決済。
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/80">
                  {['Apple Pay', 'Google Pay', '130M+ Stores', 'Cashback'].map((badge) => (
                    <span key={badge} className="rounded-full border border-white/20 px-4 py-1">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="mt-8 rounded-[28px] border border-white/20 bg-black/40 p-4">
                  <p className="text-xs text-white/60">リアルダッシュボード</p>
                  <p className="mt-2 text-2xl font-semibold text-white">$42,560.22</p>
                  <p className="text-xs text-white/60">Total balance across Earn / Card / Rewards</p>
                  <Image
                    src="https://www.tria.so/hero.png"
                    alt="Tria dashboard preview"
                    width={640}
                    height={360}
                    className="mt-4 rounded-2xl border border-white/10 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {publicStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70"
            >
              <p className="uppercase tracking-[0.5em] text-white/50">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
              <p>{stat.helper}</p>
            </div>
          ))}
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.8em] text-white/40">All your crypto actions</p>
              <h2 className="text-3xl font-semibold text-white">EARN / CARD / PERPS / SWAP / REWARDS</h2>
            </div>
            <Link
              href="/learn"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              日本語ガイドを見る <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.tag}
                className="group rounded-[30px] border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-6 shadow-[0_15px_45px_rgba(3,4,10,0.45)] transition hover:border-white/20"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-primary">{pillar.tag}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{pillar.title}</h3>
                <p className="mt-2 text-sm text-white/80">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.8em] text-white/40">Tria Cards</p>
            <h2 className="text-3xl font-semibold text-white">150カ国で日常決済</h2>
            <p className="text-white/70">130M+店舗 / 1,000+対応トークン / 即時チャージ。</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {cardProducts.map((cardProduct) => (
              <Card key={cardProduct.name} className="border-white/5 bg-white/5 p-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-white">{cardProduct.name}</CardTitle>
                  <CardDescription>Tria Card Program</CardDescription>
                </CardHeader>
                <CardContent className="mt-6 space-y-3 p-0 text-sm text-white/80">
                  {cardProduct.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.8em] text-white/40">Tria Ambassadors</p>
            <h2 className="text-3xl font-semibold text-white">コミュニティがあなたの収益になる</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {ambassadors.map((ambassador) => (
              <div
                key={ambassador.handle}
                className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,154,60,0.12),rgba(95,76,255,0.12))] p-6"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/70">
                  <span>Ambassador</span>
                  <span>{ambassador.rank}</span>
                </div>
                <p className="mt-4 text-lg font-semibold text-white">{ambassador.handle}</p>
                <p className="text-sm text-white/60">{ambassador.title}</p>
                <p className="mt-4 text-sm text-white/80">{ambassador.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 text-center text-sm text-white/80">
            大規模コミュニティをお持ちの方はフォーム経由で申請ください。<Link
              href="https://form.typeform.com/to/WtTiLyAs"
              target="_blank"
              rel="noreferrer"
              className="ml-2 underline"
            >
              Become an Ambassador →
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[36px] border border-white/10 bg-white/5 p-8">
            <p className="text-sm uppercase tracking-[0.8em] text-white/40">Bank-grade security</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">セルフカストディ + 監査済み + コンプライアンス</h2>
            <p className="mt-4 text-white/80">
              triaは完全セルフ保管。鍵も資産もあなたの管理のまま、世界中で利用できるレールを提供します。監査済みの戦略と自動化されたリスク管理で、暗号資産を日常に。
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li>・ オンチェーン監査レポート / 外部セキュリティー検証</li>
              <li>・ グローバル規制準拠のオン/オフランプ</li>
              <li>・ マルチリージョンのKYC/AMLフレームワーク</li>
            </ul>
          </div>
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8 text-white">
            <h3 className="text-2xl font-semibold">tria Japan Salon</h3>
            <p className="mt-3 text-sm text-white/80">
              Supabase認証 × 学習カリキュラム × コミュニティ Q&A × AI 補助ツールで、プロダクト理解から実装まで一気通貫でサポートします。
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/signup" className={buttonVariants({ variant: 'gradient', size: 'lg' })}>
                今すぐ無料参加
              </Link>
              <Link
                href="/feed"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'lg' }),
                  'text-white hover:text-white'
                )}
              >
                コミュニティの様子を見る
              </Link>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.5em] text-white/60">
              Invite Only / Guided by Japan Core Team
            </p>
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
    <div className="space-y-14">
      <section className="rounded-[40px] border border-white/10 bg-white/5 p-8 shadow-[0_25px_80px_rgba(3,4,10,0.6)]">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.8em] text-primary">おかえりなさい</p>
            <h1 className="text-3xl font-semibold text-white">{profile?.display_name ?? user.email} さん</h1>
            <p className="text-sm text-white/70">
              コミュニティ活動で貢献度を高め、オートプレースメントで成果を最大化しましょう。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">{stat.label}</p>
                <p className="mt-3 text-4xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.helper}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-primary/30 bg-[linear-gradient(135deg,rgba(255,154,60,0.18),rgba(95,76,255,0.18))] px-6 py-5 text-sm text-white">
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
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.6em] text-white/50">Learning</p>
              <h2 className="text-2xl font-semibold text-white">おすすめ学習ステップ</h2>
            </div>
            <Link href="/learn" className="text-sm text-primary hover:underline">
              一覧を見る
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {featuredArticles.length ? (
              featuredArticles.map((article) => (
                <div key={article.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">{article.category}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{article.title}</p>
                  <p className="text-xs text-white/60">最終更新 {formatDate(article.updated_at)}</p>
                  <Link href={`/learn/${article.slug}`} className="mt-3 inline-flex items-center text-sm text-primary hover:underline">
                    続きを読む <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/60">まだ表示できる記事がありません。公開までお待ちください。</p>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.6em] text-white/50">Community</p>
            <h2 className="text-2xl font-semibold text-white">コミュニティの熱量</h2>
          </div>
          <div className="mt-6 space-y-5 text-sm text-white/75">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs text-white/50">注目の質問</p>
              <p className="mt-2">
                「KYCが保留になっています。必要書類のコツがあれば教えてください。」
              </p>
              <p className="mt-4 text-xs text-primary">回答で+10pt / ベストアンサーで+30pt</p>
            </div>
            <Link
              href="/feed"
              className={cn(buttonVariants({ variant: 'gradient' }), 'inline-flex justify-center rounded-full text-black')}
            >
              フィードを開く
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.6em] text-white/50">Quick Actions</p>
          <h2 className="text-2xl font-semibold text-white">今すぐ実行して貢献度を伸ばす</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <div key={action.href} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-lg font-semibold text-white">{action.label}</p>
              <p className="mt-2 text-sm text-white/70">{action.description}</p>
              <Link href={action.href} className="mt-3 inline-flex items-center text-sm text-primary hover:underline">
                開く <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
