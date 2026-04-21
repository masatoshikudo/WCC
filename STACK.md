# WCC事業サイト 技術スタック

## 概要

ウェディング・コンテンツ・クリエイター（WCC）向けサイト。LP（料金は `/#pricing`、実績ギャラリーは `/#highlights`）・予約導線を提供する。  
決済運用は **Stripe の Quote / Invoice / Hosted Payment Page 中心**へ移行する方針（2026-04更新）。

**実装**: リポジトリ直下の **`site/`**（Next.js 14 App Router）。見た目の一次情報は **`DESIGN.md`**、文言は **`VOICE.md`** を参照。

---

## 採用技術と役割

| 技術 | 役割 |
| :--- | :--- |
| **Next.js 14**（App Router） | ページルーティング、Server Actions、本番ビルド |
| **TypeScript** | 型付け |
| **Tailwind CSS** | スタイリング |
| **React Hook Form** + **Zod**（+ **@hookform/resolvers**） | 予約フォームの状態とバリデーション |
| **clsx** + **tailwind-merge** | 条件付きクラス結合（`cn`） |
| **server-only** | サーバー専用モジュールの境界 |
| **Vercel** | ホスティング・デプロイ想定 |
| **Supabase**（`@supabase/supabase-js`） | PostgreSQL。予約 intent / 見積 / 決済反映の保存（書き込みは Server Actions + service_role） |
| **Resend** | 見積連絡・予約完了の通知メール（HTML 文字列で送信） |
| **Stripe** | **Quote / Invoice / Hosted Payment Page** を主運用。必要に応じて Payment Link を補助利用 |

---

## データの流れ（現状実装）

- **予約**: ステップ3で **`booking_intents`**（試行 ID 付き）へ insert。決済成功画面で **`booking_payments`** へ insert（初回のみ）→ 確認メール送信。payload は `sessionStorage` 経由（`attemptId` で intent と突合）。
- **見積（フェーズ1実装）**: `booking_quotes` で見積ステータス・内訳・Stripe参照 ID を保持。
- **管理**: `/admin/login` → `/admin/bookings` で予約・見積・決済を一覧化（パスワード + `ADMIN_BOOKINGS_SECRET` によるセッション）。

---

## 運用方針（Stripe中心・To-Be）

- 一次CVは「決済完了」ではなく「相談 / 仮予約」中心にする
- 見積提示は Stripe `Quote` を正とする
- 請求・支払いは Stripe `Invoice` + Hosted Payment Page を正とする
- 自サイトは顧客文脈（挙式日・要望・メモ）管理を中心にする
- 決済確定は段階的に Stripe Webhook 同期へ移行する

---

## 環境変数（代表）

`.env.example` を参照。Supabase・Resend・Stripe 関連、**`ADMIN_BOOKINGS_PASSWORD` / `ADMIN_BOOKINGS_SECRET`**（管理画面）など。

---

## 予定（未実装・任意）

- Stripe **Webhook** で `quote / invoice` の状態同期を自動化  
- **react-email** 等によるメールテンプレのコンポーネント化  
- 縦動画の **Cloudinary / Vercel Blob**、Instagram **oEmbed** 本番組み込み  

DB スキーマの SQL は **`reference/supabase_bookings.sql`**（予約）を運用対象とする。過去の問い合わせ用 SQL は **`reference/supabase_contact_inquiries.sql`** に履歴として残している。バージョン固定の詳細は **`site/package.json`** を正とする。
