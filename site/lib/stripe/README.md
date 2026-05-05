# Stripe Integration

## Files

- `client.ts` — Stripe SDK 初期化（`createStripeClient()`）
- (Step 2 以降で追加: `handlers/` — quote.accepted / invoice.paid 等のイベントハンドラ)

## Webhook Endpoint

`POST /api/stripe/webhook`

署名検証済み。受信イベントのログ出力まで実装済み（Step 1）。
イベントハンドラ（booking_quotes / booking_payments への書き込み）は Step 2 で実装。

## ローカル開発

Stripe CLI をインストールしてローカルに転送:

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

表示される `whsec_xxx` を `.env.local` の `STRIPE_WEBHOOK_SECRET` に設定。

テストイベント送信:

```bash
stripe trigger invoice.paid
stripe trigger quote.accepted
```

サーバーログに `[stripe-webhook] Received event: ...` が出れば疎通確認完了。

## 本番

Stripe Dashboard → Developers → Webhooks でエンドポイント登録:

- URL: `https://for-your-wedding-day.com/api/stripe/webhook`
- Listen to events: Step 2 実装後に追加（`quote.accepted`, `invoice.paid`, `invoice.payment_failed`）

登録後に表示される署名シークレット (`whsec_xxx`) を Vercel 環境変数 `STRIPE_WEBHOOK_SECRET` に設定。
