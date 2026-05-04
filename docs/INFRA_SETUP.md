# INFRA_SETUP.md

Phase 0 → Phase 1 移行のためのインフラ準備チェックリスト。
**Phase 1 移行済み（2026-05-04）。残項目は Phase 1 中に随時消化する。**

> 関連ドキュメント: `docs/WCC_ARCHITECTURE.md` セクション 8

---

## GitHub

- [x] リモートリポジトリを GitHub に作成し、現在のローカルリポジトリを push（`masatoshikudo/WCC`）
- [ ] `main` ブランチ保護ルール設定 (force push 禁止)
- [x] `.gitignore` に `.env*` が含まれていることを確認 ← 確認済み

## Vercel

- [x] Vercel プロジェクト作成（本番動作確認済み）
- [x] 既存 LP (`for-your-wedding-day.com`) のドメインを Vercel に接続
- [x] 環境変数の初期設定 (下記「環境変数一覧」参照)

## Supabase

- [x] Supabase プロジェクト作成（`booking_intents` 書き込み・本番動作確認済み）
- ~~`supabase/migrations/` の 3 ファイルを適用~~ → **退避済み。Phase 2 以降の将来構想 SQL であり適用しない**
  - 3ファイルは `reference/future-schema/` に移動済み（`afa8e8b`）
  - 現行 Phase 0 スキーマ（`booking_intents` 等）は `reference/supabase_bookings.sql` を参照
- [x] `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を取得・設定済み
- [x] `SUPABASE_SERVICE_ROLE_KEY` を Vercel 環境変数に設定済み

## Stripe

- [ ] Stripe アカウントの整理 (Tinykomainu と分けるか統合するか判断)
- [ ] 本番用の公開鍵・秘密鍵を取得
- [ ] Stripe Webhook エンドポイント登録 (`/api/stripe/webhook`)
- [ ] `STRIPE_SECRET_KEY` と `STRIPE_WEBHOOK_SECRET` を Vercel 環境変数に設定

## LINE Messaging API

- [ ] LINE 公式アカウント開設 (Messaging API 対応プラン)
- [ ] LINE Developers でチャンネル作成
- [ ] Webhook URL 設定 (`/api/line/webhook`)
- [ ] `LINE_CHANNEL_SECRET` と `LINE_CHANNEL_ACCESS_TOKEN` を Vercel 環境変数に設定

## Resend

- [x] Resend アカウント確認（メール送信・本番動作確認済み）
- [x] ドメイン認証 (`for-your-wedding-day.com`)
- [x] `RESEND_API_KEY` と `RESEND_FROM` を Vercel 環境変数に設定済み
  - 注: 環境変数名は `RESEND_FROM`（コード・`.env.example` 準拠）。`RESEND_FROM_EMAIL` は誤記。
- [x] `OWNER_NOTIFICATION_EMAIL` を Vercel 環境変数に設定済み（運営者通知メール宛先）

## SNS アカウント

- [ ] Instagram 実績アカウント開設
- [ ] TikTok 実績アカウント開設
- [ ] 最初の作例投稿 5〜10 本
- [ ] LP の SNS アイコンリンクを実績アカウントに更新 (`docs/LP_REVISION_PLAN.md` P0 参照)

## 環境変数一覧

Vercel に設定する環境変数のリスト (値はここに書かない):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY          # サーバーサイドのみ、クライアントに露出禁止
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
LINE_CHANNEL_SECRET
LINE_CHANNEL_ACCESS_TOKEN
RESEND_API_KEY
RESEND_FROM
OWNER_NOTIFICATION_EMAIL
NEXT_PUBLIC_APP_URL
```

## 完了後の作業

全項目チェック完了後:

1. `docs/WCC_ARCHITECTURE.md` セクション 8 の「着手時にやること」を再確認
2. `docs/WCC_ROADMAP.md` (未作成) を起草する — Phase 1 の週次計画
3. `CLAUDE.md` の開発フェーズを `Phase 1: MVP 実装中` に更新する

---

*最終更新: 2026-05-01*
