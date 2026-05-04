# reference/future-schema/ — 将来構想の DB スキーマ

## このディレクトリの役割

Phase 2 以降の将来構想として起草した DB スキーマ SQL を保管する。
**現行 DB には未適用であり、そのまま適用しないこと。**

## 含まれるファイル

| ファイル | 内容 |
|---|---|
| `20260501000000_initial_schema.sql` | clients / bookings / venues / deliveries / payments / messages 6テーブル定義 + updated_at トリガー |
| `20260501000001_rls_policies.sql` | 上記 6テーブル向け RLS ポリシー |
| `20260501000002_storage_buckets.sql` | deliveries バケット作成（Supabase Storage） |

## 現行 DB（Phase 0）との関係

現行 DB は `reference/supabase_bookings.sql` で定義された以下の 3テーブルで稼働:

- `booking_intents` — 予約フロー ステップ3到達時の意思確定
- `booking_payments` — 決済完了後の記録
- `booking_quotes` — 見積（Quote / Invoice）管理

`reference/supabase_contact_inquiries.sql` も参照（旧問い合わせテーブル）。

## いつ参照するか

- Phase 2 以降で「複数顧客の体系管理」「LINE 連携」「動画ファイル管理の自動化」が必要になったとき
- データモデル設計の出発点として参照
- **そのまま適用するのではなく、当時の運用実態に合わせて再設計する前提**

## なぜ移動したか

`supabase/migrations/` に配置されていたため、`supabase db push` 等で誤って現行 DB に適用するリスクがあった。将来構想であることを明示するため、ここに退避した。

## 関連ドキュメント

- `docs/WCC_ARCHITECTURE.md` — Phase 0 現行 DB スキーマと Phase 1 目標スキーマの詳細
- `reference/quote-invoice-phase-plan.md` — Stripe Quote / Invoice 設計の根拠

---

*移動日: 2026-05-04*
