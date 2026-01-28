'use server';

import { revalidatePath } from 'next/cache';

import type { FeedActionState } from './feed-state';

import type { Comment, Post } from '@/types';
import { createClient } from '@/lib/supabase/server';

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
