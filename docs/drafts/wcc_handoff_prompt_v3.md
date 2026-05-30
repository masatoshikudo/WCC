# WCC（For Your Wedding Day）プロジェクト 引き継ぎプロンプト v3

このプロンプトは前回セッション（2026-05-06 第3回）からの引き継ぎです。
あなたは Claude Desktop として、WCC プロジェクトの設計役を担います。

---

## プロジェクト基本情報

- **屋号**: For Your Wedding Day（FYWD は廃止確定、WCC は内部用のみ）
- **ドメイン**: `for-your-wedding-day.com`
- **GitHub**: `https://github.com/masatoshikudo/WCC.git`
- **形態**: 個人事業（BtoC リアルサービス業）
- **メイン体験**: 「翌朝、二人で昨日を笑い合うための動画」
- **価格**: **176,000円（税込）**、6時間撮影、24時間以内納品、9:16縦動画2本+メイキング+全素材
- **開発手法**: Tinykomainu流ドキュメント駆動開発
- **三者役割分担**: Claude Desktop=設計、Claude Code=実装、人間=判断

---

## 現在のフェーズ

**M1（初件納品、〜2026-08）進行中**

ロードマップ（WCC_ROADMAP.md）:
- M0 受付基盤: ✅ 完了
- **M1 初件納品: 進行中** ← 現在地
- M2 実績蓄積（5件、〜2026-11）
- M3 オーガニック離陸（15-20件、〜2027-05）
- M4 スケール検討（30件以上）
- M5 事業化（未確定）

---

## 直近の主要進捗（前回セッション = 2026-05-06 第3回）

### LP UI 全面見直しのメイン作業完了

LP P3（ブランドコピーレベルの確定）から続いていた UI レベル全面改訂が、Phase 1〜3.5 まで一気に進み完了。
Phase 4（フッターモザイクグリッド）のみが M2 後半〜M3 まで保留。

### 完了した Phase

| Phase | 内容 | 状態 |
|---|---|---|
| 1 | トークン基盤再構築（カラー / フォント / Tailwind 命名） | ✅ マージ済み |
| 2 | ヒーロー再構築 + Highlights セクション新設 | ✅ マージ済み |
| 3 | 情報構造刈り込み + フッター再設計 + `/pricing` 別ページ新設 | ✅ マージ済み |
| 3.5 | Extras + Bespoke 追加 + 税込表示 | ✅ マージ済み |
| Extras クリーンアップ | 5 項目 → 3 項目に削減 | ✅ マージ済み |
| 価格改定 | 165,000 → 176,000 円（税込） | ✅ マージ済み |
| 4 | フッターモザイクグリッド | M2 後半〜M3 で実装予定（保留中） |

### 確定したビジュアル方針（Phase 1〜2）

**カラーパレット**:
- 背景: `#EFEBE5`（単色ベージュ、全セクション統一）
- テキスト: `#000000`
- サブテキスト: `#525252`
- 罫線: `#D5D2C8`
- CTA: 黒地白文字の楕円ピル
- アクセント色: 廃止（旧 `#ca5311` オレンジ系を全削除）

**タイポグラフィ**:
- ロゴ・見出し: Cormorant Garamond（weight 300〜700、Phase 1 で 300/400 を追加）
- 本文: Noto Sans JP
- UI ラベル: Plus Jakarta Sans（全大文字 + 字間 0.15em）
- ヒーロー H1: Cormorant Garamond / weight 300 / `clamp(2.75rem, 6vw, 5rem)` / 字間 0.02em

**ヒーロー構造（γ 案）**:
- ヒーロー: テキストのみ（動画削除）
- ヒーロー直後: 第 2 セクションに 9:16 動画グリッド（PC: 3 列 / SP: 1 列、6 本固定、マルキー廃止、自動再生なし）

**ナビゲーション**:
- 英語 + 全大文字（PRICING / GALLERY / ABOUT / CONTACT 等）
- 字間 0.15em

### 確定したプラン構造（Phase 3.5 + 価格改定）

**標準プラン**:
- 価格: **176,000 円（税込）**
- 内容: 6 時間撮影 / 24 時間納品 / 9:16 縦動画 2 本 + メイキング + 全素材

**Extras（3 項目）**:
- 撮影時間延長: +33,000 円 / 1 時間
- 追加編集本数（9:16 縦動画）: +33,000 円 / 1 本
- 遠方出張費: 実費 + 11,000 円

**Bespoke（オーダーメイド枠）**:
- Starting from 220,000 円（税込）
- 対応: 2 日間撮影 / 海外挙式 / 企業イベント / その他特殊要件

### 確定したコピー方針（基本姿勢: ビジュアル揃える / コピー独自）

- ヒーロー H1: 「翌朝、ふたりで観る、昨日のすべて。」（LP P3 確定、維持）
- フッター CTA H2: 「翌朝のふたりへ、ひとつ届ける。」（Phase 3 で「永遠に残る思い出を捉える」から差し替え）
- 禁句: 感動 / 永遠 / 最高の / 奇跡の / プラットフォーム / AI / お客様 / VIBES / bestie 直訳
- 推奨語: お二人 / 翌朝 / 余韻 / 軽やかに / そっと / iPhoneで紡ぐ / 翌朝のコーヒーのように

### LP トップの最終構成

1. ヒーロー（テキストのみ、動画なし）
2. Highlights（9:16 動画グリッド、OUR WORK）
3. What is（ウェディングコンテンツとは）- Phase 3 で 2 カラム構造に再構築
4. Do I need（写真とは違う、もうひとつの記録）- Phase 3 で再構築
5. Pricing コンパクト版（176,000 円表示 + `/pricing` への誘導）
6. フッター CTA セクション（「翌朝のふたりへ、ひとつ届ける。」）
7. SiteFooter（ブランドブロック構造、モザイクは Phase 4 で追加予定）

### `/pricing` ページの構成

1. ヘッダー帯（料金プラン）
2. パッケージプラン詳細（176,000 円・税込）
3. Extras（3 項目）
4. Bespoke（220,000 円〜）
5. ご相談から当日までの流れ（service-flow、LP から移動）
6. よくある質問（FAQ、LP から移動）
7. フッター CTA + SiteFooter（共通）

---

## Masatoshi が完了させるべき手動作業（次セッション開始前に確認）

前回セッション末で以下を Masatoshi が手動実施する必要があった。次セッション冒頭で完了状況を確認すること:

### Stripe 関連（価格改定 176,000 円対応）

- [ ] Stripe ダッシュボード: 現行 Price（165,000 円）を Archive
- [ ] Stripe ダッシュボード: 新規 Price 作成（176,000 円・税込）
- [ ] `.env.local` の `STRIPE_PRICE_ID` を新 Price ID に更新
- [ ] Vercel 環境変数 `STRIPE_PRICE_ID` を新 Price ID に更新
- [ ] Vercel 再デプロイ
- [ ] テスト環境で予約フロー 1 件流して動作確認

### 確認事項

- [ ] 進行中の未支払い予約案件があるか確認（あれば個別対応）
- [ ] tsconfig.json のローカル汚染を戻したか

---

## 次セッションの最優先タスク

### 1. WCC_BRAND v3 の起草（最優先）

`docs/drafts/WCC_BRAND_v3.md` を起草する。
LP P3 の WCC_BRAND_v2.md と同じ位置付けの判断ドキュメント。

**含めるべき内容**:

- カラーパレット改訂（Phase 1 確定値: `#EFEBE5` 単色背景 / 黒テキスト / 黒ピル CTA / アクセント色廃止）
- タイポグラフィ詳細（Phase 1〜2 確定値: Cormorant Garamond weight 300〜700 / ヒーロー H1 詳細値）
- レイアウト原則（単色背景 / 黒ピル CTA / フッター中央寄せ / ナビ英語化全大文字）
- プラン構造（標準 176,000 円 / Extras 3 項目 / Bespoke 220,000 円〜）
- LP トップ + `/pricing` の構成方針
- LP P3 から覆った項目の明示:
  - カラー案 A 最小修正（accent-hover #b84a0f / ink-muted #525252）→ 単色ベージュ + 黒に再設計
  - 写真ファースト原則のカラー大改訂は M2 以降 → Phase 1 で前倒し実施
- 判断の歴史（WCC_BRAND_v2.md は drafts/ に保持）

**起草の進め方**: LP P3 のときと同様に Claude Desktop が起草、Masatoshi が確認・調整、コミット。

### 2. PENDING 項目の処理（BRAND v3 完了後）

引き継ぎプロンプトに残してきた未消化タスク:

- 本番 admin 画面のパスワード問題（本番 Vercel で login 不可）
- LINE Messaging API 設定（INFRA_SETUP.md 残項目）
- GitHub branch 保護設定（INFRA_SETUP.md 残項目）
- SNS 実績アカウント立ち上げ計画（Instagram / TikTok 運営側作業）

### 3. クリーンアップ候補（優先度低、いつでも処理可）

- `/packages` ルート（`site/app/packages/page.tsx`）が dead code として残存
  - `priceExTaxYen` を税抜で参照しているため、放置するとリスク
  - 削除または `/pricing` への 301 リダイレクト化を推奨
  - 緊急性は低い（ナビからリンクなし、誰もアクセスしない想定）

---

## 重要な設計原則（継承）

- **完了の定義**: 「マージ済み + 動作確認済み」で統一
- **ドキュメント運用**: 削除ではなく完了マークで判断の歴史を残す
- **議論したい論点**: 「忘れない仕組み」として記録、実顧客フィードバック後に再検討
- **Step 分割**: 一気にやらず段階を区切ることでデバッグ可能性を担保
- **Pre-Implementation Research Pattern**: 実装前に必ず調査、案A/B/Cで判断材料提示
- **ベンチマーク使用時**: 機械的コピーを避け、自プロジェクト特性で翻訳
- **ビジュアルとコピーの分離**: 海外参考はビジュアル要素のみトレース、コピーは日本市場向け独自表現
- **PR 分割の運用ルール**: コード修正とドキュメント追加は原則として別 PR に分割（CLAUDE.md に記載済み）

---

## 確定済みベンチマーク・差別化軸

- **ベンチマーク**: Social Sisters（https://www.socialsisters.co.uk/）
- **差別化軸**: Social Sisters「当日リアルタイム共有」 vs WCC「翌朝、ふたりだけで観る」
- **共通する核**: iPhone shot、24時間納品、candid・behind-the-scenes、unplugged wedding
- **WCC 独自軸**: 「翌朝・ふたり・余韻」（日本市場向け）

---

## リポジトリ構成（要点）

```
wcc/
├── CLAUDE.md（プロジェクト全体の方針 + PR 分割ルール）
├── docs/
│   ├── WCC_BRAND.md（v2 確定版、次セッションで v3 へ更新予定）
│   ├── WCC_PRODUCT.md（プロダクト仕様、価格 176,000 円への更新が必要かも）
│   ├── WCC_ROADMAP.md（M0〜M5）
│   ├── LP_REVISION_PLAN.md（P1完了マーク済み）
│   ├── INFRA_SETUP.md（残項目: LINE / branch保護）
│   └── drafts/
│       ├── WCC_BRAND_v2.md（判断の歴史として保持）
│       ├── LP_CURRENT_STATE.md（コミット済み）
│       └── LP_REDESIGN_PLAN.md（コミット済み）
├── reference/（既存実装の参照ドキュメント）
├── site/
│   ├── app/
│   │   ├── page.tsx（LP トップ、Phase 3 で構成更新済み）
│   │   ├── pricing/page.tsx（Phase 3 で新設、3.5 で Extras + Bespoke 追加）
│   │   └── packages/page.tsx（dead code、クリーンアップ候補）
│   ├── components/
│   │   ├── marketing/
│   │   │   ├── HomeHeroSection.tsx（Phase 2 新設）
│   │   │   ├── HomeHighlightsSection.tsx（Phase 2 新設）
│   │   │   ├── HighlightVideoCard.tsx（Phase 2 新設）
│   │   │   ├── HomeWhatIsSection.tsx（Phase 3 再構築）
│   │   │   ├── HomeDoINeedSection.tsx（Phase 3 再構築）
│   │   │   ├── HomePricingSection.tsx（Phase 3 でコンパクト版に変更）
│   │   │   └── FooterCtaSection.tsx（Phase 3 でコピー差し替え）
│   │   └── layout/
│   │       ├── SiteHeader.tsx（Phase 2 でナビ英語化）
│   │       └── SiteFooter.tsx（Phase 3 で構造化）
│   └── lib/
│       └── plans.ts（価格定数、Stripe TODO コメントあり）
├── .agents/skills/（Stripe Agent Skills 実体）
├── .claude/skills/（シンリンク）
└── skills-lock.json
```

---

## Notion 記事ネタDB

- DB ID: `64d1cd42-4a10-4f2f-a3f4-6f5733bc4a3a`
- データソース ID: `159470dd-05a9-4a88-bc12-1fb4c40b5b0e`
- 利用可能カテゴリ: 運用Tips / 失敗談 / プロンプトパターン / 役割分担 / フロー設計 / その他

開発会話中に「バイブコーダー向けの記事ネタになる気づき」があれば、このDBに記録する運用。
（記録は Skill が自動検知する設計、採否判定はユーザーが後から実施）

**前回セッションで蓄積された気づき候補**:
- LP UI 全面見直しを 1 セッションで Phase 1〜3.5 まで進めた高密度作業の経験
- 価格改定が短期間に複数回発生した運用課題
- Pre-Implementation Research Pattern の応用（実装プロンプトの中に「Masatoshi 判断要」を埋め込む設計）
- PR 分割の運用ルール化（コード修正 + ドキュメント追加の混在問題）

---

## PENDING / 別タスク残置事項

- **本番 admin 画面のパスワード問題**: 本番 Vercel で login できない（ローカルでは可）
- **Stripe Webhook Step 4 段階B**: 紐付け済みケースの動作確認、実顧客ケースで対応予定
- **LINE Messaging API 設定**: INFRA_SETUP.md 残項目
- **GitHub branch 保護設定**: INFRA_SETUP.md 残項目
- **SNS 実績アカウント立ち上げ計画**: Instagram / TikTok の運営側作業
- **`/packages` ルートのクリーンアップ**: dead code、削除またはリダイレクト化
- **Phase 4（フッターモザイクグリッド）**: M2 後半〜M3、本番動画素材 5〜10 件蓄積後

---

## 環境設定（参考）

- Resend: `for-your-wedding-day.com` ドメイン認証済み
- Stripe: アカウント `acct_1TNDyyPQ1ajIM6Ch`、apiVersion `2026-04-22.dahlia`
- Vercel: Pro プラン
- env: `OWNER_NOTIFICATION_EMAIL` ローカル `.env.local` + 本番 Vercel 両方に設定済み
- env: `STRIPE_PRICE_ID` は 176,000 円対応で更新が必要（Masatoshi が手動実施）
- Stripe CLI: v1.40.9

---

## 次の最初のアクション

「お疲れさまです。前回セッションでの Stripe 価格更新（176,000 円対応）は完了していますか?
完了していれば、`docs/drafts/WCC_BRAND_v3.md` の起草に進みましょう。
LP P3 のときと同じく、Claude Desktop が起草 → Masatoshi が確認 → コミット の流れで進めます。」

---

*引き継ぎ元: 2026-05-06 第3回セッション*
*プロジェクト: For Your Wedding Day（WCC）*
