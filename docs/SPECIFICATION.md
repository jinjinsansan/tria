# tria学習サロン 完全仕様書・開発計画書

**プロジェクト名**: tria Japan Salon
**バージョン**: 1.0
**作成日**: 2026年1月28日
**技術スタック**: Next.js 14 (App Router) + Supabase + Vercel

---

## 1. プロジェクト概要

### 1.1 コンセプト
「日本一triaを学べる無料オンラインサロン」

### 1.2 ミッション
- triaの情報を日本語で最も詳しく解説
- 初心者でも安心して学べるコミュニティ
- メンバー同士の助け合いで全員が成長

### 1.3 収益モデル
- サロン自体は完全無料
- オーガニック流入ユーザーを貢献度順にメンバーへ自動プレースメント
- 管理者枠（設定可能な比率）で組織拡大

---

## 2. 機能要件

### 2.1 ユーザー管理

#### 2.1.1 ユーザー種別
| 種別 | 説明 |
|------|------|
| マスター管理者 | 全権限 |
| サロンメンバー | 登録済みユーザー |
| オーガニックユーザー | 未登録の訪問者（キュー対象） |

#### 2.1.2 ユーザー登録
- メールアドレス + パスワード
- 登録時に紹介者コード入力（任意）
- メール認証必須

#### 2.1.3 プロフィール情報
- ユーザーID（自動生成）
- 表示名
- メールアドレス
- tria紹介URL（任意、後から設定可）
- 紹介者ID（登録時の紹介者）
- 貢献ポイント
- 累計獲得ダウンライン数
- 登録日時
- 最終ログイン日時

### 2.2 オンラインサロン機能

#### 2.2.1 フィード（Q&A）
- 質問投稿（タイトル、本文、タグ）
- 回答投稿
- いいね機能
- ベストアンサー選出（質問者が選択）
- タグフィルター
- 検索機能
- ソート（新着/人気/未回答）

#### 2.2.2 タグ一覧
- 初心者
- ウォレット
- カード申請
- KYC
- 送金・入金
- Earn（利回り）
- 紹介プログラム
- トラブル
- その他

#### 2.2.3 通知
- 自分の質問に回答がついた
- ベストアンサーに選ばれた
- いいねされた
- オートプレースメントで新規獲得
- 運営からのお知らせ

### 2.3 tria解説コンテンツ

#### 2.3.1 カテゴリ構成
1. triaとは - サービス概要、競合との違い、安全性について
2. 始め方 - アカウント登録、KYC（本人確認）、ウォレット作成
3. ウォレット機能 - 対応チェーン・トークン、入金方法、出金方法、スワップ
4. カード機能 - カードの種類と特典、申請手順、チャージ方法、キャッシュバック
5. Earn（利回り） - 仕組み解説、対応通貨とAPY、リスクについて
6. 紹介プログラム - XPシステム、マルチプライヤー、シーズン報酬
7. よくある質問 - トラブル対応、問い合わせ方法

### 2.4 オートプレースメント機能

#### 2.4.1 オーガニック判定
- 紹介コードなしでサイトに訪問 → オーガニック
- 紹介コードあり → その紹介者のダウンライン

#### 2.4.2 キュー管理
- オーガニックユーザーがtria登録時、キューに追加
- キューから貢献度順に割り振り

#### 2.4.3 貢献度計算
| アクション | ポイント |
|------------|----------|
| 質問投稿 | +5 |
| 回答投稿 | +10 |
| ベストアンサー獲得 | +30 |
| いいね獲得 | +2 |
| 毎日ログイン | +1 |
| 記事閲覧完了 | +3 |
| SNSシェア（検証あり） | +20 |

#### 2.4.4 管理者枠
- オーガニックの一定割合（デフォルト20%）は管理者へ
- 管理者パネルで比率調整可能

### 2.5 AI補助機能

#### 2.5.1 X投稿生成
- テンプレート選択
- カスタム指示入力
- tria紹介URL自動挿入
- サロンURL自動挿入

#### 2.5.2 note記事生成
- テーマ選択（体験談、解説、比較など）
- 構成提案
- 下書き生成
- 編集機能

### 2.6 管理者機能

#### 2.6.1 ダッシュボード
- 総ユーザー数
- 新規登録数（日/週/月）
- オーガニック流入数
- プレースメント実行数
- 貢献度ランキング

#### 2.6.2 ユーザー管理
- ユーザー一覧・検索
- 個別ユーザー詳細
- 手動貢献度調整
- アカウント停止

#### 2.6.3 コンテンツ管理
- 記事作成・編集・削除
- 記事の公開/非公開
- カテゴリ管理

#### 2.6.4 設定管理
- 管理者枠比率
- 貢献度ポイント設定
- 通知設定
- サイト基本情報

---

## 3. データベース設計

### 3.1 テーブル一覧

#### users
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| email | text | メールアドレス |
| display_name | text | 表示名 |
| tria_referral_url | text | tria紹介URL |
| referrer_id | uuid | 紹介者ID |
| contribution_points | int | 貢献ポイント |
| total_downlines | int | 累計獲得ダウンライン |
| is_admin | boolean | 管理者フラグ |
| created_at | timestamp | 登録日時 |
| last_login_at | timestamp | 最終ログイン |

#### articles
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| title | text | タイトル |
| slug | text | URLスラッグ |
| content | text | 本文（Markdown） |
| category | text | カテゴリ |
| is_published | boolean | 公開フラグ |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

#### posts（フィード投稿）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| user_id | uuid | 投稿者ID |
| title | text | タイトル |
| content | text | 本文 |
| tags | text[] | タグ配列 |
| is_answered | boolean | 回答済みフラグ |
| created_at | timestamp | 作成日時 |

#### comments（回答）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| post_id | uuid | 投稿ID |
| user_id | uuid | 回答者ID |
| content | text | 回答内容 |
| is_best_answer | boolean | ベストアンサー |
| created_at | timestamp | 作成日時 |

#### likes
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| user_id | uuid | いいねしたユーザー |
| target_type | text | 'post' or 'comment' |
| target_id | uuid | 対象ID |
| created_at | timestamp | 作成日時 |

#### organic_queue
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| visitor_id | text | 訪問者識別子 |
| source | text | 流入元 |
| status | text | pending/assigned/expired |
| assigned_to | uuid | 割り当て先ユーザー |
| created_at | timestamp | 作成日時 |
| assigned_at | timestamp | 割り当て日時 |

#### notifications
| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | PK |
| user_id | uuid | 通知先ユーザー |
| type | text | 通知種別 |
| content | text | 通知内容 |
| is_read | boolean | 既読フラグ |
| created_at | timestamp | 作成日時 |

#### settings
| カラム | 型 | 説明 |
|--------|-----|------|
| key | text | PK |
| value | jsonb | 設定値 |
| updated_at | timestamp | 更新日時 |

---

## 4. API設計

### 4.1 認証
- POST /api/auth/signup - 新規登録
- POST /api/auth/login - ログイン
- POST /api/auth/logout - ログアウト
- GET /api/auth/me - 現在のユーザー情報

### 4.2 ユーザー
- GET /api/users/:id - ユーザー詳細
- PATCH /api/users/:id - プロフィール更新
- GET /api/users/:id/stats - ユーザー統計

### 4.3 記事
- GET /api/articles - 記事一覧
- GET /api/articles/:slug - 記事詳細
- POST /api/articles - 記事作成（管理者）
- PATCH /api/articles/:id - 記事更新（管理者）
- DELETE /api/articles/:id - 記事削除（管理者）

### 4.4 フィード
- GET /api/posts - 投稿一覧
- GET /api/posts/:id - 投稿詳細
- POST /api/posts - 投稿作成
- DELETE /api/posts/:id - 投稿削除
- POST /api/posts/:id/comments - 回答投稿
- POST /api/posts/:id/best-answer - ベストアンサー設定
- POST /api/likes - いいね追加
- DELETE /api/likes/:id - いいね解除

### 4.5 AI補助
- POST /api/ai/generate-tweet - X投稿生成
- POST /api/ai/generate-note - note記事生成

### 4.6 管理者
- GET /api/admin/stats - 統計情報
- GET /api/admin/users - ユーザー一覧
- PATCH /api/admin/users/:id - ユーザー編集
- GET /api/admin/queue - キュー一覧
- POST /api/admin/queue/assign - 手動割り当て
- GET /api/admin/settings - 設定取得
- PATCH /api/admin/settings - 設定更新

---

## 5. UI/UXデザイン

### 5.1 デザインコンセプト
- triaの本体サイトを参考にした美しいデザイン
- ダークテーマベース
- グラデーション（紫〜青〜緑）をアクセントに
- 角丸、グラスモーフィズム

### 5.2 カラーパレット
- Primary: #8B5CF6（紫）
- Secondary: #06B6D4（シアン）
- Accent: #10B981（緑）
- Background: #0F0F0F
- Surface: #1A1A1A
- Text: #FFFFFF / #A1A1A1

---

## 6. ページ構成

```
/                      - LP（未ログイン）/ ダッシュボード（ログイン済）
/login                 - ログイン
/signup                - 新規登録
/signup?ref=CODE       - 紹介経由登録
/learn                 - 学ぶ（記事一覧）
/learn/:slug           - 記事詳細
/feed                  - フィード
/feed/:id              - 投稿詳細
/ai                    - AI補助
/settings              - 設定
/settings/profile      - プロフィール編集
/settings/tria-url     - tria紹介URL設定
/go/tria               - tria登録リダイレクト（プレースメント実行）
/admin                 - 管理者ダッシュボード
/admin/users           - ユーザー管理
/admin/articles        - 記事管理
/admin/settings        - 設定管理
```

---

## 7. 開発計画

### Phase 1: 基盤構築（Week 1）
- [ ] プロジェクトセットアップ（Next.js + Supabase）
- [ ] 認証機能
- [ ] データベース構築
- [ ] 基本レイアウト・UIコンポーネント

### Phase 2: コア機能（Week 2）
- [ ] ユーザーダッシュボード
- [ ] 解説記事CMS
- [ ] 記事表示ページ

### Phase 3: コミュニティ機能（Week 3）
- [ ] フィード（Q&A）機能
- [ ] いいね機能
- [ ] ベストアンサー機能
- [ ] 通知機能

### Phase 4: プレースメント機能（Week 4）
- [ ] 紹介リンク生成
- [ ] オーガニック判定
- [ ] キュー管理
- [ ] プレースメント実行

### Phase 5: AI補助機能（Week 5）
- [ ] X投稿生成
- [ ] note記事生成
- [ ] Claude API連携

### Phase 6: 管理者機能（Week 6）
- [ ] 管理者ダッシュボード
- [ ] ユーザー管理
- [ ] コンテンツ管理
- [ ] 設定管理

### Phase 7: テスト・リリース（Week 7）
- [ ] 総合テスト
- [ ] パフォーマンス最適化
- [ ] 本番デプロイ
- [ ] 初期コンテンツ投入

---

## 8. 環境変数

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Claude API
ANTHROPIC_API_KEY=

# サイト設定
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SITE_NAME=tria Japan Salon

# 管理者
ADMIN_EMAIL=
```

---

## 9. デプロイ設定

### Vercel
```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### ドメイン
- 本番: tria-salon.jp（仮）
- 開発: tria-salon-dev.vercel.app

---

## 10. 今後の拡張案

- LINE通知連携
- Discord連携
- ランキングページ
- バッジシステム
- 月間MVP表彰
- オフラインイベント管理
