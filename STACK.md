# WCC事業サイト 技術スタック

## 概要

ウェディング・コンテンツ・クリエイター（WCC）向けサイト。LP（料金は `/#pricing`、実績ギャラリーは `/#highlights`）・問い合わせ・予約（Stripe Payment Link）を提供する。

**実装**: リポジトリ直下の **`site/`**（Next.js 14 App Router）。見た目の一次情報は **`DESIGN.md`**、文言は **`VOICE.md`** を参照。

---

## 採用技術と役割

| 技術 | 役割 |
| :--- | :--- |
| **Next.js 14**（App Router） | ページルーティング、Server Actions、本番ビルド |
| **TypeScript** | 型付け |
| **Tailwind CSS** | スタイリング |
| **React Hook Form** + **Zod**（+ **@hookform/resolvers**） | 問い合わせフォームの状態とバリデーション |
| **clsx** + **tailwind-merge** | 条件付きクラス結合（`cn`） |
| **server-only** | サーバー専用モジュールの境界 |
| **Vercel** | ホスティング・デプロイ想定 |
| **Supabase**（`@supabase/supabase-js`） | PostgreSQL。問い合わせ・**予約 intent / 決済完了**の保存（書き込みは Server Actions + service_role） |
| **Resend** | 問い合わせ・予約完了の通知メール（HTML 文字列で送信） |
| **Stripe** | **Payment Link**（パッケージ料金・一括）を環境変数の URL で開き、外部決済（サイト内に SDK は未導入）。成功 URL に `session_id` を付与可能 |

---

## データの流れ（現状）

- **問い合わせ**: フォーム → Server Action → `contact_inquiries` へ insert → Resend。
- **予約**: ステップ3で **`booking_intents`**（試行 ID 付き）へ insert。決済成功画面で **`booking_payments`** へ insert（初回のみ）→ 確認メール送信。payload は `sessionStorage` 経由（`attemptId` で intent と突合）。
- **管理**: `/admin/login` → `/admin/bookings` で一覧（パスワード + `ADMIN_BOOKINGS_SECRET` によるセッション）。

---

## 環境変数（代表）

`.env.example` を参照。Supabase・Resend・Stripe Payment Link、`CONTACT_NOTIFY_EMAIL`、**`ADMIN_BOOKINGS_PASSWORD` / `ADMIN_BOOKINGS_SECRET`**（管理画面）など。

---

## 予定（未実装・任意）

- Stripe **Webhook** で決済を正とした更新・**Payment Link 成功 URL の `session_id` 取得**の恒久化  
- **react-email** 等によるメールテンプレのコンポーネント化  
- 縦動画の **Cloudinary / Vercel Blob**、Instagram **oEmbed** 本番組み込み  

DB スキーマの SQL は **`reference/supabase_bookings.sql`**（予約）、**`reference/supabase_contact_inquiries.sql`**（問い合わせ）。バージョン固定の詳細は **`site/package.json`** を正とする。
