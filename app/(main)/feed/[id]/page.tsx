import { Heart } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createCommentAction, markBestAnswerAction, toggleLikeAction } from '@/app/actions/feed';
import { initialFeedState } from '@/app/actions/feed-state';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCommentsByPostId, getPostById, getUserLikedTargets } from '@/lib/data/feed';
import { createClient } from '@/lib/supabase/server';
import { cn, formatDateTime } from '@/lib/utils';

interface FeedDetailPageProps {
  params: {
    id: string;
  };
}

export default async function FeedDetailPage({ params }: FeedDetailPageProps) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  const comments = await getCommentsByPostId(post.id);
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
  const submitComment = async (formData: FormData) => {
    'use server';
    await createCommentAction(initialFeedState, formData);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link href="/feed" className="text-sm text-primary hover:underline">
          ← フィード一覧に戻る
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{post.user?.display_name ?? '匿名ユーザー'}</span>
          <span>•</span>
          <span>{formatDateTime(post.created_at)}</span>
          {post.is_answered ? (
            <span className="rounded-full bg-primary/20 px-3 py-0.5 text-xs text-primary">ベストアンサー済</span>
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold text-white">{post.title}</h1>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>質問内容</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert">
          <div className="space-y-4">
            <p>{post.content}</p>
            <form className="inline-flex" action={toggleLikeAction}>
              <input type="hidden" name="target_type" value="post" />
              <input type="hidden" name="target_id" value={post.id} />
              <input type="hidden" name="redirect_path" value={`/feed/${post.id}`} />
              <button
                type="submit"
                disabled={!user}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-sm transition',
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
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            回答 ({comments.length})
          </h2>
          <p className="text-sm text-muted-foreground">ベストアンサーは投稿者のみが設定できます。</p>
        </div>

        <div className="space-y-3">
          {comments.length ? (
            comments.map((comment) => (
              <Card key={comment.id} className={cn('border-white/5', comment.is_best_answer ? 'border-primary/60' : undefined)}>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{comment.user?.display_name ?? 'メンバー'}</span>
                    <span>•</span>
                    <span>{formatDateTime(comment.created_at)}</span>
                  </div>
                  {comment.is_best_answer ? (
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary">ベストアンサー</span>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-white/90">{comment.content}</p>
                  <form action={toggleLikeAction} className="inline-flex">
                    <input type="hidden" name="target_type" value="comment" />
                    <input type="hidden" name="target_id" value={comment.id} />
                    <input type="hidden" name="redirect_path" value={`/feed/${post.id}`} />
                    <button
                      type="submit"
                      disabled={!user}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs transition',
                        likedTargets.comments.has(comment.id) ? 'text-primary' : 'text-muted-foreground',
                        !user ? 'cursor-not-allowed opacity-60' : undefined
                      )}
                    >
                      <Heart
                        className="h-4 w-4"
                        fill={likedTargets.comments.has(comment.id) ? 'currentColor' : 'none'}
                      />
                      <span>{comment.likes_count}</span>
                    </button>
                  </form>
                  {!comment.is_best_answer && !post.is_answered ? (
                    <form action={markBestAnswerAction}>
                      <input type="hidden" name="post_id" value={post.id} />
                      <input type="hidden" name="comment_id" value={comment.id} />
                      <button type="submit" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                        ベストアンサーに選ぶ
                      </button>
                    </form>
                  ) : null}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>まだ回答がありません</CardTitle>
                <CardDescription>最初の回答を投稿してポイントを獲得しましょう。</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>

      <Card className="border-white/5 bg-white/5">
        <CardHeader>
          <CardTitle>回答する</CardTitle>
          <CardDescription>回答すると+10pt付与。</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={submitComment}>
            <input type="hidden" name="post_id" value={post.id} />
            <div className="space-y-2">
              <Label htmlFor="content">回答内容</Label>
              <Textarea id="content" name="content" rows={4} placeholder="あなたの経験やアドバイスを共有してください" required />
            </div>
            <button type="submit" className={buttonVariants({ variant: 'gradient', size: 'lg' })}>
              投稿する
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
