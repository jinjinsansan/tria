// Database Types
export interface User {
  id: string;
  email: string;
  display_name: string | null;
  tria_referral_url: string | null;
  referrer_id: string | null;
  referral_code: string;
  contribution_points: number;
  total_downlines: number;
  is_admin: boolean;
  created_at: string;
  last_login_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  is_answered: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_best_answer: boolean;
  likes_count: number;
  created_at: string;
  // Relations
  user?: User;
}

export interface Like {
  id: string;
  user_id: string;
  target_type: 'post' | 'comment';
  target_id: string;
  created_at: string;
}

export interface OrganicQueueItem {
  id: string;
  visitor_id: string;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: 'pending' | 'assigned' | 'expired' | 'converted';
  assigned_to: string | null;
  created_at: string;
  assigned_at: string | null;
  // Relations
  assigned_user?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ContributionHistory {
  id: string;
  user_id: string;
  action: string;
  points: number;
  description: string | null;
  created_at: string;
}

// Settings Types
export interface PlacementSettings {
  admin_ratio: number;
}

export interface ContributionPointsSettings {
  post_create: number;
  comment_create: number;
  best_answer: number;
  like_received: number;
  daily_login: number;
  article_read: number;
  sns_share: number;
}

export interface SiteInfo {
  name: string;
  description: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Form Types
export interface SignUpForm {
  email: string;
  password: string;
  display_name: string;
  referral_code?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface PostForm {
  title: string;
  content: string;
  tags: string[];
}

export interface CommentForm {
  content: string;
}

export interface ArticleForm {
  title: string;
  slug: string;
  content: string;
  category: string;
  is_published: boolean;
}

// AI Generation Types
export interface TweetGenerationRequest {
  topic: string;
  style: 'informative' | 'casual' | 'promotional';
  include_tria_link: boolean;
  include_salon_link: boolean;
}

export interface NoteGenerationRequest {
  theme: 'experience' | 'tutorial' | 'comparison' | 'tips';
  topic: string;
  keywords: string[];
}

// Stats Types
export interface UserStats {
  contribution_points: number;
  total_downlines: number;
  posts_count: number;
  comments_count: number;
  best_answers_count: number;
  rank: number;
}

export interface AdminStats {
  total_users: number;
  new_users_today: number;
  new_users_week: number;
  new_users_month: number;
  organic_queue_count: number;
  placements_today: number;
  total_posts: number;
  total_comments: number;
}

// Contribution Ranking
export interface ContributionRankingItem {
  id: string;
  display_name: string;
  contribution_points: number;
  total_downlines: number;
  rank: number;
}
