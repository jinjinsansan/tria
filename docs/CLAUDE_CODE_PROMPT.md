# tria Japan Salon - Claude Code 初期プロンプト

## プロジェクト概要

日本一triaを学べる無料オンラインサロンを構築します。

**技術スタック:**
- Next.js 14 (App Router)
- Supabase (認証・DB)
- TailwindCSS + shadcn/ui
- Claude API (AI補助機能)
- Vercel (デプロイ)

## 仕様書

詳細は `docs/SPECIFICATION.md` を参照してください。

## 主要機能

1. **ユーザー認証**: メール/パスワード、Supabase Auth
2. **解説コンテンツ**: tria解説記事のCMS
3. **フィード（Q&A）**: 質問・回答・いいね・ベストアンサー
4. **オートプレースメント**: オーガニック流入を貢献度順に割り振り
5. **AI補助**: X投稿生成、note記事生成
6. **管理者パネル**: ユーザー管理、コンテンツ管理、設定

## デザイン

- triaの本体サイト（https://app.tria.so）を参考にした美しいデザイン
- ダークテーマベース
- グラデーション（紫〜青〜緑）をアクセント
- 角丸、グラスモーフィズム

## 開始手順

### 1. プロジェクトセットアップ

```bash
npx create-next-app@latest tria-salon --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd tria-salon
```

### 2. 依存関係インストール

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @anthropic-ai/sdk
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npx shadcn-ui@latest init
```

### 3. Supabaseセットアップ

1. https://supabase.com でプロジェクト作成
2. `docs/DATABASE.sql` をSQL Editorで実行
3. 環境変数を `.env.local` に設定

### 4. 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 開発順序

### Phase 1: 基盤（今やること）

1. プロジェクト初期化
2. Supabase接続設定
3. 認証機能（登録・ログイン・ログアウト）
4. 基本レイアウト（ナビゲーション、フッター）
5. ダッシュボード画面

### Phase 2: コンテンツ

1. 記事一覧ページ
2. 記事詳細ページ
3. 管理者用記事エディタ

### Phase 3: コミュニティ

1. フィード一覧
2. 投稿作成
3. コメント機能
4. いいね機能
5. ベストアンサー機能

### Phase 4: プレースメント

1. 紹介コード生成
2. オーガニック判定
3. キュー管理
4. 自動割り振り

### Phase 5: AI補助

1. X投稿生成
2. note記事生成

### Phase 6: 管理者

1. ダッシュボード
2. ユーザー管理
3. 設定管理

## ファイル構成

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── page.tsx (ダッシュボード)
│   │   ├── learn/
│   │   ├── feed/
│   │   ├── ai/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── (admin)/
│   │   └── admin/
│   ├── api/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn)
│   ├── layout/
│   └── features/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── anthropic.ts
│   └── utils.ts
└── types/
    └── index.ts
```

## 開発開始

まず Phase 1 から始めてください。

1. `docs/SPECIFICATION.md` を読んで全体像を把握
2. プロジェクトをセットアップ
3. Supabase接続を設定
4. 認証機能を実装
5. 基本レイアウトを作成
