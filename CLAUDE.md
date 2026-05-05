# CLAUDE.md

Claude Code 向けの開発指針。このリポジトリで作業する際は必ずここから読み始める。

## 現在の開発フェーズ

**Phase 1: 実装フェーズ（移行日: 2026-05-04）**

### Phase 0 完了（2026-05-04）

- `WCC_*.md` 5本 + `LP_REVISION_PLAN.md` + `INFRA_SETUP.md` の起草・整合
- 旧ドキュメント5本（AGENTS / DESIGN / VOICE / MARKETING / STACK）の `docs/` への統合
- 将来構想 SQL の `reference/future-schema/` への退避
- 軽量修正三点セットの実装と本番動作確認
  - 電話番号フィールド重複バグ修正 (`dfa68e9`)
  - 運営者通知メール実装 (`fc22b4e`)
  - 顧客確認メール実装 (`1c47ed3`)

### Phase 1 スコープ

**完了済み:**
- Stripe Webhook 実装（Step 1〜4、本番動作確認済み）
- LP P1: 問い合わせフォームの Supabase 接続（BookFlow により代替済み）
- LP P3: BRAND.md 準拠見直し（2026-05-06 実装完了）
  - ヘッダーロゴ「WCC」→「For Your Wedding Day」（Cormorant Garamond、uppercase 除去）
  - ヒーローコピー「挙式の感動を、」→「翌朝、ふたりで観る、昨日のすべて。」（翌朝軸）
  - サブコピー更新（「結婚式の翌朝、コーヒーを淹れて。その日のうちに届く、ふたりだけの縦動画。」）
  - `--color-ink-muted` を `#525252` に修正（既存 `#202620` は ink と同値だった）
  - メール差出人「Wedding Content Creator」→「For Your Wedding Day」
  - WCC_BRAND.md v2 確定版を正式反映（FYWD廃止、accent-hover 修正、ロゴ方針確定）

**直近:**
- SNS 実績アカウント立ち上げ（Instagram / TikTok）

**中期:**
- SNS 実績アカウント立ち上げ（Instagram / TikTok）
- `docs/INFRA_SETUP.md` 残項目消化

**依存関係:**
- SNS アカウント開設 → LP の SNS リンク更新 → 実績埋め込み

### Phase 2 への移行条件

現時点では未確定。Phase 1 の主要実装が安定稼働してから検討する。

## アクティブなドキュメント

> Phase 全体の流れを把握するには `docs/WCC_ROADMAP.md` を参照。

| ドキュメント | 内容 |
|---|---|
| `docs/WCC_ROADMAP.md` | **事業全体ロードマップ（M0〜M5）・フェーズ移行条件** |
| `docs/WCC_IDEA.md` | 経緯・リスク・着手チェックリスト |
| `docs/WCC_PRODUCT.md` | 世界観・仕様・設計原則 |
| `docs/WCC_ARCHITECTURE.md` | 技術構成・データモデル |
| `docs/WCC_BRAND.md` | ブランドアイデンティティ・デザイントークン・CTA ルール (屋号: For Your Wedding Day) |
| `docs/WCC_CONTRIBUTING.md` | 開発フロー・AI 協業ルール |
| `docs/WCC_STACK.md` | 技術スタック・Stripe 運用方針・パフォーマンス計画 |
| `docs/WCC_MARKETING.md` | SEO・GA4・広告タグ実装方針 |
| `docs/INFRA_SETUP.md` | インフラ準備チェックリスト (Phase 1 移行条件) |
| `docs/LP_REVISION_PLAN.md` | LP 改修計画 |

## 未確定事項

- 動画 2 本の尺と棲み分け (実撮影で確定)
- 動画ファイルの長期保管先 (Supabase Storage vs R2)
- 運営ダッシュボードの実装範囲 (完全自作 vs Retool 等)

## 決定済みの設計原則

屋号: **For Your Wedding Day** (`for-your-wedding-day.com`)
世界観の核: **「翌朝、二人で昨日を笑い合うための動画」**

詳細は `docs/WCC_PRODUCT.md` セクション 1〜2 を参照。

**やらないこと (世界観由来)**:
- ドローン撮影
- 16:9 横長の長編ムービー
- トレンド BGM での派手な編集
- 演出プランの事前構成
- DVD/Blu-ray 物理納品

## Claude Code への期待

1. **実装前に必ず関連ドキュメントを読む** (`docs/WCC_CONTRIBUTING.md` の Pre-Implementation Research Pattern 参照)
2. 「やる/やらない」設計原則に反する機能を実装しない
3. Supabase RLS を必ず有効にする (セキュリティ要件)
4. 顧客の個人情報・動画素材を含むテーブルへのアクセスは RLS で保護する
5. `.env.local` の内容をチャットに貼り付けない
6. **Stripe 実装時は `.claude/skills/stripe-best-practices` を参照する** (Stripe 公式 Agent Skills — 決済 API 選択・Webhook・セキュリティのベストプラクティス)

## ディレクトリ構成

```
weddingcontentscreator_project/
├── CLAUDE.md                   ← このファイル
├── docs/                       # ドキュメント (WCC_* など)
├── site/                       # Next.js LP (既存サイト)
└── reference/                  # 競合調査・リサーチ資料
    ├── supabase_bookings.sql   # 現行DB スキーマ (booking_intents 等 — 運用中)
    ├── supabase_contact_inquiries.sql
    └── future-schema/          # 将来構想 SQL (未適用・Phase 2 以降の参考資料)
```

### Migration ファイルの取り扱い

`supabase/migrations/` には現行 DB に適用される本物の migration のみを配置する。
将来構想の SQL は `reference/future-schema/` に退避済み。詳細は同ディレクトリの README 参照。

**Phase 0 → 1 で新規 migration を書く際、既存の `booking_intents` 等の構造を変更する場合のみ作成し、
将来構想の `clients` / `bookings` / `venues` 等のテーブルは `supabase/migrations/` に追加しない。**

## 現在の優先順位

### 完了済み

- [x] 軽量修正三点セット
  - [x] 電話番号フィールド重複バグ修正 (`dfa68e9`)
  - [x] 運営者通知メール実装 (`fc22b4e`)
  - [x] 顧客確認メール実装 (`1c47ed3`)
- [x] 将来構想 SQL の `reference/future-schema/` への退避 (`afa8e8b`)
- [x] ドキュメント統合（旧5本 → `docs/WCC_*.md`）
- [x] Stripe Webhook 実装（決済信頼性向上）
  - [x] Stripe Agent Skills 導入 (`2ef8e8b`)
  - [x] Step 1: 基盤構築（署名検証・ルーティング）
  - [x] Step 2: イベントハンドラ実装（quote.accepted / invoice.paid / invoice.payment_failed — 冪等性対応）(`33e1fa2`)
  - [x] Step 3: 本番動作確認（紐付け済み Invoice で DB 更新確認 477ms）
  - [x] Step 4: 失敗時の運営者通知メール（マージ済み・未紐付けケース動作確認済み）
- [x] LP P1: 問い合わせフォームの Supabase 接続（BookFlow により代替済み）
  - `/book` → `booking_intents` 保存・通知メール実装済み、`/contact` → `/book` リダイレクト設定済み
- [x] LP P3: BRAND.md 準拠見直し（2026-05-06 実装完了）
  - ヘッダーロゴ・ヒーローコピー・カラー・メール差出人 更新済み（`docs/WCC_BRAND.md` v2 反映）

### Phase 1 実装タスク（優先度順）

1. **SNS 実績アカウント立ち上げ**（Instagram / TikTok）
2. **`docs/INFRA_SETUP.md` 残項目消化**（LINE・SNS・GitHub branch 保護）
3. **テストデータのクリーンアップ**（Phase 1 完了時）

### 未解決の課題（別タスクとして残置）

- 本番 admin 画面のパスワード問題（ローカルと Vercel で値が異なる可能性 — 要調査）
- Step 4 の紐付け済みケース動作確認（未紐付けケースのみ実施済み。実顧客ケースで確認予定）

## PR 分割の運用ルール

コード修正とドキュメント追加は原則として別 PR に分割する。

### 分けるべきケース

- コード修正（バグ fix / 機能追加 / リファクタ）
- ドキュメント追加・更新（設計判断記録 / 引き継ぎ資料 / 仕様書）
- これらが同時に発生する場合、コード PR とドキュメント PR を分ける

### 分けなくてよいケース

- コード修正に伴う README・インラインコメントの更新（修正と密結合）
- ドキュメントに記載されたファイルパス変更などの追従修正

### 理由

- コード修正で問題発生時に revert する際、ドキュメントまで巻き戻らない
- git log でコード変更とドキュメント変更を独立して追跡できる
- レビュー・マージの判断粒度が適切になる
