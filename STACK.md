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

## パフォーマンス（Phase 0: 計測・目標固定）

**目的:** 体感の遅さを数値化し、LCP の主因（動画・フォント・テキスト等）を切り分ける。計測は **`next dev` ではなく本番相当**（`next build` → `next start`）またはデプロイ先で行う。

### 目標（WCC 合意・モバイル想定の目安）

| 指標 | 目標（目安） | 備考 |
| :--- | :--- | :--- |
| **LCP** | 2.5s 以内 | トップはヒーロー動画・フォントの影響が大きい想定 |
| **INP** | 200ms 付近 | 予約フォーム操作を優先して監視 |
| **CLS** | 0.1 以下 | 固定ヘッダー・下部 CTA まわりのずれに注意 |

「良い / 要改善」は Lighthouse や Chrome の **Web Vitals 拡張**のレーティングに準拠し、未達なら Phase 1 以降の施策で是正する。

### ラボ計測（Lighthouse）

1. `site/` で **`npm run build`** のあと **`npm run start`**（既定ポート 3000）。
2. 別ターミナルで同じく `site/` から:
   - **モバイル相当:** `npm run perf:lighthouse:mobile`
   - **デスクトップ相当:** `npm run perf:lighthouse:desktop`
3. 生成物: `lighthouse-mobile.html` / `lighthouse-desktop.html`（リポジトリでは `.gitignore` 済み）。HTML をブラウザで開き **Performance カテゴリ**と **LCP 要素**を確認する。

Chrome が入っているマシンで実行する（Lighthouse はヘッドレス Chrome を起動する）。トップは動画が多いため **完了までに数分かかる**ことがある。スクリプトは `--max-wait-for-load=120000`（120 秒）を指定済み。

### 開発者コンソール（Core Web Vitals）

`site/components/performance/WebVitalsReporter.tsx` が **`useReportWebVitals`** でメトリクスを送る。

- **開発:** ブラウザのコンソールに `[web-vitals]` ログが出る。
- **本番:** `.env` に **`NEXT_PUBLIC_WEB_VITALS_ENDPOINT`** を置いたときだけ、同一オリジンまたは許可した収集先へ JSON POST（未設定なら送信しない）。

### Network / Performance パネル（LCP の特定）

1. Chrome DevTools → **Network** で初回ロード時の大きいリクエスト（`/videos/*.mp4`、フォント）を確認。
2. **Performance** 記録で LCP 候補ノード（タイムライン上の **LCP** マーカー）が `video` / `img` / テキストのどれかを対応付ける。

### 注意

- **Dropbox 配下の `next dev`** は `next.config.mjs` の都合で webpack ファイルキャッシュがオフになり、**コンパイルが遅く感じる**ことがある。表示速度の評価は **`next start` または Vercel プレビュー**を正とする。

---

## パフォーマンス（Phase 1: 低リスクの最適化・実装済み）

- **`#highlights`:** `HomeHighlightLazyVideo`（`site/components/home/HomeHighlightLazyVideo.tsx`）で、ビューポート付近に来るまで **動画 `src` を載せず** ポスターのみ表示。進入後に `<video>` をマウントして再生。
- **ヒーローマルquee:** 12 スロットは維持（`translateX(-50%)` の無限ループと整合）。各 6 枚ブロックの **先頭 2 枚だけ `preload="metadata"`**、残りは **`preload="none"`**。先頭列は **`fetchPriority="high"`**、末尾付近は **`low`**。
- **ポスター:** `site/public/images/highlight-posters/wc-sample-{1..6}.webp` と `site/lib/home-highlight-videos.ts` で対応付け。現状は **軽量の縦グラデ**（先頭フレームではない）。実映像のサムネに差し替える例（`ffmpeg` 利用・プロジェクトルート想定）:

```bash
for i in 1 2 3 4 5 6; do
  ffmpeg -y -ss 00:00:01 -i "site/public/videos/WC_movie_sample_${i}.mp4" \
    -frames:v 1 -vf "scale=720:-1" \
    "site/public/images/highlight-posters/wc-sample-${i}.webp"
done
```

- **フォント:** `Plus_Jakarta_Sans` のウェイトを **400 / 600 / 700** に整理（`font-medium` は display 未使用のため除外）。`Noto_Sans_JP` は Next 14.2 の `next/font` で **`japanese` subset が未提供**のため `latin` のみ（日本語は従来どおりのレンダリング）。

---

## パフォーマンス（Phase 2: バンドル分割・実装済み）

- **`next/dynamic`** でチャンク分割し、初回に不要な JS の同時評価を抑える。
- **`/book`:** `BookFlow` を動的 import。読み込み中は `BookFlowLoading`（`site/components/book/BookFlowLoading.tsx`）。
- **トップ:** ヒーロー背面の `HeroHighlightCarousel`、および折りたたみ下の **`HomePricingSection` / `HomeServiceFlowSection` / `HomeFaqSection`** を動的 import。待機中は `HomeDynamicSkeletons.tsx` のプレースホルダー（`#pricing` / `#service-flow` / `#faq` の **id は維持**してアンカージャンプを壊さない）。

---

## 環境変数（代表）

`.env.example` を参照。Supabase・Resend・Stripe 関連、**`ADMIN_BOOKINGS_PASSWORD` / `ADMIN_BOOKINGS_SECRET`**（管理画面）など。

---

## 予定（未実装・任意）

- Stripe **Webhook** で `quote / invoice` の状態同期を自動化  
- **react-email** 等によるメールテンプレのコンポーネント化  
- 縦動画の **Cloudinary / Vercel Blob**、Instagram **oEmbed** 本番組み込み  

DB スキーマの SQL は **`reference/supabase_bookings.sql`**（予約）を運用対象とする。過去の問い合わせ用 SQL は **`reference/supabase_contact_inquiries.sql`** に履歴として残している。バージョン固定の詳細は **`site/package.json`** を正とする。
