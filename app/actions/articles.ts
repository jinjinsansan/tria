'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';

export type ArticleActionState = {
  ok: boolean;
  message?: string;
};

export const initialArticleState: ArticleActionState = { ok: true };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    throw new Error('Not authorized');
  }

  return supabase;
}

function getString(formData: FormData, key: string) {
  return (formData.get(key) as string | null)?.trim() ?? '';
}

export async function createArticleAction(
  _prev: ArticleActionState,
  formData: FormData
): Promise<ArticleActionState> {
  try {
    const supabase = await requireAdmin();
    const title = getString(formData, 'title');
    const slug = getString(formData, 'slug');
    const category = getString(formData, 'category');
    const content = getString(formData, 'content');
    const orderIndex = Number(formData.get('order_index') ?? 0);
    const isPublished = formData.get('is_published') === 'true';

    if (!title || !slug || !category || !content) {
      return { ok: false, message: 'すべての必須項目を入力してください。' };
    }

    const { error } = await supabase.from('articles').insert({
      title,
      slug,
      category,
      content,
      order_index: Number.isNaN(orderIndex) ? 0 : orderIndex,
      is_published: isPublished,
    });

    if (error) {
      throw error;
    }

    revalidatePath('/admin/articles');
    revalidatePath('/learn');
    return { ok: true, message: '記事を作成しました。' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: '作成に失敗しました。' };
  }
}

export async function updateArticleAction(
  _prev: ArticleActionState,
  formData: FormData
): Promise<ArticleActionState> {
  try {
    const supabase = await requireAdmin();
    const id = getString(formData, 'article_id');
    const title = getString(formData, 'title');
    const slug = getString(formData, 'slug');
    const category = getString(formData, 'category');
    const content = getString(formData, 'content');
    const orderIndex = Number(formData.get('order_index') ?? 0);
    const isPublished = formData.get('is_published') === 'true';

    if (!id) return { ok: false, message: '記事が見つかりません。' };

    const { error } = await supabase
      .from('articles')
      .update({
        title,
        slug,
        category,
        content,
        order_index: Number.isNaN(orderIndex) ? 0 : orderIndex,
        is_published: isPublished,
      })
      .eq('id', id);

    if (error) {
      throw error;
    }

    revalidatePath('/admin/articles');
    revalidatePath('/learn');
    return { ok: true, message: '記事を更新しました。' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: '更新に失敗しました。' };
  }
}

export async function deleteArticleAction(formData: FormData) {
  try {
    const supabase = await requireAdmin();
    const id = formData.get('article_id');
    if (!id || typeof id !== 'string') return;
    await supabase.from('articles').delete().eq('id', id);
    revalidatePath('/admin/articles');
    revalidatePath('/learn');
  } catch (error) {
    console.error(error);
  }
}
