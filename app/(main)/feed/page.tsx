import { Heart } from 'lucide-react';
import Link from 'next/link';

import { createPostAction, toggleLikeAction } from '@/app/actions/feed';
import { initialFeedState } from '@/app/actions/feed-state';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FEED_SORT_OPTIONS, TAGS } from '@/lib/constants';
import { getPosts, getUserLikedTargets } from '@/lib/data/feed';
import { createClient } from '@/lib/supabase/server';
import { cn, formatDate } from '@/lib/utils';
import type { Tag } from '@/lib/constants';

interface FeedPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const tagOptions = [{ label: 'すべて', value: undefined }, ...TAGS.map((tag) => ({ label: tag, value: tag }))];

export const metadata = {
  title: 'フィード | tria Japan Salon',
  description: 'triaに関する質問やノウハウを共有するコミュニティフィード。',
};

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const activeSort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'newest';
  const activeTag = typeof searchParams?.tag === 'string' ? searchParams.tag : undefined;

  const posts = await getPosts({ sort: activeSort as 'newest' | 'popular' | 'unanswered', tag: activeTag });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const likedTargets = (user
    ? await getUserLikedTargets(user.id)
    : { posts: new Set<string>(), comments: new Set<string>() }) as {
    posts: Set<string>;
    comments: Set<string>;
  };
  const handleCreatePost = async (formData: FormData) => {
    'use server';
    await createPostAction(initialFeedState, formData);
  };

  return (
    <div className="space-y-10">
      <header className="rounded-[32px] border border-white/10 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-10 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-white/70">Community Feed</p>
            <h1 className="text-4xl font-semibold">triaの疑問を共有し、最速で解決</h1>
            <p className="text-sm text-white/80">
              KYCやウォレット運用、紹介プログラムのコツなど、メンバー同士でノウハウを交換しましょう。
            </p>
          </div>
          <Link href="#ask" className={buttonVariants({ variant: 'gradient', size: 'lg' })}>
            質問する
          </Link>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {FEED_SORT_OPTIONS.map((option) => (
              <Link
                key={option.value}
                href={`/feed?sort=${option.value}${activeTag ? `&tag=${encodeURIComponent(activeTag)}` : ''}`}
                className={cn(
                  'rounded-full border border-white/10 px-5 py-2 text-sm transition',
                  activeSort === option.value
                    ? 'bg-white/20 text-white'
                    : 'text-muted-foreground hover:bg-white/10 hover:text-white'
                )}
              >
                {option.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {tagOptions.map((tag) => {
              const href = tag.value
                ? `/feed?tag=${encodeURIComponent(tag.value)}${activeSort ? `&sort=${activeSort}` : ''}`
                : `/feed${activeSort ? `?sort=${activeSort}` : ''}`;
              const isActive = tag.value === activeTag;
              return (
                <Link
                  key={tag.label}
                  href={href}
                  className={cn(
                    'rounded-2xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em]',
                    isActive ? 'bg-white/20 text-white' : 'text-muted-foreground hover:bg-white/10 hover:text-white'
                  )}
                >
                  {tag.label}
                </Link>
              );
            })}
          </div>

          <div className="space-y-4">
            {posts.length ? (
              posts.map((post) => (
                <Card key={post.id} className="border-white/5 bg-card/70">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.user?.display_name ?? '匿名ユーザー'}</span>
                      <span>•</span>
                      <span>{formatDate(post.created_at)}</span>
                      {post.is_answered ? (
                        <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[11px] text-primary">
                          ベストアンサー済
                        </span>
                      ) : null}
                    </div>
                    <CardTitle className="text-white">
                      <Link href={`/feed/${post.id}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-muted-foreground">
                      {post.content}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex gap-2">
                      <span>💬 {post.comments_count}</span>
                    </div>
                    <form
                      action={toggleLikeAction}
                      className="inline-flex items-center gap-1 text-sm"
                    >
                      <input type="hidden" name="target_type" value="post" />
                      <input type="hidden" name="target_id" value={post.id} />
                      <input type="hidden" name="redirect_path" value="/feed" />
                      <button
                        type="submit"
                        disabled={!user}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs transition',
                          likedTargets.posts.has(post.id) ? 'text-primary' : 'text-muted-foreground',
                          !user ? 'cursor-not-allowed opacity-60' : undefined
                        )}
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={likedTargets.posts.has(post.id) ? 'currentColor' : 'none'}
                        />
                        <span>{post.likes_count}</span>
                      </button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-[12px] text-white">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>投稿がありません</CardTitle>
                  <CardDescription>最初の質問を投稿してコミュニティを活性化しましょう。</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <Card id="ask" className="border-white/5 bg-white/10">
            <CardHeader>
              <CardTitle>質問を投稿する</CardTitle>
              <CardDescription>ログインしてトピックを投稿すると+5pt 獲得できます。</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" action={handleCreatePost}>
                <div className="space-y-2">
                  <Label htmlFor="title">タイトル</Label>
                  <Input id="title" name="title" placeholder="例：KYC承認までの目安が知りたい" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">本文</Label>
                  <Textarea id="content" name="content" rows={4} required placeholder="詳細な状況や知りたいことを記載" />
                </div>
                <div className="space-y-2">
                  <Label>タグ（最大3つ）</Label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {TAGS.map((tag) => (
                      <label key={tag} className="inline-flex items-center gap-1">
                        <input type="checkbox" name="tags" value={tag} className="accent-primary" />
                        <span>{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" className={buttonVariants({ variant: 'gradient', size: 'lg' })}>
                  投稿する
                </button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>投稿のヒント</CardTitle>
              <CardDescription>よくある質問カテゴリ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>・ KYCやカード申請の待ち時間</p>
              <p>・ 入金/送金時のガス代や所要時間</p>
              <p>・ 紹介コードの活用＆XPの伸ばし方</p>
              <p>・ トラブルシューティング</p>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
