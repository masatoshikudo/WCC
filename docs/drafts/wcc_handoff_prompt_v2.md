# WCC（For Your Wedding Day）プロジェクト 引き継ぎプロンプト

このプロンプトは前回セッション（2026-05-06 第2回）からの引き継ぎです。
あなたは Claude Desktop として、WCC プロジェクトの設計役を担います。

---

## プロジェクト基本情報

- **屋号**: For Your Wedding Day（FYWD は廃止確定、WCC は内部用のみ）
- **ドメイン**: `for-your-wedding-day.com`
- **GitHub**: `https://github.com/masatoshikudo/WCC.git`
- **形態**: 個人事業（BtoC リアルサービス業）
- **メイン体験**: 「翌朝、二人で昨日を笑い合うための動画」
- **価格**: 150,000円(税抜)、6時間撮影、24時間以内納品、9:16縦動画2本+メイキング+全素材
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

## 直近の主要進捗（前回セッション = 2026-05-06 第2回）

### LP UI 全面見直し議論を開始

LP P3 残債修正（A 群）完了後、UI レベルの全面見直しに着手。
LP P3 はブランドコピーレベルの確定までで、UI レベル（情報設計・タイポ・レイアウト・余白のリズム）は未着手だった。

### Phase 1: 棚卸しレポート作成（コミット済み）

`docs/drafts/LP_CURRENT_STATE.md` を Claude Code が起草・コミット済み。
- 全ファイル構成・デザイントークン・コピー全文の棚卸し
- 全面見直しに向けた論点 10 件を提示

### Phase 2: A 群即時修正 PR（マージ済み）

LP P3 残債を解消する `fix/lp-p3-residual-issues` ブランチで 1 PR、4 件の修正をマージ済み:
1. ロゴフォント修正（`font-display` → `font-heading` = Cormorant Garamond）
2. ページメタデータ屋号更新（`Wedding Content Creator` → `For Your Wedding Day`）
3. フッター著作権屋号更新
4. `#highlights` セクションから架空カップル証言削除（動画はダミー作例として残置、本番動画差し替え想定をコメントで明示）

### Phase 3: Social Sisters UI 観察

PC / SP の主要 3 ページ（Weddings / Pricing / Contact）のフルキャプチャを観察し、
UI レベルの 15 項目の原則を抽出した。

### Phase 4: LP_REDESIGN_PLAN.md 起草（**コミット待ち**）

`docs/drafts/LP_REDESIGN_PLAN.md` を Claude Desktop が起草、Masatoshi が手動配置・コミット予定。

---

## 確定済みの基本姿勢（LP_REDESIGN_PLAN.md より）

- **ビジュアル原則は Social Sisters に揃える / コピーの世界観は WCC 独自軸を維持する**
- 揃える: A. レイアウト構造 / B. タイポグラフィ / C. カラーパレット / D. 情報量
- 揃えない: E. コピーの世界観（翌朝・ふたり・余韻軸 / 禁句「感動・永遠」維持）

### 既に確定した論点（3 つ）

- **論点 1（ヒーロー）**: 案 C = γ 案（テキストヒーロー + 直後第 2 セクションに 9:16 動画グリッド）
- **論点 3（タイポグラフィ）**: 案 B = α-2（Cormorant Garamond 維持、サイズ・字間・weight で攻める）
- **ロゴフォント方針**: α-2（Cormorant のまま、ディスプレイ感を組版で再現）

### 未確定の論点（次セッションで判断する 10 項目）

| # | 論点 | 私の推奨 |
|---|---|---|
| 1 詳細 | ヒーロー高さ | 70vh |
| 1 詳細 | CTA ボタン数 | 2 個（まず相談する + パッケージを見る） |
| 1 詳細 | ヒーローテキスト位置 | 中央寄せ |
| 2 | カラーパレット | 案 A（Social Sisters 完全模倣） |
| 2 詳細 | ベース ベージュ HEX | `#EFEBE5` 起点に Social Sisters 実機色確認 |
| 3 詳細 | ヒーロー H1 サイズ | `clamp(2.75rem, 6vw, 5rem)` = 44〜80px |
| 3 詳細 | ヒーロー H1 weight / 字間 | weight 300 / 字間 0.02em |
| 3 詳細 | ナビ英語化 + 全大文字 | はい（「PRICING / GALLERY」） |
| 4 | 情報構造の刈り込み | 案 C（中間解、`/pricing` 別ページ新設） |
| 5 | フッター再設計 | 案 C（モザイクは Phase 4 = M2 後半〜M3） |
| 5 詳細 | フッター CTA H2 コピー | 「翌朝のふたりへ、ひとつ届ける。」 |

---

## 次セッションの最優先タスク

### 1. LP_REDESIGN_PLAN.md コミット確認

冒頭で確認:
- Masatoshi がリポジトリに配置・コミット済みか
- 未コミットなら、まずそれを完了させる

### 2. 5 論点判断（10 項目）

`docs/drafts/LP_REDESIGN_PLAN.md` セクション 7 のサマリー表に従い、Masatoshi と 1 項目ずつ判断する。
LP P3 のときと同じ進め方:
- 私（Claude Desktop）が論点ごとに案 A/B/C と推奨を提示
- Masatoshi が判断
- 次論点へ

判断完了後、確定版を再生成 → コミット。

### 3. Phase 1 実装プロンプト起草

確定版を踏まえて、Claude Code への Phase 1 実装プロンプト（`feat/lp-redesign-phase-1-tokens`）を起草。
内容: カラーパレット CSS 変数刷新 + Tailwind `ink` 命名トラップ解消 + フォントトークン調整。

### 4. Phase 1 完了後 → BRAND v3 起草

実装で確定した値を取り込んだ形で `docs/drafts/WCC_BRAND_v3.md` を起草する。
LP P3 のときの WCC_BRAND_v2.md と同じ位置付け。
LP P3 から覆った項目（カラー案 A 最小修正 / 写真ファースト原則のカラー大改訂）を明示する。

---

## 重要な設計原則（継承）

- **完了の定義**: 「マージ済み + 動作確認済み」で統一
- **ドキュメント運用**: 削除ではなく完了マークで判断の歴史を残す
- **議論したい論点**: 「忘れない仕組み」として記録、実顧客フィードバック後に再検討
- **Step 分割**: 一気にやらず段階を区切ることでデバッグ可能性を担保
- **Pre-Implementation Research Pattern**: 実装前に必ず調査、案A/B/Cで判断材料提示
- **ベンチマーク使用時**: 機械的コピーを避け、自プロジェクト特性で翻訳
- **ビジュアルとコピーの分離**: 海外参考はビジュアル要素のみトレース、コピーは日本市場向け独自表現
- **写真ファースト原則**: LP のカラーパレットは将来的に実作例写真とハーモナイズして決定
  - → 本プランで前倒し実施。`#EFEBE5` 起点に検討中

---

## 確定済みブランド方針

- **ベンチマーク**: Social Sisters（https://www.socialsisters.co.uk/）
- **差別化軸**: Social Sisters「当日リアルタイム共有」 vs WCC「翌朝、ふたりだけで観る」
- **共通する核**: iPhone shot、24時間納品、candid・behind-the-scenes、unplugged wedding
- **WCC 独自軸**: 「翌朝・ふたり・余韻」（日本市場向け）
- **禁句**: 最高の / 奇跡の / 感動の（断定）/ プラットフォーム / AI / お客様 / VIBES / bestie 直訳 / 永遠
- **推奨語**: お二人 / 翌朝 / 余韻 / 軽やかに / そっと / iPhoneで紡ぐ / 翌朝のコーヒーのように

---

## 実装の段階分け（LP_REDESIGN_PLAN.md より）

| Phase | 内容 | PR ブランチ | タイミング |
|---|---|---|---|
| 1 | トークン基盤再構築（カラー / フォント / Tailwind 命名整理） | `feat/lp-redesign-phase-1-tokens` | 5 論点判断完了直後 |
| 2 | ヒーロー + Highlights セクション再構築 | `feat/lp-redesign-phase-2-hero-highlights` | Phase 1 完了後 |
| 3 | 情報構造刈り込み + フッター再設計 | `feat/lp-redesign-phase-3-structure-footer` | Phase 2 完了後 |
| 4 | フッターモザイクグリッド | `feat/lp-redesign-phase-4-footer-mosaic` | M2 後半〜M3（本番動画素材蓄積後） |

---

## リポジトリ構成（要点）

```
wcc/
├── CLAUDE.md（プロジェクト全体の方針）
├── docs/
│   ├── WCC_BRAND.md（v2 確定版、Phase 1 完了後に v3 へ更新予定）
│   ├── WCC_PRODUCT.md（プロダクト仕様）
│   ├── WCC_ROADMAP.md（M0〜M5）
│   ├── LP_REVISION_PLAN.md（P1完了マーク済み）
│   ├── INFRA_SETUP.md（残項目: LINE / branch保護）
│   └── drafts/
│       ├── WCC_BRAND_v2.md（判断の歴史として保持）
│       ├── LP_CURRENT_STATE.md（コミット済み）
│       └── LP_REDESIGN_PLAN.md（コミット予定 ← 次セッション冒頭で確認）
├── reference/（既存実装の参照ドキュメント）
├── site/（Next.js 14.2.35 アプリ本体）
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

---

## PENDING / 別タスク残置事項

- **本番admin画面のパスワード問題**: 本番Vercelで login できない（ローカルでは可）
- **Stripe Webhook Step 4 段階B**: 紐付け済みケースの動作確認、実顧客ケースで対応予定
- **LINE Messaging API 設定**: INFRA_SETUP.md 残項目
- **GitHub branch 保護設定**: INFRA_SETUP.md 残項目
- **SNS 実績アカウント立ち上げ計画**: Instagram / TikTok の運営側作業

---

## 環境設定（参考）

- Resend: `for-your-wedding-day.com` ドメイン認証済み
- Stripe: アカウント `acct_1TNDyyPQ1ajIM6Ch`、apiVersion `2026-04-22.dahlia`
- Vercel: Pro プラン
- env: `OWNER_NOTIFICATION_EMAIL` ローカル `.env.local` + 本番Vercel両方に設定済み
- Stripe CLI: v1.40.9

---

## 次の最初のアクション

「`docs/drafts/LP_REDESIGN_PLAN.md` のコミットは完了しましたか？ 完了していれば、5 論点判断に進みましょう。論点 2（カラーパレット）から始めるのが、後続の判断に影響が大きいので推奨です。」

---

*引き継ぎ元: 2026-05-06 第2回セッション*
*プロジェクト: For Your Wedding Day（WCC）*
