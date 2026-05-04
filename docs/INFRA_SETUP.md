# INFRA_SETUP.md

Phase 0 → Phase 1 移行のためのインフラ準備チェックリスト。
**全項目にチェックが入ったら `CLAUDE.md` の開発フェーズを `Phase 1: MVP 実装中` に更新する。**

> 関連ドキュメント: `docs/WCC_ARCHITECTURE.md` セクション 8

---

## GitHub

- [ ] リモートリポジトリを GitHub に作成し、現在のローカルリポジトリを push
- [ ] `main` ブランチ保護ルール設定 (force push 禁止)
- [ ] `.gitignore` に `.env*` が含まれていることを確認 ← 確認済み

## Vercel

- [ ] Vercel プロジェクト作成
- [ ] 既存 LP (`for-your-wedding-day.com`) のドメインを Vercel に接続
- [ ] 環境変数の初期設定 (下記「環境変数一覧」参照)

## Supabase

- [ ] Supabase プロジェクト作成 (Tinykomainu とは別プロジェクト)
- [ ] `supabase/migrations/` の 3 ファイルを適用
  - [ ] `20260501000000_initial_schema.sql` (テーブル定義)
  - [ ] `20260501000001_rls_policies.sql` (RLS ポリシー)
  - [ ] `20260501000002_storage_buckets.sql` (Storage バケット)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を取得
- [ ] `SUPABASE_SERVICE_ROLE_KEY` を Vercel 環境変数に設定 (クライアントに露出しないこと)

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

- [ ] Resend アカウント確認 (Tinykomainu と共用か別アカウントか判断)
- [ ] ドメイン認証 (`for-your-wedding-day.com`)
- [ ] `RESEND_API_KEY` と `RESEND_FROM_EMAIL` を Vercel 環境変数に設定

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
RESEND_FROM_EMAIL
NEXT_PUBLIC_APP_URL
```

## 完了後の作業

全項目チェック完了後:

1. `docs/WCC_ARCHITECTURE.md` セクション 8 の「着手時にやること」を再確認
2. `docs/WCC_ROADMAP.md` (未作成) を起草する — Phase 1 の週次計画
3. `CLAUDE.md` の開発フェーズを `Phase 1: MVP 実装中` に更新する

---

*最終更新: 2026-05-01*
