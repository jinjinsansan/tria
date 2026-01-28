'use server';

import { generateContent } from '@/lib/anthropic';

export type AiGenerationState = {
  ok: boolean;
  message?: string;
  result?: string;
};

export const initialAiState: AiGenerationState = { ok: true };

function sanitizeInput(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function generateTweetAction(_prev: AiGenerationState, formData: FormData): Promise<AiGenerationState> {
  try {
    const topic = sanitizeInput(formData.get('topic'));
    const style = sanitizeInput(formData.get('style')) || 'informative';
    const includeTria = formData.get('include_tria') === 'true';
    const includeSalon = formData.get('include_salon') === 'true';

    if (!topic) {
      return { ok: false, message: 'トピックを入力してください。' };
    }

    const triaUrl = process.env.NEXT_PUBLIC_TRIA_REDIRECT_URL ?? 'https://app.tria.so';
    const salonUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tria-salon.example';

    const systemPrompt = 'You are a marketing copywriter who creates concise Japanese X posts about the tria platform.';
    const userPrompt = `トピック: ${topic}
トーン: ${style}
文字数: 200文字以内
必須要素: 行ごとに箇条書き、絵文字は控えめ。
リンク: ${includeTria ? triaUrl : ''} ${includeSalon ? salonUrl : ''}`;

    const result = await generateContent({ systemPrompt, userPrompt, maxTokens: 400, temperature: 0.6 });
    return { ok: true, result };
  } catch (error) {
    console.error(error);
    return { ok: false, message: '生成に失敗しました。' };
  }
}

export async function generateNoteAction(_prev: AiGenerationState, formData: FormData): Promise<AiGenerationState> {
  try {
    const theme = sanitizeInput(formData.get('theme'));
    const keywords = sanitizeInput(formData.get('keywords'));
    const length = sanitizeInput(formData.get('length')) || 'short';

    if (!theme) {
      return { ok: false, message: 'テーマを入力してください。' };
    }

    const systemPrompt = 'You are a Japanese content writer who creates structured note article drafts about tria.';
    const userPrompt = `テーマ: ${theme}
キーワード: ${keywords}
長さ: ${length}
構成: 導入、背景、ポイント、CTA の見出しを含めてください。
トーン: 読者に行動を促す、丁寧で分かりやすい日本語。`;

    const result = await generateContent({ systemPrompt, userPrompt, maxTokens: 800, temperature: 0.7 });
    return { ok: true, result };
  } catch (error) {
    console.error(error);
    return { ok: false, message: '生成に失敗しました。' };
  }
}
