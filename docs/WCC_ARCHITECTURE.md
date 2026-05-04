# WCC — Architecture

> Wedding Content Creator の技術構成・データモデル設計書。
> Tinykomainu とは別リポジトリ・別モノレポだが、技術選定は同系統 (Next.js + Supabase + Stripe) を踏襲。
>
> 関連ドキュメント:
> - `WCC_IDEA.md`: 経緯・全体像
> - `WCC_PRODUCT.md`: 仕様
>
> 作成日: 2026-04-30
> ステータス: 初版起草

---

## 1. 全体構成

```
┌────────────────────────────────────────────────────┐
│  顧客 (新郎新婦)                                    │
│  - LP閲覧 → 問い合わせ                              │
│  - 公式LINEでやり取り                               │
│  - Stripe Payment Link で決済                       │
│  - 納品物URL で動画閲覧・DL                         │
└────────────────────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────┐
│  Web フロントエンド (Next.js + Vercel)              │
│  - LP (既存)                                        │
│  - 問い合わせフォーム                               │
│  - 納品物閲覧ページ (パスワード保護)                │
│  - 運営側ダッシュボード (要認証)                    │
└────────────────────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────┐
│  バックエンド (Supabase)                            │
│  - PostgreSQL (顧客・予約・納品データ)              │
│  - Auth (運営者認証)                                │
│  - Storage (納品動画ファイル)                       │
│  - Edge Functions (LINE webhook等)                  │
└────────────────────────────────────────────────────┘
                       │
        ┌──────────────┼────────────────┐
        ▼              ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Stripe      │ │  LINE        │ │  Resend      │
│  決済        │ │  顧客連絡    │ │  メール送信  │
└──────────────┘ └──────────────┘ └──────────────┘
```

## 2. 技術スタック

### 2.1 確定しているもの

| レイヤー | 技術 | 理由 |
|---|---|---|
| フロントエンド | Next.js (App Router) | 既存LPで使用中、Tinykomainuと同系統 |
| ホスティング | Vercel | Next.jsとの親和性、既存LPもVercel想定 |
| データベース | Supabase (PostgreSQL) | Tinykomainuで実績、Auth/Storage/Edge Functionsを一元利用可能 |
| 認証 | Supabase Auth | 運営者ログイン用 |
| ファイルストレージ | Supabase Storage | 納品動画の格納と署名付きURL発行 |
| 決済 | Stripe (Payment Links) | 単発決済、サブスクではない |
| メール送信 | Resend | Tinykomainuと同じ、トランザクションメール用 |
| 顧客連絡 | LINE Messaging API | 日本市場で必須、新郎新婦との主たる連絡経路 |

### 2.2 Tinykomainu との差分

- **モノレポではなく単一リポジトリ**: `pnpm` ワークスペース構造は使わない。WCC 単独のシンプルな Next.js プロジェクト
- **`packages/*` の共通パッケージは使わない**: 別リポジトリのため物理的に共有不可。同じパターンを再現するに留める
- **サブスクリプションテーブルは不要**: 単発決済モデルなので Stripe Customer/Subscription の永続管理は不要
- **LINE 連携が中核**: Tinykomainu にはなかった、WCC 固有の重要要素

### 2.3 決定保留

- **動画ファイルの保管先**: Supabase Storage で全部持つか、容量が膨らむなら R2/S3 に逃がすか
  - 1 件あたり全素材 + 編集済み 2 本で **数十 GB** になる可能性
  - 月 5 件で 100GB+/月の増加。Supabase Storage の料金体系次第で R2 移行を検討
- **動画の長期保管ポリシー**: 何ヶ月保管するか、削除ポリシーをどうするか
- **運営ダッシュボードの実装範囲**: 完全自作 vs Retool 等のローコードツール利用

## 3. データモデル

### 3.0 現行実装 (Phase 0) — 稼働中スキーマ

`reference/supabase_bookings.sql` が運用対象。書き込みは Server Actions + `service_role` のみ。

```sql
-- 予約フロー ステップ3到達時に insert（お支払い前の意思確定）
booking_intents
  attempt_id           text primary key          -- フロント生成の UUID
  created_at           timestamptz
  email                text not null
  booker_name          text
  wedding_date         text not null             -- "YYYY-MM-DD" or 未定フラグ
  date_undecided       boolean default false
  venue_name           text
  venue_area           text
  start_time           text
  start_time_undecided boolean default false
  coverage_scope       text                      -- ceremony_only | ceremony_reception | through_afterparty
  couple_name          text
  timeline_note        text
  requested_scenes     text
  delivery_channels    text[]
  reference_video_urls text[]
  venue_restrictions   text
  emergency_contact    text
  plan_id              text not null
  plan_label           text not null
  price_label          text not null

-- 決済完了後（成功画面）に insert。Stripe Checkout を正とする
booking_payments
  attempt_id                 text primary key references booking_intents(attempt_id)
  created_at                 timestamptz
  email                      text not null
  booker_name                text
  wedding_date               text not null
  date_undecided             boolean
  plan_id                    text not null
  plan_label                 text not null
  price_label                text not null
  stripe_checkout_session_id text unique
  source                     text default 'success_page'

-- 個別見積（Quote / Invoice）管理（フェーズ1）
booking_quotes
  id               bigserial primary key
  attempt_id       text references booking_intents(attempt_id)
  created_at       timestamptz
  updated_at       timestamptz
  status           text    -- draft | sent | approved | paid | expired | cancelled

  -- 金額内訳（税抜）
  base_price_ex_tax   integer
  option_fee_ex_tax   integer
  travel_fee_ex_tax   integer
  lodging_fee_ex_tax  integer
  discount_ex_tax     integer
  subtotal_ex_tax     integer
  tax_amount          integer
  total_in_tax        integer

  stripe_customer_id  text
  stripe_quote_id     text
  stripe_invoice_id   text
  payment_url         text
  expires_at          timestamptz
  sent_at             timestamptz
  paid_at             timestamptz
```

**Phase 0 データフロー:**

```
1. 顧客が /book ステップ3完了
   → booking_intents に insert（attempt_id で以後突合）
   → sessionStorage に attemptId を保持

2. Stripe Checkout 決済完了 → 成功画面
   → booking_payments に insert（初回のみ）
   → Resend で確認メール送信

3. 運営者が /admin/bookings で確認・対応
   → booking_quotes で見積管理（Stripe Quote / Invoice 連携）
   → Stripe Hosted Payment Page で請求
```

管理 UI: `/admin/login` → `/admin/bookings`（パスワード + `ADMIN_BOOKINGS_SECRET` セッション）

### 3.1 Phase 1 目標スキーマ（`reference/future-schema/` 保管・未稼働）

> **将来構想の SQL ファイルについて**: 当初 `supabase/migrations/` に配置された
> clients / bookings / venues / deliveries / payments / messages の 6テーブル設計は、
> 現行 DB との乖離が大きいため `reference/future-schema/` に退避済み。
> Phase 2 以降の参考資料として保管している。誤って適用しないこと。

Phase 1 MVP で段階移行予定。顧客管理・式場マスタ・納品管理を一元化する。

```sql
-- 顧客 (新郎新婦)
clients
  id                uuid primary key
  name              text          -- 代表者名 or 「○○様・○○様」
  partner_name      text          -- パートナー名 (任意)
  email             text
  phone             text
  line_user_id      text          -- LINE連携時のID
  created_at        timestamptz
  notes             text          -- 自由記入メモ

-- 予約 (1件 = 1つの結婚式の依頼)
bookings
  id                uuid primary key
  client_id         uuid references clients(id)
  venue_id          uuid references venues(id)
  wedding_date      date           -- 式当日
  shoot_start_at    timestamptz   -- 撮影開始予定時刻
  shoot_end_at      timestamptz   -- 撮影終了予定時刻
  guest_count       int           -- ゲスト数
  status            text          -- inquiry | quoted | confirmed | completed | cancelled
  package_price     int           -- パッケージ価格 (円)
  travel_fee        int           -- 交通費
  accommodation_fee int           -- 宿泊費
  total_price       int           -- 合計
  notes             text          -- 進行表メモ等
  created_at        timestamptz
  updated_at        timestamptz

-- 式場
venues
  id                uuid primary key
  name              text
  address           text
  prefecture        text
  external_vendor_allowed  boolean   -- 外部業者持ち込み可否
  drone_allowed     boolean
  notes             text          -- 撮影制約のメモ
  created_at        timestamptz

-- 納品
deliveries
  id                uuid primary key
  booking_id        uuid references bookings(id)
  status            text          -- editing | delivered
  short_video_url   text          -- 短尺動画のURL
  long_video_url    text          -- 中尺動画のURL
  making_video_url  text          -- メイキング映像のURL
  raw_archive_url   text          -- 全素材アーカイブのURL
  delivery_password text          -- 閲覧ページのパスワード
  delivered_at      timestamptz
  created_at        timestamptz

-- 決済
payments
  id                  uuid primary key
  booking_id          uuid references bookings(id)
  stripe_payment_link text         -- Payment Link URL
  stripe_session_id   text         -- 決済完了時のSession ID
  amount              int          -- 円
  status              text         -- pending | paid | refunded
  paid_at             timestamptz
  created_at          timestamptz

-- 問い合わせログ (LINE/フォーム両方)
messages
  id                uuid primary key
  booking_id        uuid references bookings(id)  -- 紐付け前はnull可
  client_id         uuid references clients(id)   -- 同上
  channel           text          -- line | form | email
  direction         text          -- inbound | outbound
  body              text
  created_at        timestamptz
```

### 3.2 命名ポリシー

別リポジトリ・別 Supabase プロジェクトのため、Tinykomainu の `tinykomainu_*` プレフィックスは使わない。Phase 0 は `booking_*` プレフィックスで予約関連をまとめ、Phase 1 移行時は `clients` `bookings` 等の素直な命名を採用する。

### 3.3 ステータス遷移

**bookings.status の状態遷移**:

```
inquiry (問い合わせ受領)
   │
   ▼
quoted (見積もり送付済み)
   │
   ▼
confirmed (決済完了・確定)
   │
   ▼
completed (撮影・納品完了)

途中での離脱 → cancelled
```

**deliveries.status の状態遷移**:

```
editing (編集中) → delivered (納品済み)
```

## 4. 主要なユースケース別フロー

### 4.1 予約フロー (Phase 0 現行実装)

```
1. 新郎新婦が /book ステップ1〜2 で情報入力
   → sessionStorage に attempt_id を生成・保持

2. ステップ3「確認」画面で送信ボタン押下
   → booking_intents に insert (同一 attempt_id は無視)
   → Stripe Checkout セッションを生成・リダイレクト

3. Stripe Checkout 決済完了 → 成功画面へリダイレクト
   → sessionStorage から attempt_id を取得
   → booking_payments に insert (初回のみ)
   → Resend で顧客に確認メール送信
   → 運営者に通知メール送信

4. 運営者が /admin/bookings で確認
   → booking_quotes を作成（Stripe Quote 連携）
   → Stripe Invoice で請求・Hosted Payment Page で支払い
   → 決済確定後 paid_at を記録

5. 撮影当日 (オフライン)

6. 編集完了→ 納品
   → (Phase 1 予定) deliveries レコード作成
   → 動画ファイルを Supabase Storage にアップロード
   → 署名付き URL を LINE/メールで送付
```

### 4.2 Phase 1 目標フロー（`supabase/migrations/` 定義済み）

Phase 0 の `booking_intents` → Phase 1 の `clients` + `bookings` への移行後:

```
1. LP 問い合わせフォーム送信
   → messages レコード作成 (channel=form, direction=inbound)
   → 運営者に Resend でメール通知

2. 運営者が ZOOM 打ち合わせ・LINE で質疑応答
   → messages レコード追加蓄積

3. 運営者が見積もり作成
   → bookings レコード作成 (status=quoted)
   → Stripe Quote 発行 → booking_quotes に記録
   → LINE で決済 URL 送付

4. 新郎新婦が決済
   → Stripe Webhook 受信
   → payments.status = paid
   → bookings.status = confirmed

5. 撮影当日 (オフライン)

6. 編集完了→ 納品
   → deliveries レコード作成 (status=delivered)
   → 動画ファイルを Supabase Storage にアップロード
   → 閲覧 URL とパスワードを LINE/メールで送付
   → bookings.status = completed
```

### 4.3 LINE 連携（Phase 1）

LINE Messaging API の Webhook を Supabase Edge Function で受信:
- 受信メッセージは messages テーブルに保存
- LINE User ID を clients.line_user_id に紐付け
- 運営者は管理画面から LINE ユーザーへ送信できる

## 5. ルーティング・アンカー設計

### 5.1 固定アンカー ID セット（ホーム）

トップページのセクション ID は `site/lib/site-links.ts` の `HOME_ANCHOR_HREF` に集約し、変更する場合は実装・リダイレクト・ドキュメントを同時に更新すること。

| id | セクション | 用途 |
|---|---|---|
| `#hero` | ヒーロー | 最初のセクション、デフォルト表示 |
| `#service-detail` | サービス詳細 | 撮影内容・役割分担の説明 |
| `#highlights` | 実績ハイライト | 9:16 サンプル動画 + お客様の声 |
| `#what-is-wcc` | WCC とは | プロフォト/ムービーとの差分 |
| `#pricing` | 料金 | 料金・納品内容の一次情報 |
| `#service-flow` | サービスフロー | 予約〜当日〜納品の流れ |
| `#faq` | FAQ | 境界条件・不明点解消 |

**旧ルート廃止:**
- `/packages` → `/#pricing` (恒久リダイレクト)
- `/portfolio` → `/#highlights` (恒久リダイレクト)

### 5.2 アンカー命名ルール

- `id` はページ内で一意。kebab-case（`service-detail`、`highlights`）
- 固定ヘッダーで隠れる場合は `scroll-mt-48` を併用
- `id` を変えたら `Link href="/#…"` と `HOME_ANCHOR_HREF` と `next.config.mjs` リダイレクトを同時更新

## 6. ディレクトリ構成 (想定)

```
wcc/
├── docs/
│   ├── WCC_IDEA.md
│   ├── WCC_PRODUCT.md
│   ├── WCC_ARCHITECTURE.md         ← このファイル
│   ├── WCC_OPERATIONS.md           (後続)
│   ├── WCC_LEGAL.md                (後続)
│   ├── WCC_PRICING_LOGIC.md        (後続)
│   └── WCC_ROADMAP.md              (後続)
├── app/
│   ├── (public)/                   # LP・問い合わせ・納品閲覧
│   │   ├── page.tsx                # 既存LP
│   │   ├── contact/
│   │   └── deliveries/[id]/        # パスワード保護の納品閲覧
│   ├── (admin)/                    # 運営者ダッシュボード (要認証)
│   │   ├── bookings/
│   │   ├── clients/
│   │   ├── deliveries/
│   │   └── messages/
│   └── api/
│       ├── stripe/webhook/
│       ├── line/webhook/
│       └── contact/
├── lib/
│   ├── supabase/
│   ├── stripe/
│   ├── line/
│   └── resend/
├── components/
├── public/
├── supabase/
│   └── migrations/
├── CLAUDE.md                       # Claude Code用の開発指針
├── package.json
└── README.md
```

## 7. セキュリティ・プライバシー

### 7.1 機微情報の扱い

- 新郎新婦の個人情報 (氏名・連絡先・式日)
- 結婚式の動画素材 (本人とゲストの肖像)
- 決済情報 (Stripe側で保持、自社DBには保存しない)

### 7.2 RLS (Row Level Security) ポリシー

- 運営者のみが全データを読み書き可能
- 顧客向けの納品閲覧ページは、パスワード認証のみで個別の delivery にアクセス
- 公開 LP は認証不要、問い合わせフォームのみ書き込み権限

### 7.3 動画ファイルへのアクセス

- Supabase Storage の署名付き URL で配信
- 有効期限付きの URL を発行 (例: 6ヶ月)
- 期限切れ後は再発行リクエストを LINE/メールで受け付け

## 8. Phase 0 → Phase 1 移行チェックリスト

詳細は `docs/INFRA_SETUP.md` を参照。主要項目:

**Phase 0 完了済み:**
- `booking_intents` / `booking_payments` / `booking_quotes` スキーマ稼働
- `/admin/bookings` 管理画面稼働
- LP + 予約フォーム (`/book`) 稼働

**Phase 1 未着手:**
- [ ] Supabase 本番プロジェクト作成・`supabase/migrations/` 適用
- [ ] LINE Messaging API 連携
- [ ] 納品閲覧ページ (`/deliveries/[id]`、パスワード保護)
- [ ] Stripe Webhook による決済ステータス自動同期

## 9. 当面の決定保留事項

- 動画ファイル保管の長期戦略 (Supabase Storage vs R2)
- 運営ダッシュボードを完全自作するか Retool 等を使うか
- Phase 0 → Phase 1 のスキーマ移行タイミング

これらは MVP 実装が走り始めて、実際のデータ量・運営工数が見えてきてから判断する。

---

*最終更新: 2026-05-04*
