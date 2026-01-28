-- tria-salon Supabase Database Schema
-- 実行順序: このファイル全体をSupabase SQL Editorで実行

-- ===========================================
-- 1. 拡張機能の有効化
-- ===========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 2. テーブル作成
-- ===========================================

-- ユーザーテーブル（Supabase Authと連携）
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    tria_referral_url TEXT,
    referrer_id UUID REFERENCES public.users(id),
    referral_code TEXT UNIQUE DEFAULT gen_random_uuid()::text,
    contribution_points INTEGER DEFAULT 0,
    total_downlines INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 記事テーブル
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- フィード投稿テーブル
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_answered BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- コメント（回答）テーブル
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_best_answer BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- いいねテーブル
CREATE TABLE public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

-- オーガニックキューテーブル
CREATE TABLE public.organic_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visitor_id TEXT NOT NULL,
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'expired', 'converted')),
    assigned_to UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_at TIMESTAMP WITH TIME ZONE
);

-- 通知テーブル
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 設定テーブル
CREATE TABLE public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 貢献度履歴テーブル
CREATE TABLE public.contribution_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    points INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 3. インデックス作成
-- ===========================================

CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_users_contribution_points ON public.users(contribution_points DESC);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_category ON public.articles(category);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_likes_target ON public.likes(target_type, target_id);
CREATE INDEX idx_organic_queue_status ON public.organic_queue(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(user_id, is_read);

-- ===========================================
-- 4. RLS（Row Level Security）設定
-- ===========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organic_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_history ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Articles policies
CREATE POLICY "Anyone can view published articles" ON public.articles
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage articles" ON public.articles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
    );

-- Posts policies
CREATE POLICY "Anyone can view posts" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON public.comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.comments
    FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes" ON public.likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create likes" ON public.likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON public.likes
    FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Organic queue policies (admin only)
CREATE POLICY "Admins can manage organic queue" ON public.organic_queue
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
    );

-- Settings policies (admin only)
CREATE POLICY "Anyone can read settings" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" ON public.settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
    );

-- Contribution history policies
CREATE POLICY "Users can view own contribution history" ON public.contribution_history
    FOR SELECT USING (auth.uid() = user_id);

-- ===========================================
-- 5. Functions
-- ===========================================

-- 新規ユーザー作成時のトリガー関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, display_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガー作成
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 貢献度追加関数
CREATE OR REPLACE FUNCTION public.add_contribution_points(
    p_user_id UUID,
    p_action TEXT,
    p_points INTEGER,
    p_description TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- ポイント追加
    UPDATE public.users
    SET contribution_points = contribution_points + p_points
    WHERE id = p_user_id;
    
    -- 履歴追加
    INSERT INTO public.contribution_history (user_id, action, points, description)
    VALUES (p_user_id, p_action, p_points, p_description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- オートプレースメント実行関数
CREATE OR REPLACE FUNCTION public.execute_auto_placement(
    p_queue_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_admin_ratio FLOAT;
    v_is_admin_turn BOOLEAN;
    v_assigned_user_id UUID;
    v_admin_id UUID;
BEGIN
    -- 管理者枠比率を取得
    SELECT (value->>'admin_ratio')::FLOAT INTO v_admin_ratio
    FROM public.settings WHERE key = 'placement_settings';
    
    v_admin_ratio := COALESCE(v_admin_ratio, 0.2);
    
    -- 管理者IDを取得
    SELECT id INTO v_admin_id FROM public.users WHERE is_admin = true LIMIT 1;
    
    -- 管理者ターンかどうか判定（ランダム）
    v_is_admin_turn := random() < v_admin_ratio;
    
    IF v_is_admin_turn AND v_admin_id IS NOT NULL THEN
        v_assigned_user_id := v_admin_id;
    ELSE
        -- 貢献度順でユーザーを取得（tria URLが設定されている人のみ）
        SELECT id INTO v_assigned_user_id
        FROM public.users
        WHERE tria_referral_url IS NOT NULL
          AND tria_referral_url != ''
          AND is_admin = false
        ORDER BY contribution_points DESC
        LIMIT 1;
    END IF;
    
    -- キューを更新
    IF v_assigned_user_id IS NOT NULL THEN
        UPDATE public.organic_queue
        SET status = 'assigned',
            assigned_to = v_assigned_user_id,
            assigned_at = NOW()
        WHERE id = p_queue_id;
        
        -- 通知を作成
        INSERT INTO public.notifications (user_id, type, title, content)
        VALUES (
            v_assigned_user_id,
            'placement',
            '新規ユーザーが割り当てられました！',
            'オートプレースメントで新しいユーザーがあなたに割り当てられました。'
        );
        
        -- ダウンライン数を増加
        UPDATE public.users
        SET total_downlines = total_downlines + 1
        WHERE id = v_assigned_user_id;
    END IF;
    
    RETURN v_assigned_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- 6. 初期データ
-- ===========================================

-- 設定の初期値
INSERT INTO public.settings (key, value) VALUES
    ('placement_settings', '{"admin_ratio": 0.2}'),
    ('contribution_points', '{
        "post_create": 5,
        "comment_create": 10,
        "best_answer": 30,
        "like_received": 2,
        "daily_login": 1,
        "article_read": 3,
        "sns_share": 20
    }'),
    ('site_info', '{
        "name": "tria Japan Salon",
        "description": "日本一triaを学べる無料オンラインサロン"
    }')
ON CONFLICT (key) DO NOTHING;

-- ===========================================
-- 7. ビュー作成
-- ===========================================

-- 貢献度ランキングビュー
CREATE OR REPLACE VIEW public.contribution_ranking AS
SELECT
    u.id,
    u.display_name,
    u.contribution_points,
    u.total_downlines,
    RANK() OVER (ORDER BY u.contribution_points DESC) as rank
FROM public.users u
WHERE u.tria_referral_url IS NOT NULL
ORDER BY u.contribution_points DESC;
