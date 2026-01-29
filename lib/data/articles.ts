import { cache } from 'react';

import { createClient } from '@/lib/supabase/server';
import type { Article } from '@/types';

const ARTICLE_FIELDS = `
  id,
  title,
  slug,
  content,
  category,
  order_index,
  is_published,
  created_at,
  updated_at
`;

interface ArticleFilters {
  category?: string;
  limit?: number;
}

export const getPublishedArticles = cache(async ({
  category,
  limit = 24,
}: ArticleFilters = {}): Promise<Article[]> => {
  const supabase = await createClient();
  let query = supabase
    .from('articles')
    .select(ARTICLE_FIELDS)
    .eq('is_published', true)
    .order('order_index', { ascending: true })
    .order('updated_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch articles', error);
    return [];
  }

  return data ?? [];
});

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_FIELDS)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch article', error);
    return null;
  }

  return data ?? null;
});

export const getAllArticles = cache(async (): Promise<Article[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_FIELDS)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch articles for admin', error);
    return [];
  }

  return data ?? [];
});
