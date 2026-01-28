import { notFound } from 'next/navigation';
import Link from 'next/link';

import { createCommentAction, markBestAnswerAction } from '@/app/actions/feed';
import { initialFeedState } from '@/app/actions/feed-state';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCommentsByPostId, getPostById } from '@/lib/data/feed';
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
          <p>{post.content}</p>
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
