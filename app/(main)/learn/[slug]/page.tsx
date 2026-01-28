import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { getArticleBySlug, getPublishedArticles } from '@/lib/data/articles';
import { cn, formatDate } from '@/lib/utils';

interface LearnArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: LearnArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: '記事が見つかりません | tria Japan Salon',
    };
  }

  const description = article.content.slice(0, 140).replace(/\n+/g, ' ');

  return {
    title: `${article.title} | tria Japan Salon`,
    description,
  };
}

export default async function LearnArticlePage({ params }: LearnArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = (await getPublishedArticles({ category: article.category, limit: 4 })).filter(
    (related) => related.slug !== article.slug
  );

  const categoryName = ARTICLE_CATEGORIES.find((cat) => cat.slug === article.category)?.name ?? 'コンテンツ';

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <article className="space-y-6">
        <div className="space-y-3">
          <Link href="/learn" className="text-sm text-primary hover:underline">
            ← 学習一覧に戻る
          </Link>
          <p className="text-xs uppercase tracking-[0.4em] text-primary">{categoryName}</p>
          <h1 className="text-4xl font-semibold text-white">{article.title}</h1>
          <p className="text-sm text-muted-foreground">最終更新：{formatDate(article.updated_at)}</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
          <p>おすすめの読み方</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>重要なポイントをメモしながら進める</li>
            <li>不明点はフィードで質問して解決する</li>
            <li>学んだ内容を実際のtriaで試す</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/feed" className={buttonVariants({ variant: 'gradient', size: 'sm' })}>
              疑問を投稿する
            </Link>
            <Link href="/ai" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
              AI補助を使う
            </Link>
          </div>
        </div>

        <div className="prose prose-invert prose-headings:font-semibold prose-a:text-primary/90 prose-strong:text-white">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>
      </article>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>この記事について</CardTitle>
            <CardDescription>
              カテゴリ：{categoryName}
              <br />
              最終更新：{formatDate(article.updated_at)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              学習完了後は設定ページからtria紹介URLを登録し、貢献度を高めてプレースメントに備えましょう。
            </p>
            <Link href="/settings" className="text-primary hover:underline">
              設定ページを開く →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>関連コンテンツ</CardTitle>
            <CardDescription>同じカテゴリのおすすめ記事</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {relatedArticles.length ? (
              relatedArticles.map((related) => (
                <div key={related.id} className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <p className="text-sm font-semibold text-white">{related.title}</p>
                  <p className="text-xs text-muted-foreground">最終更新：{formatDate(related.updated_at)}</p>
                  <Link
                    href={`/learn/${related.slug}`}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-2 px-0 text-primary')}
                  >
                    読む →
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">他の関連コンテンツは準備中です。</p>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
