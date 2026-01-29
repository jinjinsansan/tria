import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArticleCreateForm } from '@/components/admin/article-create-form';
import { ArticleEditForm } from '@/components/admin/article-edit-form';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllArticles } from '@/lib/data/articles';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: '記事管理 | 管理者パネル',
};

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).maybeSingle();

  if (!profile?.is_admin) {
    redirect('/');
  }

  const articles = await getAllArticles();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-primary">Admin</p>
          <h1 className="text-3xl font-semibold text-white">記事管理</h1>
          <p className="text-sm text-muted-foreground">記事の作成・編集・公開をここから行えます。</p>
        </div>
        <Link href="/learn" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          公開一覧を確認
        </Link>
      </header>

      <Card className="border-white/10 bg-card/80">
        <CardHeader>
          <CardTitle>新規記事を作成</CardTitle>
          <CardDescription>下書きは公開フラグを外した状態で保存してください。</CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleCreateForm />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/80">
        <CardHeader>
          <CardTitle>既存の記事</CardTitle>
          <CardDescription>クリックして内容を編集できます。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {articles.length ? (
            articles.map((article) => <ArticleEditForm key={article.id} article={article} />)
          ) : (
            <p className="text-sm text-muted-foreground">まだ記事がありません。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
