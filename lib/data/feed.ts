import { cache } from 'react';

import { createClient } from '@/lib/supabase/server';
import type { Comment, Post, User } from '@/types';

const POST_FIELDS = `
  id,
  user_id,
  title,
  content,
  tags,
  is_answered,
  likes_count,
  comments_count,
  created_at,
  updated_at,
  user:users!posts_user_id_fkey (
    id,
    display_name,
    contribution_points
  )
`;

const COMMENT_FIELDS = `
  id,
  post_id,
  user_id,
  content,
  is_best_answer,
  likes_count,
  created_at,
  user:users!comments_user_id_fkey (
    id,
    display_name,
    contribution_points
  )
`;

export type PostWithUser = Post & { user: Pick<User, 'id' | 'display_name' | 'contribution_points'> | null };
export type CommentWithUser = Comment & {
  user: Pick<User, 'id' | 'display_name' | 'contribution_points'> | null;
};

interface PostFilter {
  tag?: string;
  sort?: 'newest' | 'popular' | 'unanswered';
  limit?: number;
}

export const getPosts = cache(async ({ tag, sort = 'newest', limit = 20 }: PostFilter = {}) => {
  const supabase = await createClient();
  let query = supabase.from('posts').select(POST_FIELDS).limit(limit);

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  switch (sort) {
    case 'popular':
      query = query.order('likes_count', { ascending: false }).order('comments_count', { ascending: false });
      break;
    case 'unanswered':
      query = query.eq('is_answered', false).order('created_at', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error('Failed to fetch posts', error);
    return [];
  }
  return (data as unknown as PostWithUser[]) ?? [];
});

export const getPostById = cache(async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('posts').select(POST_FIELDS).eq('id', id).maybeSingle();
  if (error) {
    console.error('Failed to fetch post detail', error);
    return null;
  }
  return (data as unknown as PostWithUser) ?? null;
});

export const getCommentsByPostId = cache(async (postId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_FIELDS)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch comments', error);
    return [];
  }

  return (data as unknown as CommentWithUser[]) ?? [];
});

export async function getUserLikedTargets(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('likes')
    .select('target_type, target_id')
    .eq('user_id', userId);

  if (error || !data) {
    return {
      posts: new Set<string>(),
      comments: new Set<string>(),
    };
  }

  const posts = new Set<string>();
  const comments = new Set<string>();

  for (const like of data) {
    if (like.target_type === 'post') {
      posts.add(like.target_id as string);
    } else if (like.target_type === 'comment') {
      comments.add(like.target_id as string);
    }
  }

  return { posts, comments };
}
