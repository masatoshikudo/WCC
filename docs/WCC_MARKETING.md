# WCC — Marketing & 計測

> **For Your Wedding Day** の SEO・GA4・Meta / TikTok ピクセル・広告タグ実装方針。
>
> 関連ドキュメント:
> - `docs/WCC_BRAND.md`: サービス実態・文言トーン
> - `docs/WCC_STACK.md`: 技術スタック・連携方針
>
> 作成日: 2026-05-04（旧 `MARKETING.md` を統合）

---

## 実装の基本方針

- **シークレット・測定 ID はリポジトリに書かない。** 実値は Vercel の Environment Variables や `site/.env.local`（ローカルのみ）で管理する。プレースホルダは `site/.env.example` に追記する
- **本番と開発を分ける。** 開発で本番ピクセルにテストデータを送らない（未設定時はタグを出さない、またはテスト用 ID を別環境変数に分ける）
- **計測したくないパスを除外する**（例: `/admin` 配下に広告タグを載せないなど）はレイアウト分割で対応できる

---

## SEO（検索）

1. **目的キーワード**をページ単位で決める（トップ・予約・法務ページなど）
2. **技術 SEO**
   - 各ルートの `metadata`（`title` / `description`）。現状のデフォルトは `site/app/layout.tsx` の `export const metadata`
   - 必要に応じて **`sitemap.xml`** / **`robots.txt`**（Next.js の `app/sitemap.ts` / `app/robots.ts` 等）
   - 正規 URL の統一（`www` の有無、`https`、末尾スラッシュ）。`site/next.config.mjs` のリダイレクトと整合させる
   - 任意: OGP / Twitter Card、構造化データ（JSON-LD）
3. **Google Search Console** にプロパティを追加し、サイトマップを送信する
4. **コンテンツ**は `docs/WCC_BRAND.md` のトーン&ボイスと矛盾しない範囲で、検索意図に沿った見出し・説明を整える

---

## GA4（Google アナリティクス 4）

1. Google アナリティクスでプロパティを作成し、Web データストリームの **測定 ID（`G-xxxxxxxx`）** を取得する
2. `@next/third-parties` の `GoogleAnalytics` などでタグを読み込む（`site/app/layout.tsx` 付近に集約）
3. 環境変数例: `NEXT_PUBLIC_GA_MEASUREMENT_ID`（本番のみ設定推奨）
4. コンバージョン（予約完了など）は GA4 側の **キーイベント** 定義に合わせ、必要なら `gtag('event', ...)` でカスタムイベントを送る

---

## Meta（Facebook）ピクセル

1. Meta **イベントマネージャー**でピクセルを作成し、**ピクセル ID** を取得する
2. ベースコード: `fbevents.js` 読み込み → `fbq('init', 'ピクセルID')` → `fbq('track', 'PageView')`
3. Next.js では `next/script` の `strategy="afterInteractive"` で外部スクリプトを読み込む
4. **App Router のクライアント遷移**では `usePathname()` 等でパス変更時に再度 `fbq('track', 'PageView')` を送るか、GTM の **History Change** で送る
5. 環境変数例: `NEXT_PUBLIC_META_PIXEL_ID`

---

## TikTok ピクセル

1. TikTok Ads Manager でピクセルを作成し、**ピクセル ID** を取得する
2. 公式のベースコード（`ttq`）を読み込み、`ttq.page()` を実行する
3. Meta と同様、**クライアント遷移後のページビュー再送**を検討する
4. 環境変数例: `NEXT_PUBLIC_TIKTOK_PIXEL_ID`

---

## Google タグマネージャー（GTM）

タグの差し替えが多い場合は、サイトには **GTM コンテナ（`GTM-xxxx`）だけ** を埋め込み、Meta / TikTok / GA4 を GTM 側で管理する方法もある。SPA ページビューは GTM の **History Change** トリガーと連動させる。

---

## Core Web Vitals（既存実装）

`site/components/performance/WebVitalsReporter.tsx` が、本番で任意 URL に Core Web Vitals を JSON POST できる。

環境変数: `NEXT_PUBLIC_WEB_VITALS_ENDPOINT`（`site/.env.example` に記載あり）。GA4 とは別経路の RUM 用。

---

## プライバシー・同意

広告ピクセル・解析タグは **第三者へのデータ送信**に当たる。プライバシーポリシー（`/legal/privacy`）の更新や、対象地域・事業形態に応じた **同意バナー（CMP）** の要否は、法務・専門家の判断に委ねること。

---

## 実装チェックリスト（導入時）

- [ ] 測定 ID・ピクセル ID は環境変数のみ（コミットしない）
- [ ] 本番 Vercel にのみ本番用 ID を設定
- [ ] ルートレイアウトまたは専用コンポーネントにタグを集約し、`/admin` 等の除外方針を決める
- [ ] クライアント遷移時の **ページビュー再送**（Meta / TikTok / SPA 対応 GA）を確認
- [ ] 主要コンバージョン（予約送信完了など）のイベント名を広告・GA の設定と揃える
- [ ] Search Console とサイトマップ（導入する場合）

---

## 関連パス（コード）

| 内容 | パス |
|---|---|
| ルート metadata | `site/app/layout.tsx` |
| Web Vitals | `site/components/performance/WebVitalsReporter.tsx` |
| 環境変数の例 | `site/.env.example` |

---

*最終更新: 2026-05-04*
