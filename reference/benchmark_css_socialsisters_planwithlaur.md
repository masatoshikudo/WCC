# UIベンチマークCSS比較（The Social Sisters / Plan With Laur）

調査日: 2026-04-17  
対象:
- https://www.socialsisters.co.uk/
- https://www.planwithlaur.com/

## 1. 取得したCSS・アセット情報（一次データ）

### The Social Sisters

- `custom.css` より:
  - `body`, `h1`-`h4` に `font-family: 'Fraunces Thin', serif`
  - `font-weight: 100` ベースの極細セリフ見出し
  - `.video-block .video-player { padding-bottom: 120% }`（縦長動画比率）
- `site.css` より:
  - `--black-hsl: 0,3.13%,12.55%`（ほぼ黒）
  - `--accent-hsl: 20,11.69%,84.9%`（淡い暖色）
- 画面観察:
  - ヘッダーは細い大文字ナビ + 右端ピル型黒CTA（BOOK NOW）
  - ヒーローは余白広め、背景は低彩度、コピー主体

### Plan With Laur

- Network読み込みより:
  - Google Fonts: `Work Sans (regular / 500)`
  - カスタムフォント: `veryvogue-display.woff`, `veryvogue-display-italic.woff`, `halimun-webfont.woff`
  - スタイルシート: `pub.css`, `showit.css`
- 画面観察:
  - ヒーローは「強い人物ビジュアル + 左大見出し + 右縦導線リンク」
  - CTAリンクは文字間を広く取り、矢印を併置
  - セクションの視線誘導が明確（主役1つ + 補助導線）

## 2. コンポーネント別の採用判断

| コンポーネント | 採用元 | 理由 |
| :--- | :--- | :--- |
| ヘッダー（情報密度・CTA） | **The Social Sisters** | ピルCTAと細身ナビで、即予約導線が強い |
| ヒーロー（主構図） | **Plan With Laur** | 人物主役2カラムは価値が3秒で伝わる |
| ヒーロー補助導線（縦リンク） | **Plan With Laur** | 「見る/相談する」の行動分岐が自然 |
| カラー重心（CTAの強弱） | **The Social Sisters** | 黒CTAで視認性が高く、ファーストアクションを強化できる |
| 9:16メディア訴求 | **両者の良い点を統合** | Social Sistersの縦動画志向 + Planの主役配置 |

## 3. 反映内容（実装）

- `site/components/layout/SiteHeader.tsx`
  - ロゴ/ナビを大文字 + 追い字に調整
  - 右端CTAを**黒のピル型**に変更（Social Sistersの強みを採用）
- `site/app/page.tsx`
  - ヒーローを**2カラム再構成**（Plan With Laur型）
  - 左: 大見出し + 説明 + 主要CTA
  - 右: 9:16主役メディア + 補助導線リンク（実績/相談）

## 4. 補足

- ベンチマークのフォント（Fraunces / VeryVogue / Halimun）は、ブランド整合と日本語可読性を優先してそのまま移植せず、現行トークン内でレイアウト原則のみ採用。
- 次段では実画像/実動画アセット差し替えでヒーロー品質が大きく上がる。
