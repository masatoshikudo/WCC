# WCC デザイン制約・指示・ルール

## 1. 固定意思決定

- ブランド主トーン: **フレンドリー・動画ファースト**
- ベンチマーク: **The Social Sisters** / **Plan With Laur**
- 表面質感: **硬め・フラット**（影なし、角丸最小）
- サービス表記: **Wedding Content Creator**（略称 WCC 可）
- スコープ: 公開サイト + `/book`（予約・決済）
- 持ち込み等の安心情報: サイト本文で強調せず、問い合わせ後/LINEで案内

## 2. ベンチマーク採用ルール

- ヘッダー/主要CTA: **The Social Sisters 型**
  - 細身ナビ
  - 右端ピル型 Primary CTA
- ヒーロー構図: **Plan With Laur 型**
  - 主見出し + 主役ビジュアル + 補助導線
- 補助導線リンク: 文字 + 矢印の単純導線を全ページで統一
- UIクローム: 影を使わず、線と余白で階層化

## 3. Visual Theme & Atmosphere

- 9:16縦動画・キャンディッド写真・顧客の声を主役にする
- ヒーローで役割を明示し、iPhone撮影/短納期を伝える
- プロフォト/ムービーとの役割分担をFAQまたは本文で明記する
- 彩度を上げすぎず、UI自体は中立色で抑える

## 4. Color Palette & Roles

### 4.0 ベーストークン（既定）

| トークン名                     | HEX       | 用途        |
| ------------------------- | --------- | --------- |
| `--color-canvas`          | `#f9f4f1` | 既定背景      |
| `--color-canvas-subtle`   | `#ffffff` | カード/サブ背景   |
| `--color-ink`             | `#171717` | 見出し・強調・輪郭 |
| `--color-ink-muted`       | `#525252` | 副次本文      |
| `--color-ink-subtle`      | `#a3a3a3` | 補助表示      |
| `--color-border-hairline` | `#e5e5e5` | 1px区切り線   |
| `--color-border-strong`   | `#171717` | 2px強調枠    |
| `--color-accent`          | `#0d9488` | 操作アクセント   |
| `--color-accent-hover`    | `#0f766e` | hover     |
| `--color-link`            | `#171717` | 本文リンク     |
| `--color-on-accent`       | `#ffffff` | アクセント上文字  |
| `--color-danger`          | `#b91c1c` | エラー       |
| `--color-success`         | `#15803d` | 成功        |

### 4.1 ベンチマーク固定制約（Plan With Laur準拠）

- 対象: ヒーロー、主要CTA、フッター、SNS導線など主要視認領域
- 優先順位: この制約は 4.0 の既定値より優先して適用する
- 色値は [Plan With Laur](https://www.planwithlaur.com/) の配色分析レポート（CSS抽出値）を正として固定する

| 制約トークン                       | HEX       | 役割 |
| ---------------------------- | --------- | ---- |
| `--color-accent`             | `#ca5311` | CTA/リンク/ホバー全般（上書き） |
| `--color-canvas-warm`        | `#f9f4f1` | Hero/CTA背景（新規） |
| `--color-canvas`             | `#f9f4f1` | サービス/ナビ背景（上書き） |
| `--color-bg-dark`            | `#000000` | フッター/モバイルナビ背景（新規） |
| `--color-ink-heading`        | `#000000` | 見出し（h1-h3） |
| `--color-ink`                | `#202620` | 本文テキスト（上書き） |
| `--color-link`               | `#263930` | 本文リンク（上書き） |
| `--color-text-on-dark`       | `#ffffff` | 黒背景上の見出し・本文 |
| `--color-footer-muted`       | `#7a6e6e` | フッター本文サブ |
| `--color-footer-link`        | `#84544d` | フッターリンク |
| `--color-footer-sub-link`    | `#ebdbf5` | フッターサブリンク（任意） |
| `--color-footer-nav-link`    | `#edc9ae` | フッターナビリンク（任意） |

### 4.2 運用ルール（厳守）

- アクセント色 `--color-accent` はテキストリンク、CTA、ホバー、アイコンなど小面積用途に限定する
- Hero/CTAの地色は `--color-canvas-warm`（`#f9f4f1`）を基本とし、白背景と明確に区別する
- 見出しは `--color-ink-heading`、本文は `--color-ink` を基本にし、役割で色を混在させない
- ダークセクションでは本文/見出しを `--color-text-on-dark` に固定し、低コントラスト配色を禁止
- フッターリンクは `--color-footer-link` を基本とし、アクセント色との競合を避ける


**禁止**

- 装飾グラデーション
- box-shadow による擬似立体

## 5. Typography Rules

### 5.1 フォントファミリー

- 見出し（H1-H4、英字タイトル/サブタイトル）: **Cormorant Garamond**（セリフ体）
- ボタン・ナビ・UIラベル（欧文主体）: **Plus Jakarta Sans**
- 日本語本文・FAQ・フォームラベル: **Noto Sans JP**
- セリフ体は見出し用途に限定し、本文・ナビ・フォームには使わない
- 日本語見出しはサンセリフ（Noto Sans JP）を維持し、英語見出しのみセリフ体を適用する

### 5.2 ウェイト運用

- 基準ウェイト: **400 / 500 / 600 / 700**
- 極細ウェイト（100系）は不採用
- UIラベル・ナビ・CTAは `600` を基本

### 5.3 サイズ階層


| 役割     | size                     | weight | line-height | letter-spacing |
| ------ | ------------------------ | ------ | ----------- | -------------- |
| H1     | `clamp(2rem, 4vw, 3rem)` | 700    | 1.1         | -0.02em        |
| H2     | `1.75rem`                | 700    | 1.2         | -0.015em       |
| H3     | `1.25rem`                | 600    | 1.3         | —              |
| リード    | `1.125rem`               | 400    | 1.65        | —              |
| 本文     | `1rem`                   | 400    | 1.75        | —              |
| UIラベル  | `0.875rem`               | 600    | 1.4         | 0.02em         |
| ボタン    | `1rem`                   | 600    | 1.25        | 0.01em         |
| キャプション | `0.8125rem`              | 400    | 1.5         | —              |


## 6. Component Stylings

### 6.1 角丸


| トークン            | 値        | 用途          |
| --------------- | -------- | ----------- |
| `--radius-sm`   | `2px`    | 入力・小ボタン     |
| `--radius-md`   | `4px`    | 輪郭ボタン等      |
| `--radius-full` | `9999px` | Primary CTA |
| `--radius-0`    | `0`      | 9:16サムネ     |


### 6.2 ボタン

- Primary CTA:
  - 背景 `--color-accent`
  - 文字 `--color-on-accent`
  - 角丸 `--radius-full`
  - `font-size: 14px`, `font-weight: 600`, `letter-spacing: 0.08em`
  - `min-height: 52px`, 左右余白は `32px` 目安（テキストサイズは固定）
  - `min-width: 220px` を目安に、視覚的に横幅を確保（center配置を推奨）
  - hover: `--color-accent-hover`
- Secondary CTA:
  - `2px solid var(--color-border-strong)`
  - `font-size: 14px`, `font-weight: 600`, `letter-spacing: 0.08em`
  - `min-height: 52px`, 左右余白は `28px` 目安（テキストサイズは固定）
  - hover: 背景 `--color-ink`、文字 `#fff`
- Ghost Link:
  - 通常下線なし
  - hover/focus-visible でアクセント + 下線

### 6.3 カード

- 影なし
- ラインなし（border: none）で固定
- 内側余白: `1.5rem`（モバイル `1rem`）

### 6.4 9:16メディア

- `aspect-ratio: 9 / 16`
- 角丸 `0`
- ホバーでズーム/ドロップシャドウ禁止

### 6.5 フォーム

- 入力枠: `2px solid var(--color-border-hairline)`
- `min-height: 44px`
- focus-visible: `outline: 2px solid var(--color-accent)` + `outline-offset: 2px`
- エラー文: `--color-danger`

### 6.6 ヘッダー/フッター

- ヘッダー:
  - 背景 `--color-canvas`（`#f9f4f1`）
  - 高さ `72px`
  - ナビは大文字 + 追い字（0.08em）
- フッター:
  - 背景 `--color-bg-dark`（`#000000`）
  - 見出し/本文 `--color-text-on-dark`、補助文 `--color-footer-muted`
  - リンク `--color-footer-link`（必要に応じて `--color-footer-sub-link` / `--color-footer-nav-link` を併用）

## 7. Layout Principles

- 8pxグリッド（`4, 8, 12, 16, 24, 32, 48, 64`）
- セクション縦余白:
  - Desktop `64px`
  - Tablet `48px`
  - Mobile `40px`
- コンテナ最大幅: `1200px`
- 横ガター:
  - Mobile `16px`
  - Tablet+ `24px`
  - Wide `32px`
- 実績グリッド: `repeat(auto-fill, minmax(140px, 1fr))`

## 8. Depth & Elevation


| レベル | 表現        | 用途                 |
| --- | --------- | ------------------ |
| 0   | 境界なし      | 基本文面               |
| 1   | 1px境界線    | 区切りのみ（カードには使わない）   |
| 2   | 2px境界線    | 強調枠/輪郭ボタン          |
| 3   | subtle背景帯 | セクション帯             |
| 4   | accent色   | CTA/フォーカス/リンクhover |


**禁止**

- box-shadow
- backdrop-blur
- ガラス風UI

## 9. Do / Don't

### Do

- ヒーローで英名 + 和文サブをセットで表示
- 予約導線は「予約する」に統一
- Primary CTAはオレンジピルで統一
- 9:16サムネは角丸0で統一
- 価格・SLAは数値で明示
- FAQでプロフォト/ビデオとの差分を明示

### Don't

- 持ち込み料/可否をトップで強調しない
- プロ業者と同一品質を想起させる誇大表現をしない
- 影/重なりで浮かせるUIを使わない
- アクセント色を大面積の装飾背景に使わない
- 自動再生 + 音声オンを既定にしない

## 10. Content Relevance Guard（無関係テキスト防止）

### 10.1 基本原則

- すべての本文・見出し・ラベルは、**ユーザーの意思決定（比較/理解/予約）に直接必要な情報のみ**に限定する
- 装飾目的の抽象文・ポエティックな文言・汎用キャッチコピーを量産しない
- 1セクション1目的（例: 価値訴求、実績提示、FAQ解消）を守り、目的外テキストを混在させない

### 10.2 掲載許可情報（Must-have）

- サービスの中身: 何を、いつ、どの形式で納品するか
- 判断材料: 料金、SLA、対応範囲、役割分担、問い合わせ/予約導線
- 信頼材料: 実績、レビュー、具体的な利用シーン

### 10.3 掲載禁止情報（Must-not）

- ユーザーの予約判断に寄与しない内輪情報（運営都合・制作裏話・抽象的な思想説明の長文化）
- 事実根拠のない権威付け文言（No.1、業界最高、完全保証 など）
- 文脈のない英字装飾テキストやダミー文（例: lorem ipsum、意味のないスローガン）
- 注意喚起や免責の過剰掲出（必要な法務情報は該当ページに限定）

### 10.4 テキスト品質チェック（公開前）

- この文は「予約判断」に役立つか？役立たなければ削除
- 固有名詞・数値・期限があるか？なければ具体化
- 同じ意味の重複文がないか？冗長なら統合
- CTA直前の文が行動を迷わせていないか？迷わせるなら短文化

## 11. Responsive Behavior


| 名称      | 幅                  | 主な変化            |
| ------- | ------------------ | --------------- |
| Mobile  | `max-width: 767px` | 1カラム、実績2列まで     |
| Tablet  | `768px–1023px`     | 実績3列            |
| Desktop | `1024px+`          | 最大幅1200px、実績4列可 |


- ボタン・ナビ・フォーム送信のタップ領域は 44x44px 以上
- 料金表はモバイルで横スクロールまたは縦スタックのどちらかに統一

## 12. `/book` ルール

- 画面構成:
  1. 選択
  2. 確認
  3. 決済
  4. 完了
- 決済UIは装飾最小、マーケティング用ビジュアルを挟まない
- エラーはインラインで表示し、ページ全体を警告色にしない
- 成功色（`--color-success`）は完了状態に限定

