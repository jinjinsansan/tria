import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: '記事管理 | 管理者パネル',
};

const placeholderArticles = [
  { title: 'triaとは', status: '公開済み', updated: '2026/01/15' },
  { title: 'ウォレットの使い方', status: '下書き', updated: '2026/01/12' },
];

export default function AdminArticlesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-primary">Admin</p>
        <h1 className="text-3xl font-semibold text-white">記事管理</h1>
        <p className="text-sm text-muted-foreground">
          Supabaseと接続されたCMS機能を今後ここから提供します。現在はUIプレビュー段階です。
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={buttonVariants({ variant: 'gradient', size: 'sm' })} disabled>
            新規記事（準備中）
          </button>
          <Link href="/learn" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            公開中一覧を見る
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>リリース計画</CardTitle>
            <CardDescription>今後追加予定の機能</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>・ 記事の作成 / 編集 / 削除</li>
              <li>・ カテゴリ / 公開状態の管理</li>
              <li>・ AI草稿生成との連携</li>
              <li>・ 編集履歴と下書きプレビュー</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>直近の更新（ダミー）</CardTitle>
            <CardDescription>本番データ接続前のレイアウト確認用</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {placeholderArticles.map((article) => (
              <div key={article.title} className="rounded-xl border border-white/5 bg-white/5 p-3">
                <p className="text-white">{article.title}</p>
                <p className="text-xs">状態：{article.status} / 更新日：{article.updated}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>開発メモ</CardTitle>
          <CardDescription>Phase 2 で実装予定のタスク</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-6 text-sm text-muted-foreground">
            <li>Supabase RLSに準拠した記事CRUD API</li>
            <li>管理者専用のドラフトプレビュー</li>
            <li>記事の並び順・特集設定のUI</li>
            <li>フィードバック収集のワークフロー</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
