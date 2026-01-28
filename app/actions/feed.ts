'use server';

import { revalidatePath } from 'next/cache';

import type { FeedActionState } from './feed-state';

import { NOTIFICATION_TYPES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import type { Comment, Post } from '@/types';

export async function createPostAction(_prev: FeedActionState, formData: FormData): Promise<FeedActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: 'ログインが必要です' };
  }

  const title = (formData.get('title') as string | null)?.trim();
  const content = (formData.get('content') as string | null)?.trim();
  const tags = (formData.getAll('tags') as string[]).filter(Boolean).slice(0, 3);

  if (!title?.length) {
    return { ok: false, fieldErrors: { title: 'タイトルを入力してください' } };
  }
  if (!content?.length) {
    return { ok: false, fieldErrors: { content: '本文を入力してください' } };
  }

  const { error, data } = await supabase
    .from('posts')
    .insert({ title, content, tags, user_id: user.id })
    .select('id')
    .single();

  if (error) {
    return { ok: false, message: '投稿に失敗しました。時間をおいて再度お試しください。' };
  }

  await supabase.rpc('add_contribution_points', {
    p_user_id: user.id,
    p_action: 'post_create',
    p_points: 5,
  });

  revalidatePath('/feed');
  revalidatePath(`/feed/${data.id}`);
  return { ok: true };
}

export async function createCommentAction(_prev: FeedActionState, formData: FormData): Promise<FeedActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: 'ログインが必要です' };
  }

  const postId = formData.get('post_id') as string | null;
  const content = (formData.get('content') as string | null)?.trim();

  if (!postId) {
    return { ok: false, message: '投稿が見つかりません' };
  }

  if (!content?.length) {
    return { ok: false, fieldErrors: { content: '回答内容を入力してください' } };
  }

  const { error } = await supabase.from('comments').insert({ post_id: postId, user_id: user.id, content });

  if (error) {
    return { ok: false, message: '回答の投稿に失敗しました' };
  }

  await supabase.rpc('add_contribution_points', {
    p_user_id: user.id,
    p_action: 'comment_create',
    p_points: 10,
  });

  revalidatePath(`/feed/${postId}`);
  revalidatePath('/feed');
  return { ok: true };
}

export async function markBestAnswerAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error('User is not authenticated');
    return;
  }

  const postId = formData.get('post_id') as string | null;
  const commentId = formData.get('comment_id') as string | null;

  if (!postId || !commentId) {
    console.error('Invalid request payload');
    return;
  }

  const { data: post } = await supabase
    .from('posts')
    .select('id, user_id')
    .eq('id', postId)
    .maybeSingle<Post>();

  if (!post || post.user_id !== user.id) {
    console.error('User cannot mark best answer');
    return;
  }

  // Reset existing best answers on the post before setting a new one
  await supabase
    .from('comments')
    .update({ is_best_answer: false })
    .eq('post_id', postId)
    .eq('is_best_answer', true);

  const { error } = await supabase
    .from('comments')
    .update({ is_best_answer: true })
    .eq('id', commentId)
    .eq('post_id', postId);

  if (error) {
    console.error('Failed to mark best answer', error);
    return;
  }

  await supabase
    .from('posts')
    .update({ is_answered: true })
    .eq('id', postId);

  const { data: bestAnswer } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .maybeSingle<Comment>();

  if (bestAnswer?.user_id) {
    await supabase.rpc('add_contribution_points', {
      p_user_id: bestAnswer.user_id,
      p_action: 'best_answer',
      p_points: 30,
    });
  }

  revalidatePath(`/feed/${postId}`);
  revalidatePath('/feed');
}

type LikeTargetType = 'post' | 'comment';

async function updateLikeCounts(
  targetType: LikeTargetType,
  targetId: string,
  delta: number,
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never
) {
  if (targetType === 'post') {
    const { data } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('id', targetId)
      .maybeSingle<Post>();
    const current = data?.likes_count ?? 0;
    await supabase.from('posts').update({ likes_count: Math.max(current + delta, 0) }).eq('id', targetId);
  } else {
    const { data } = await supabase
      .from('comments')
      .select('likes_count')
      .eq('id', targetId)
      .maybeSingle<Comment>();
    const current = data?.likes_count ?? 0;
    await supabase.from('comments').update({ likes_count: Math.max(current + delta, 0) }).eq('id', targetId);
  }
}

export async function toggleLikeAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }

  const targetType = formData.get('target_type');
  const targetId = formData.get('target_id');
  const redirectPath = (formData.get('redirect_path') as string | null) ?? null;

  if (targetType !== 'post' && targetType !== 'comment') {
    return;
  }

  if (!targetId || typeof targetId !== 'string') {
    return;
  }

  let targetOwnerId: string | null = null;
  let postIdForRevalidate: string | null = null;

  if (targetType === 'post') {
    const { data } = await supabase
      .from('posts')
      .select('id, user_id')
      .eq('id', targetId)
      .maybeSingle<Post>();
    if (!data) return;
    targetOwnerId = data.user_id;
    postIdForRevalidate = data.id;
  } else {
    const { data } = await supabase
      .from('comments')
      .select('id, user_id, post_id')
      .eq('id', targetId)
      .maybeSingle<Comment>();
    if (!data) return;
    targetOwnerId = data.user_id;
    postIdForRevalidate = data.post_id;
  }

  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .maybeSingle();

  let delta = 1;

  if (existingLike) {
    await supabase.from('likes').delete().eq('id', existingLike.id);
    delta = -1;
  } else {
    await supabase.from('likes').insert({ user_id: user.id, target_type: targetType, target_id: targetId });
  }

  await updateLikeCounts(targetType, targetId, delta, supabase);

  if (delta > 0 && targetOwnerId && targetOwnerId !== user.id) {
    await supabase.rpc('add_contribution_points', {
      p_user_id: targetOwnerId,
      p_action: 'like_received',
      p_points: 2,
    });

    await supabase.from('notifications').insert({
      user_id: targetOwnerId,
      type: NOTIFICATION_TYPES.like,
      title: 'いいねが届きました',
      content: targetType === 'post' ? 'あなたの質問がいいねされました。' : 'あなたの回答がいいねされました。',
    });
  }

  if (redirectPath) {
    revalidatePath(redirectPath);
  }
  if (postIdForRevalidate) {
    revalidatePath(`/feed/${postIdForRevalidate}`);
  }
  if (targetType === 'post') {
    revalidatePath('/feed');
  }
}
