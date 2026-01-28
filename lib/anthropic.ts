import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type GenerationParams = {
  systemPrompt?: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
};

export async function generateContent({
  systemPrompt,
  userPrompt,
  maxTokens = 600,
  temperature = 0.7,
}: GenerationParams) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const response = await client.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const result = response.content
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('\n');

  return result.trim();
}
