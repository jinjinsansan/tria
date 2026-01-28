export const SITE_NAME = 'tria Japan Salon';
export const SITE_DESCRIPTION = '日本一triaを学べる無料オンラインサロン';

export const TAGS = [
  '初心者',
  'ウォレット',
  'カード申請',
  'KYC',
  '送金・入金',
  'Earn（利回り）',
  '紹介プログラム',
  'トラブル',
  'その他',
] as const;

export type Tag = (typeof TAGS)[number];

export const ARTICLE_CATEGORIES = [
  { slug: 'about', name: 'triaとは' },
  { slug: 'getting-started', name: '始め方' },
  { slug: 'wallet', name: 'ウォレット機能' },
  { slug: 'card', name: 'カード機能' },
  { slug: 'earn', name: 'Earn（利回り）' },
  { slug: 'referral', name: '紹介プログラム' },
  { slug: 'faq', name: 'よくある質問' },
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]['slug'];

export const CONTRIBUTION_POINTS = {
  post_create: 5,
  comment_create: 10,
  best_answer: 30,
  like_received: 2,
  daily_login: 1,
  article_read: 3,
  sns_share: 20,
} as const;

export const FEED_SORT_OPTIONS = [
  { value: 'newest', label: '新着' },
  { value: 'popular', label: '人気' },
  { value: 'unanswered', label: '未回答' },
] as const;

export const NOTIFICATION_TYPES = {
  comment: 'comment',
  best_answer: 'best_answer',
  like: 'like',
  placement: 'placement',
  system: 'system',
} as const;

export const COLORS = {
  primary: '#8B5CF6',
  secondary: '#06B6D4',
  accent: '#10B981',
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceHover: '#252525',
  text: '#FFFFFF',
  textMuted: '#A1A1A1',
  border: '#2A2A2A',
} as const;
