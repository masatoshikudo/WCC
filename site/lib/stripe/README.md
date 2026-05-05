# Stripe Integration

## Files

- `client.ts` — Stripe SDK 初期化（`createStripeClient()`）
- `handlers/quote-accepted.ts` — `quote.accepted`: `booking_quotes.status` → `approved`
- `handlers/invoice-paid.ts` — `invoice.paid`: `booking_quotes.status` → `paid` + `paid_at` + `booking_payments` 冪等 upsert
- `handlers/invoice-payment-failed.ts` — `invoice.payment_failed`: ログ出力のみ（通知メールは Step 4）

## Webhook Endpoint

`POST /api/stripe/webhook`

署名検証済み。Step 2 でイベントハンドラを実装済み。

### 冪等性の担保

- `quote.accepted`: status が `approved` / `paid` 済みなら早期 return
- `invoice.paid`: status が `paid` 済みなら早期 return。`booking_payments` は `ignoreDuplicates: true` で upsert（既存レコードを上書きしない）
- 失敗時は 500 を返して Stripe の自動リトライを促す

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
- Listen to events: `quote.accepted`, `invoice.paid`, `invoice.payment_failed`

登録後に表示される署名シークレット (`whsec_xxx`) を Vercel 環境変数 `STRIPE_WEBHOOK_SECRET` に設定。
