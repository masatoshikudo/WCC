# CLAUDE.md

Claude Code 向けの開発指針。このリポジトリで作業する際は必ずここから読み始める。

## 現在の開発フェーズ

**Phase 0: ドキュメント起草完了 / インフラ準備中**

Phase 1 (MVP 実装) への移行は `docs/INFRA_SETUP.md` のチェックリスト完了後。

## アクティブなドキュメント

| ドキュメント | 内容 |
|---|---|
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
