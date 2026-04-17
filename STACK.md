# WCC事業サイト 技術スタック

## 概要

ウェディング・コンテンツ・クリエイター（WCC）事業のウェブサイトに必要な技術スタック。
LP表示・問い合わせ・予約・オンライン決済・ポートフォリオ表示を要件とする。

**実装コード**: リポジトリ直下の **`site/`**（Next.js 14 App Router）。デザイントークン・ルート骨格は **`reference/implementation_phase5.md`** と `DESIGN.md` フェーズ3〜5 に対応。

---

## フロントエンド

| 技術 | バージョン | 用途 |
| :--- | :--- | :--- |
| [Next.js](https://nextjs.org/) | 14以上（App Router） | フレームワーク。SSG/SSRによる高速表示 |
| TypeScript | 5以上 | 型安全な開発。AI補完精度の向上 |
| [Tailwind CSS](https://tailwindcss.com/) | 3以上 | ユーティリティファーストのスタイリング |
| [React Hook Form](https://react-hook-form.com/) | 7以上 | 問い合わせ・予約フォームの管理とバリデーション |

---

## バックエンド・インフラ

| 技術 | 用途 |
| :--- | :--- |
| [Vercel](https://vercel.com/) | ホスティング・デプロイ。Next.jsと同一エコシステム。無料枠で運用可能 |
| [Supabase](https://supabase.com/) | データベース（PostgreSQL）・認証。問い合わせ・予約データの保存 |

---

## 決済

| 技術 | 用途 |
| :--- | :--- |
| [Stripe](https://stripe.com/jp) | カード決済・請求書発行。デポジット50%→残金50%の2段階決済を実装 |
| [@stripe/stripe-js](https://github.com/stripe/stripe-js) | フロントエンド用Stripe SDK |
| [stripe](https://github.com/stripe/stripe-node) (stripe-node) | バックエンド用Stripe SDK（Webhook処理） |

---

## メール通知

| 技術 | 用途 |
| :--- | :--- |
| [Resend](https://resend.com/) | 問い合わせ受付・予約確定・入金確認メールの自動送信 |
| [react-email](https://react.email/) | メールテンプレートをReactコンポーネントで作成 |

---

## 動画・メディア

| 技術 | 用途 |
| :--- | :--- |
| [Cloudinary](https://cloudinary.com/) または [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | 縦型動画（9:16）のアップロード・最適化配信 |
| Instagram oEmbed API | 公式Reelsの埋め込み表示 |

---

## アーキテクチャ

```
[ユーザー（プレ花嫁）]
        ↓
[Next.js on Vercel]  ← Tailwind CSS でスタイリング
        ↓
┌───────────────────────────────┐
│  /          LP（サービス紹介）  │
│  /packages  パッケージ・料金   │
│  /portfolio ポートフォリオ     │
│  /contact   問い合わせフォーム │
│  /book      予約・決済         │
└───────────────────────────────┘
        ↓
[Supabase]  ← 問い合わせ・予約データ保存
        ↓
[Stripe Checkout]  ← デポジット（50%）→ 残金（50%）の2段階決済
        ↓
[Resend]  ← 予約確定・入金確認メールの自動送信
```

---

## 実装優先順位（MVP）

バイブコーディングで最速で動かすための推奨順序。

```
Step 1  Next.js + Tailwind でLP静的ページ作成 → Vercelにデプロイ
Step 2  Stripe Payment Links を埋め込み（デポジット決済を最小コードで実現）
Step 3  React Hook Form + Supabase で問い合わせフォーム実装
Step 4  Resend で問い合わせ受付・予約確定メールの自動送信
Step 5  Cloudinary or Vercel Blob で縦型動画ポートフォリオ表示
Step 6  Stripe Webhook でデポジット入金確認 → 残金請求の自動化
```

---

## パッケージ一覧（package.json 参考）

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "react-hook-form": "^7.0.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.0.0",
    "stripe": "^14.0.0",
    "@stripe/stripe-js": "^2.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "resend": "^3.0.0",
    "@react-email/components": "^0.0.20"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

---

## 環境変数（.env.local）

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# Cloudinary（動画ホスティングを使う場合）
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
