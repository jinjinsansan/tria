import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { getPublishedArticles } from '@/lib/data/articles';
import { cn, formatDate } from '@/lib/utils';

interface LearnPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const categoryOptions = [{ slug: undefined, name: 'すべて' }, ...ARTICLE_CATEGORIES];

export const metadata = {
  title: '学ぶ | tria Japan Salon',
  description: 'triaを体系的に学べる学習コンテンツ集。カテゴリ別に基礎から応用までを整理しています。',
};

export default async function LearnPage({ searchParams }: LearnPageProps) {
  const requestedCategory = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const activeCategory = ARTICLE_CATEGORIES.some((cat) => cat.slug === requestedCategory)
    ? requestedCategory
    : undefined;

  const articles = await getPublishedArticles({ category: activeCategory, limit: 60 });
  const activeCategoryName = activeCategory
    ? ARTICLE_CATEGORIES.find((cat) => cat.slug === activeCategory)?.name ?? 'すべて'
    : 'すべて';

  return (
    <div className="space-y-12">
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-purple-500/5 to-teal-500/10 p-10 shadow-2xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-primary">Learning Hub</p>
            <h1 className="text-4xl font-semibold text-white">triaを体系的に学ぶ</h1>
            <p className="text-base text-white/80">
              カテゴリ別にまとめたガイドで、triaの仕組みから稼働ノウハウまでを順序立てて理解できます。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className={buttonVariants({ variant: 'gradient', size: 'lg' })}>
                無料で参加
              </Link>
              <Link href="/feed" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                質問する
              </Link>
            </div>
          </div>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-6 text-sm text-white/80">
            <p className="text-base font-semibold text-white">カテゴリ構成</p>
            <ul className="mt-4 space-y-2">
              {ARTICLE_CATEGORIES.map((category) => (
                <li key={category.slug} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-primary">Category</p>
          <h2 className="text-2xl font-semibold text-white">{activeCategoryName}</h2>
          <p className="text-sm text-muted-foreground">学びたいテーマを選ぶと関連コンテンツだけを絞り込めます。</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {categoryOptions.map((category) => {
            const isActive = category.slug === activeCategory;
            const href = category.slug ? `/learn?category=${category.slug}` : '/learn';
            return (
              <Link
                key={category.name}
                href={href}
                className={cn(
                  'rounded-full border border-white/10 px-5 py-2 text-sm transition',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-muted-foreground hover:bg-white/10 hover:text-white'
                )}
              >
                {category.name}
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.length ? (
            articles.map((article) => (
              <Card key={article.id} className="flex flex-col border-white/5 bg-card/80">
                <CardHeader>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary">
                    {ARTICLE_CATEGORIES.find((cat) => cat.slug === article.category)?.name ?? article.category}
                  </p>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>最終更新：{formatDate(article.updated_at)}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link href={`/learn/${article.slug}`} className="text-sm text-primary hover:underline">
                    記事を読む →
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>該当するコンテンツがありません</CardTitle>
                <CardDescription>
                  現在準備中です。別のカテゴリを選択するか、しばらくお待ちください。
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
