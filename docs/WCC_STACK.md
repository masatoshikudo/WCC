# WCC — Stack & 運用方針

> **For Your Wedding Day** の技術スタック・外部連携方針・パフォーマンス計画。
> 技術設計・DB 設計は `docs/WCC_ARCHITECTURE.md` を参照。
>
> 関連ドキュメント:
> - `docs/WCC_ARCHITECTURE.md`: DB 設計・ルーティング・データフロー
> - `docs/WCC_BRAND.md`: 見た目・文言トーン
>
> 作成日: 2026-05-04（旧 `STACK.md` を統合）

---

## 採用技術と役割

| 技術 | 役割 |
|---|---|
| **Next.js 14**（App Router） | ページルーティング、Server Actions、本番ビルド |
| **TypeScript** | 型付け |
| **Tailwind CSS** | スタイリング |
| **React Hook Form** + **Zod** + `@hookform/resolvers` | 予約フォームの状態とバリデーション |
| **clsx** + **tailwind-merge** | 条件付きクラス結合（`cn`） |
| **server-only** | サーバー専用モジュールの境界 |
| **Vercel** | ホスティング・デプロイ想定 |
| **Supabase**（`@supabase/supabase-js`） | PostgreSQL。予約 intent / 見積 / 決済反映の保存（書き込みは Server Actions + service_role） |
| **Resend** | 見積連絡・予約完了の通知メール（HTML 文字列で送信） |
| **Stripe** | **Quote / Invoice / Hosted Payment Page** を主運用。必要に応じて Payment Link を補助利用 |

---

## 運用方針（Stripe 中心・To-Be）

- 一次 CV は「決済完了」ではなく「相談 / 仮予約」中心にする
- 見積提示は Stripe `Quote` を正とする
- 請求・支払いは Stripe `Invoice` + Hosted Payment Page を正とする
- 自サイトは顧客文脈（挙式日・要望・メモ）管理を中心にする
- admin 設計の意図: **主運用は Stripe Dashboard**、admin は補助ビューとして使う
- 決済確定は段階的に Stripe Webhook 同期へ移行する

---

## 環境変数（代表）

`site/.env.example` を参照。Supabase・Resend・Stripe 関連、**`ADMIN_BOOKINGS_PASSWORD` / `ADMIN_BOOKINGS_SECRET`**（管理画面）など。

全環境変数の一覧は `docs/INFRA_SETUP.md` の「環境変数一覧」セクションを参照。

---

## パフォーマンス（Phase 0: 計測・目標固定）

**目的:** 体感の遅さを数値化し、LCP の主因（動画・フォント・テキスト等）を切り分ける。計測は **`next dev` ではなく本番相当**（`next build` → `next start`）またはデプロイ先で行う。

### 目標（WCC 合意・モバイル想定の目安）

| 指標 | 目標 | 備考 |
|---|---|---|
| **LCP** | 2.5s 以内 | トップはヒーロー動画・フォントの影響が大きい想定 |
| **INP** | 200ms 付近 | 予約フォーム操作を優先して監視 |
| **CLS** | 0.1 以下 | 固定ヘッダー・下部 CTA まわりのずれに注意 |

### ラボ計測（Lighthouse）

```bash
# site/ で
npm run build && npm run start
# 別ターミナルで
npm run perf:lighthouse:mobile   # → lighthouse-mobile.html
npm run perf:lighthouse:desktop  # → lighthouse-desktop.html
```

Chrome が入っているマシンで実行する（Lighthouse はヘッドレス Chrome を起動）。

---

## パフォーマンス（Phase 1: 低リスクの最適化・実装済み）

- **`#highlights`:** `HomeHighlightLazyVideo` でビューポート付近に来るまで動画 `src` を載せずポスターのみ表示
- **ヒーローマルキー:** 先頭 2 枚だけ `preload="metadata"`、残りは `preload="none"`。先頭列は `fetchPriority="high"`
- **ポスター:** `site/public/images/highlight-posters/wc-sample-{1..6}.webp`。実映像サムネへの差し替え例:

```bash
for i in 1 2 3 4 5 6; do
  ffmpeg -y -ss 00:00:01 -i "site/public/videos/WC_movie_sample_${i}.mp4" \
    -frames:v 1 -vf "scale=720:-1" \
    "site/public/images/highlight-posters/wc-sample-${i}.webp"
done
```

---

## パフォーマンス（Phase 2: バンドル分割・実装済み）

- **`next/dynamic`** でチャンク分割し、初回に不要な JS の同時評価を抑える
- **`/book`:** `BookFlow` を動的 import（読み込み中は `BookFlowLoading`）
- **トップ:** `HeroHighlightCarousel` / `HomePricingSection` / `HomeServiceFlowSection` / `HomeFaqSection` を動的 import（`HomeDynamicSkeletons.tsx` でプレースホルダ）

---

## 予定（未実装・任意）

- Stripe **Webhook** で `quote / invoice` の状態同期を自動化
- **react-email** 等によるメールテンプレのコンポーネント化
- 縦動画の **Cloudinary / Vercel Blob**、Instagram **oEmbed** 本番組み込み

---

*最終更新: 2026-05-04*
