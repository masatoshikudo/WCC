# WCC 個別見積（Stripe Quote/Invoice）フェーズ設計

## 目的

現在の「固定1パッケージ決済」中心の導線から、個別見積（オプション・交通費・宿泊費を含む）前提の運用へ段階移行する。  
運用の安全性と実行速度を両立するため、**Stripe を主台帳（SoT）に一本化**し、サイト側は相談・顧客文脈管理に寄せる。

---

## 全体方針

- 一次CVは「決済完了」ではなく「相談/仮予約」に寄せる
- 見積は Stripe `Quote`、請求/支払いは Stripe `Invoice` + Hosted Payment Page を正とする
- 金額・請求状態・入金状態の SoT は Stripe Dashboard とする
- サイト側のDBは顧客文脈（相談内容・挙式情報・社内メモ）と Stripe 参照IDの保持に絞る
- 入金反映は最終的に Webhook 同期で自動化する

---

## Phase A: 運用切替MVP（即日〜1週間）

### 目的

コード変更を最小に抑えつつ、Stripe中心フロー（相談→Quote→Invoice→支払い）を先に成立させる。

### 主要タスク

- LP一次CVを「相談/仮予約」へ寄せる（即時決済を主導線にしない）
- 見積テンプレートを固定（基本料金・オプション・交通費・宿泊費・有効期限）
- Stripeダッシュボードで `Quote` を作成・提示し、承認後に `Invoice` を発行
- 見積/請求メールを送信（支払いURL、期限、条件を明記）
- 送付前チェックリストを運用に導入（見積内訳・期限・宛先の誤送信防止）

### 完了条件

- 1案件を「相談→Quote→Invoice→支払い」まで問題なく通せる
- 見積内容の確認手順（ダブルチェック）が定義されている

### KPI（最小）

- 相談件数
- 見積送付率（相談→送付）
- 支払い率（送付→支払い）
- 見積修正率（ミス指標）

---

## Phase B: 最小データ接続（1〜2週間）

### 目的

サイト側から Stripe 上の見積/請求を相互参照できる状態を作る。

### 主要タスク

- `booking_quotes` テーブルを運用台帳として追加（`attempt_id` を軸に既存データと連携）
- 見積ステータス管理を追加  
  `draft / sent / approved / paid / expired / cancelled`
- Stripe参照情報を保存  
  `stripe_quote_id`, `stripe_invoice_id`, `payment_url`, `expires_at`
- 必要最小限の金額内訳を保持（照合目的）
- 管理画面に見積関連の列を追加（ステータス・総額・期限・Stripe参照）

### 完了条件

- 管理画面から Stripe の `quote / invoice` を迷わず辿れる
- 案件単位で「相談情報 ↔ 見積/請求情報」の紐付けが維持できる

### 影響箇所（想定）

- `reference/supabase_bookings.sql`
- `site/app/admin/bookings/page.tsx`
- `site/app/actions/booking.ts`（必要に応じて参照ID保存）

---

## Phase C: Webhook同期（1〜2週間）

### 目的

Stripe の状態更新をサイト側へ自動反映し、手動照合作業を減らす。

### 主要タスク

- Stripe Webhook を受信（例: `quote.accepted`, `invoice.paid`, `invoice.payment_failed`）
- `booking_quotes.status` を Stripe イベントで更新
- `booking_payments` への確定書き込みを冪等化
- 失敗時の再同期手順（Webhook再送・手動同期）を整備

### 完了条件

- ユーザーが完了画面を開かなくても支払い状態を反映できる
- 二重登録や取りこぼしが発生しない（idempotent）

### 影響箇所（想定）

- `site/app/api/**`（Webhook受信エンドポイント）
- `site/app/actions/booking.ts`
- `site/app/admin/bookings/page.tsx`

---

## Phase D: 半自動化・運用強化（2週間〜）

### 目的

業務オペレーションの工数を減らし、成約率改善の施策を回せるようにする。

### 主要タスク

- 見積送付メールを半自動化（テンプレ差し込み、再送導線）
- 期限切れ案件の再提案フローを追加
- ステータス別KPI可視化（送付率・承認率・入金率・入金リードタイム）
- 必要に応じてCRM連携を追加

### 完了条件

- 運用担当の手作業が削減され、再現可能な運用手順になっている
- KPIを継続計測し、改善サイクルを回せる

---

## スコープ外（後回し）

- 複数通貨対応
- 複数税率・複雑な源泉処理
- 外部CRMとのリアルタイム双方向同期

---

## リスクと対策

- 見積作成ミス  
  → 金額テンプレート化、送付前チェックリスト、管理画面で内訳可視化
- 支払いURLの取り違え  
  → `stripe_invoice_id` と `payment_url` の保存・照合
- 決済未反映  
  → フェーズ3でWebhook正規化、失敗時再同期手順を明文化

---

## 実行順（推奨）

1. Phase Aで Stripe中心フローを実運用する（まず売上を止めない）
2. Phase Bでサイト側との紐付け情報を整える（参照可能にする）
3. Phase CでWebhook同期を実装する（状態反映を自動化）
4. Phase Dで半自動化とKPI運用を進める（拡張）

この順番なら、最小リスクで個別見積運用へ移行できる。
