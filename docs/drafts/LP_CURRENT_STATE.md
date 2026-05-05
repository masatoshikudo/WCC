# LP 現行実装 棚卸しレポート

> **目的**: UI 全面見直しの設計判断材料を揃えるための調査記録。
> **調査者**: Claude Code（コード変更なし）
> **調査日**: 2026-05-06
> **対象ブランチ**: `feat/lp-p3-brand-revision`（LP P3 実装後の状態）
> **注意**: このファイルは調査記録のみ。コミット・PR は Masatoshi が判断する。

---

## メタ情報

| 項目 | 値 |
|---|---|
| フレームワーク | Next.js 14.2.35 App Router |
| スタイリング | Tailwind CSS + globals.css（CSS変数） |
| フォント | Google Fonts 3本（next/font/google 経由） |
| ページ構成 | トップ LP（`/`）が中心。`/book`, `/legal/*`, `/admin/*` あり |
| `<title>` | `"Wedding Content Creator"` ← 屋号と不一致（未更新） |
| `<meta description>` | `"結婚式のスマホ映像・当日納品。Wedding Content Creator（WCC）の公式サイト。"` |

---

## 1. ファイル構成

### 1.1 app/（LP 関連）

| パス | 役割 | 行数 |
|---|---|---|
| `app/layout.tsx` | RootLayout: フォント読み込み・メタデータ・ヘッダー/フッター/MobileBottomCta 配置 | 67 |
| `app/globals.css` | CSS変数定義・Tailwind base/utilities・カスタムアニメーション | 221 |
| `app/page.tsx` | LP トップページ（HomePage）— セクション構造の中心 | 291 |
| `app/book/page.tsx` | 予約フロー（LP ではないが LP から主要導線） | — |
| `app/packages/page.tsx` | `/packages` → `/#pricing` リダイレクト | — |

### 1.2 components/（LP で使用）

| パス | 役割 | 行数 |
|---|---|---|
| `components/layout/SiteHeader.tsx` | ヘッダー: ロゴ・ナビ・SNS アイコン・ハンバーガー・モバイルメニュー | 182 |
| `components/layout/SiteFooter.tsx` | フッター: FooterCtaSection + 著作権 + 法務リンク | 37 |
| `components/layout/FooterCtaSection.tsx` | フッター内 CTA（`/book` 以外で表示） | 37 |
| `components/layout/MobileBottomCta.tsx` | `SiteMobileStickyDock` の re-export | 3 |
| `components/layout/MobileStickyDock.tsx` | SP 下部固定 CTA ドック（サイト共通 + 予約フロー専用） | 90 |
| `components/layout/TwoColumnCtaSection.tsx` | 2カラムラッパー（book ページで使用、LP 本体では不使用） | 27 |
| `components/layout/SideColumnVisualPanel.tsx` | サイドビジュアル（book ページで使用、LP 本体では不使用） | 36 |
| `components/layout/HashScrollOnMount.tsx` | ページロード後にアンカーへスクロール | — |
| `components/home/HeroHighlightCarousel.tsx` | ヒーロー動画マルキー（SP/PC 別実装） | 146 |
| `components/home/HomePricingSection.tsx` | `#pricing` セクション | 74 |
| `components/home/HomeServiceFlowSection.tsx` | `#service-flow` セクション | 135 |
| `components/home/HomeFaqSection.tsx` | `#faq` セクション | 68 |
| `components/home/HomeHighlightLazyVideo.tsx` | `#highlights` 用遅延読み込み動画 | 65 |
| `components/home/HomeDynamicSkeletons.tsx` | dynamic import 用スケルトン | 70 |
| `components/performance/WebVitalsReporter.tsx` | Web Vitals 計測 | — |

### 1.3 lib/（LP 関連）

| パス | 役割 | 行数 |
|---|---|---|
| `lib/plans.ts` | パッケージ料金・免責文の単一ソース | 48 |
| `lib/home-faq.ts` | FAQ テキスト + JSON-LD 生成 | 102 |
| `lib/home-highlight-videos.ts` | ハイライト動画スライド一覧 | 15 |
| `lib/site-links.ts` | アンカー href 定数 | 20 |
| `lib/layout/home-sections.ts` | LP セクション共通レイアウトクラス定数 | 25 |
| `lib/layout/mobile-dock.ts` | SP ドッククラス・高さ計算定数 | 55 |

### 1.4 public/

| パス | 内容 |
|---|---|
| `public/videos/WC_movie_sample_1〜6.mp4` | LP 用サンプル動画（9:16、ヒーロー＆ハイライト共用） |
| `public/images/highlight-posters/wc-sample-1〜6.webp` | 動画ポスター（遅延読み込み時の静止画） |
| `public/icons/*.svg` | bars, instagram, threads, tiktok（4種） |
| `app/fonts/Geist*.woff` | Geist フォント（現時点で未使用の可能性あり） |

---

## 2. デザイントークン

### 2.1 カラー

#### CSS変数（`site/app/globals.css:6-33`）と Tailwind マッピング（`tailwind.config.ts:12-35`）

| CSS変数 | HEX | Tailwind クラス名 | 用途 |
|---|---|---|---|
| `--color-canvas` | `#f9f4f1` | `bg-canvas`（透明度修飾子あり） | 基本背景・ナビ背景 |
| `--color-canvas-subtle` | `#ffffff` | `bg-canvas-subtle` | service-detail 帯・pricing 帯 |
| `--color-canvas-warm` | `#f9f4f1` | `bg-canvas-warm` | 現状 canvas と同値 |
| `--color-ink` | `#202620` | `bg-ink-body`、`text-ink-body` | **body 本文色** |
| `--color-ink-heading` | `#000000` | **`text-ink`**（⚠️後述） | 見出しカラー |
| `--color-ink-muted` | `#525252` | `text-ink-muted` | 副次本文（LP P3 修正済み） |
| `--color-ink-subtle` | `#7a6e6e` | `text-ink-subtle` | 補助表示 |
| `--color-border-hairline` | `#e5e5e5` | `border-hairline` | 区切り線 |
| `--color-border-strong` | `#000000` | `border-strong` | 強調枠 |
| `--color-accent` | `#ca5311` | `bg-accent`、`text-accent` | CTA・リンク |
| `--color-accent-hover` | `#b84a0f` | `bg-accent-hover` | CTA hover（LP P3 で確認済み） |
| `--color-link` | `#263930` | `text-link` | 本文リンク |
| `--color-bg-dark` | `#000000` | `bg-bg-dark` | フッター・ハイライト帯 |
| `--color-text-on-dark` | `#ffffff` | `text-text-on-dark` | 黒背景上テキスト |
| `--color-footer-muted` | `#7a6e6e` | `text-footer-muted` | フッター補助文 |
| `--color-footer-link` | `#84544d` | `text-footer-link` | フッターリンク |
| `--color-footer-sub-link` | `#ebdbf5` | `text-footer-sub-link` | フッターサブリンク |
| `--color-footer-nav-link` | `#edc9ae` | `text-footer-nav-link` | フッター法務リンク |
| `--color-on-accent` | `#ffffff` | `text-on-accent` | CTA ボタン上テキスト |
| `--color-danger` | `#b91c1c` | `text-danger` | エラー |
| `--color-success` | `#15803d` | `text-success` | 成功 |

**⚠️ 重大な命名罠: `text-ink` ≠ 本文色**

```ts
// tailwind.config.ts:17
ink: "var(--color-ink-heading)",  // = #000000（純黒）
"ink-body": "var(--color-ink)",   // = #202620（暖かみのある墨緑黒）
```

Tailwind の `text-ink` は `#000000`（純黒）であり、BRAND.md 上の「本文テキスト」`#202620` ではない。
`text-ink-body` が `#202620` に対応する。実際、LP の H1 / service-detail 等では `text-ink` が使われており、
レンダリング上は純黒になっている。意図的なのかは不明。

#### ブランドドキュメントとの整合

| 変数 | BRAND.md 指定 | globals.css 現状 | 整合 |
|---|---|---|---|
| `--color-accent-hover` | `#b84a0f` | `#b84a0f` | ✅ |
| `--color-ink-muted` | `#525252` | `#525252` | ✅（LP P3 修正済み） |
| `--color-canvas` | `#FAF8F5`（BRAND.md v1 記載） | `#f9f4f1` | △（微差） |
| `--color-ink-subtle` | `#a3a3a3`（BRAND.md v1） | `#7a6e6e` | △（乖離あり） |

### 2.2 タイポグラフィ

#### フォント読み込み（`app/layout.tsx:12-33`）

| CSS変数 | フォントファミリー | Tailwind クラス | weights | 用途 |
|---|---|---|---|---|
| `--font-display` | **Plus Jakarta Sans**（サンセリフ） | `font-display` | 400, 600, 700 | ナビ・UI ラベル・ボタン・セクション H2 |
| `--font-body` | **Noto Sans JP**（サンセリフ） | `font-body` | 400, 500, 600, 700 | 日本語本文・H1（LP）・FAQ |
| `--font-heading` | **Cormorant Garamond**（セリフ） | `font-heading` | 500, 600, 700 | 英語見出し（`#what-is-wcc` H2 のみ） |

**⚠️ LP P3 実装バグ（要修正）**

```tsx
// site/components/layout/SiteHeader.tsx:22（現状）
className="font-display text-sm font-medium tracking-[0.04em] text-ink md:text-base"
//          ^^^^^^^^^^^
//          font-display = Plus Jakarta Sans（サンセリフ）
//          BRAND.md の指定は Cormorant Garamond（セリフ体）= font-heading
```

`font-display` は Plus Jakarta Sans、`font-heading` が Cormorant Garamond。
LP P3 でロゴを "For Your Wedding Day" に変更した際に `font-heading` に変更すべきところ、
`font-display` のまま残した。現在ロゴは **Plus Jakarta Sans で表示されている**。

#### サイズ実装値

| 要素 | Tailwind/インラインクラス | 実効サイズ |
|---|---|---|
| LP Hero H1 | `text-[clamp(2.35rem,5vw,4.25rem)]` | 37.6px〜68px |
| Section H2（共通） | `text-[clamp(2rem,4.2vw,4rem)]` | 32px〜64px |
| Section H3（service-flow） | `text-lg md:text-xl` | 18px / 20px |
| pricing H3（プラン名） | `text-[clamp(2rem,4.2vw,4rem)]` | 32px〜64px |
| pricing 金額 | `text-3xl` | 30px |
| Body paragraph | `text-base` | 16px |
| Body small | `text-sm` | 14px |
| Body xs | `text-xs` | 12px |

#### letter-spacing 実装値

| 要素 | 値 | 実装方法 |
|---|---|---|
| Hero H1 | `-0.035em` | Tailwind `tracking-[-0.035em]` |
| Section H2（共通） | `-0.03em` | inline style `{ letterSpacing: "-0.03em" }` |
| ヘッダーロゴ | `0.04em` | Tailwind `tracking-[0.04em]` |
| CTA ボタン | `0.08em` | Tailwind `tracking-[0.08em]` |
| ハイライト小見出し（`9:16`） | `0.1em` | Tailwind `tracking-[0.1em]` |

### 2.3 スペーシング

- **基本単位**: 4px（Tailwind デフォルト）
- **実際の使われ方**: セクション垂直余白は `pt-40 pb-40`（160px）/ `md:pt-48 md:pb-48`（192px）が基準
- コンテナ横ガター: `px-4`（16px）/ `md:px-6`（24px）/ `lg:px-8`（32px）
- コンテナ最大幅: `max-w-content` = 1200px（Tailwind 拡張）
- ヒーロー内テキストブロック: `max-w-[800px]`、SP `p-6`、md `p-[150px]`（**インライン 150px** は特異）
- カード内余白: `p-3`（ハイライト記事）、`px-4 py-4`（ハイライトテキスト部）

### 2.4 ブレークポイント

Tailwind デフォルト（overrideなし）:

| 名称 | 幅 | 主な変化 |
|---|---|---|
| `sm` | 640px | hero 内 `p-10` |
| `md` | 768px | 2カラム化・PC 固定 CTA 表示・SP ドック非表示 |
| `lg` | 1024px | 3カラム化（highlights）・横ガター拡大 |

ヘッダー高さ: SP `h-20`（80px）/ PC `h-24`（96px）

### 2.5 ボーダー半径・シャドウ

CSS変数:
- `--radius-sm: 2px` / `--radius-md: 4px` / `--radius-full: 9999px`
- `--radius-media: 2rem`（定数定義のみ、実装では `rounded-[2rem]` のハードコード）

シャドウ: `box-shadow` の使用は **なし**（BRAND.md 禁止に準拠）

ヒーローテキストシャドウ（BRAND.md「可読性目的を超えるは禁止」のグレーゾーン）:
```
[text-shadow:0_0_48px_rgb(var(--color-canvas-rgb)/_0.4),0_0_96px_rgb(var(--color-canvas-rgb)/_0.3),0_1px_3px_rgb(32_38_32/_0.25)]
```
注: 第3要素 `rgb(32_38_32/_0.25)` は `--color-ink`（`#202620`）の数値を**ハードコード**している。CSS変数未使用。

---

## 3. ページ構造

トップページ（`app/page.tsx`）のセクション順:

### 3.1 セクション一覧

| # | id | 背景 | コンポーネント | 高さ/特徴 |
|---|---|---|---|---|
| 1 | `#hero` | `bg-canvas`（動画が全面） | `HeroHighlightCarousel`（dynamic） | `min-h: 100svh - 5rem` |
| 2 | `#service-detail` | `bg-canvas-subtle`（白） | page.tsx 内インライン | `pt-40 pb-40`（SP: mt-24） |
| 3 | `#highlights` | `bg-bg-dark`（黒） | `HomeHighlightLazyVideo` | `pt-32 pb-48` |
| 4 | `#what-is-wcc` | `bg-canvas`（キャンバス） | page.tsx 内インライン | `pt-40 pb-40` |
| 5 | `#pricing` | `bg-canvas-subtle`（白） | `HomePricingSection`（dynamic） | `pt-40 pb-0 md:pb-48` |
| 6 | `#service-flow` | `bg-canvas`（キャンバス） | `HomeServiceFlowSection`（dynamic） | `pt-40 pb-40` |
| 7 | `#faq` | `bg-canvas`（キャンバス） | `HomeFaqSection`（dynamic） | `mt-16 pt-16` |

フッター: `bg-bg-dark`（`SiteFooter` → `FooterCtaSection` + 著作権 + 法務ナビ）

SP 固定: `MobileBottomCta`（= `SiteMobileStickyDock`）— `/book` 以外に表示

### 3.2 構造上の特徴

- **dynamic import**: `HomePricingSection` / `HomeServiceFlowSection` / `HomeFaqSection` / `HeroHighlightCarousel` の4本が全て `next/dynamic`（スケルトン付き）
- **JSON-LD**: FAQ の構造化データを `<script type="application/ld+json">` でインジェクト
- **ヒーロー動画**: サンプル6本（`WC_movie_sample_1〜6.mp4`）を SP・PC 両方でマルキー表示。`MARQUEE_LOOP_SLIDES` は 12 枚（6枚を2倍）
- **コンテンツカラム**: `HOME_CONTENT_INNER_COLUMN_CLASS` = `mx-auto w-full max-w-content px-4 md:px-6 lg:px-8` が全セクション共通

---

## 4. コピーライティング

### 4.1 全テキスト一覧

#### ヘッダー
- ロゴ: `For Your Wedding Day`（LP P3 更新済み）
- ナビ: `価格` / `ギャラリー`
- CTA: `まず相談する`

#### `#hero`（`app/page.tsx:94-111`）
- H1: `翌朝、ふたりで観る、昨日のすべて。`（LP P3 更新済み）
- Sub: `結婚式の翌朝、コーヒーを淹れて。その日のうちに届く、ふたりだけの縦動画。`（LP P3 更新済み）

#### `#service-detail`（`app/page.tsx:142-165`）
- H2: `結婚式のステキな瞬間を、翌日にはシェアできる。`
- 本文p1: `Wedding Content Creatorは、演出ではなく当日その場の高まりをそのまま縦型のショート動画へ仕立てるサービスです。軽やかに流れる一本は、見返すたびにあの日の空気がよみがえり、気分が上がる記録になります。`
- 本文p2: `納品は、SNSにそのまま使える9:16の縦動画です。ハイライトは当日中から翌日を目安にお届けするため、ご家族やゲストともすぐ共有できます。`

#### `#highlights`（`app/page.tsx:167-248`）
- H2: `その日の空気を そのまま`
- Sub: `その日の空気をそのまま残した縦型コンテンツ動画と、実際の新郎新婦の声をまとめています あの一日の高まりが、どんな形で残るのかをご覧ください`
- 証言6件（下記参照）

| # | couple | venue | description | credit |
|---|---|---|---|---|
| 1 | K・Y 様 | 東京都内（会場名非公開） | 披露宴後すぐに家族へ共有... | 2025年秋婚 / 東京都 |
| 2 | M・R 様 | 神奈川県内（会場名非公開） | フォト・ムービーと役割が分かれていた... | 2026年春婚 / 神奈川県 |
| 3 | **Lucy and Chris** | **The Post Barn, Newbury, UK** | 短い動画でも流れが自然で... | なし |
| 4 | **Sophie & Daniel** | **Villa Balbiano, Lake Como, Italy** | 景色と余韻が、一本の縦動画に... | なし |
| 5 | **Taylor Morgan** | **New York City Loft Wedding** | 準備から祝宴まで... | なし |
| 6 | **Amelia & George** | **Cotswolds Barn Celebration, UK** | 屋外と屋内の切り替えが... | なし |

⚠️ 3〜6 は明らかに海外架空カップル（WCC_ROADMAP.md P2 課題「ストック素材疑い」と連動）

#### `#what-is-wcc`（`app/page.tsx:250-280`）
- H2: `Wedding Content Creator?`（英語、Cormorant Garamond 適用）
- 本文p1: `Wedding Content Creator（以下、WCC）は、結婚式当日におふたりのそばで取材する担当です。iPhoneで式の流れを記録し、あとから見て情景がつながる短い映像に編集します。`
- 本文p2: `大掛かりな演出を組み立てる役割ではなく、近い距離から拾った表情やゲストの反応を、一本の流れとして立ち上げます。プロの本編ムービーとは役割が異なり、当日の空気を手軽に残したい方向けの記録です。`

#### `#pricing`（`HomePricingSection.tsx`）
- H2: `翌日までに手元に届くパッケージ`
- Sub: `一本は9:16の縦動画で、SNSにそのまま載せられる形でお渡しします。ハイライトは当日中から翌日を目安に届くため、あの日の高まりを、すぐに誰かと分け合えます。表示は税抜です。内訳の条件は下のパッケージ内容で確認でき、FAQと食い違うときはこちらを優先してください。`
- パッケージ名: `パッケージプラン`
- 価格: `150,000円（税抜）`
- 免責: `交通費は含まれておりません。また、場所や式場プランによっては宿泊が必要となる場合があります。`

#### `#service-flow`（`HomeServiceFlowSection.tsx`）
- H2: `ご相談から当日までの流れ`
- 8ステップ（ご相談3 + ご契約2 + 準備〜当日3）

#### `#faq`（`HomeFaqSection.tsx` + `lib/home-faq.ts`）
- 2グループ（サービス内容 4問 + 納品・料金 6問）= 合計10問
- JSON-LD（FAQPage）付き

#### フッター CTA（`FooterCtaSection.tsx:20-21`）
- H2: `永遠に残る思い出を捉える` ← **⚠️後述（禁句グレーゾーン）**
- 本文: `日程が未定でも、先にご相談いただけます。希望日と残したい瞬間を共有いただければ...`
- CTA: `まず相談する`

#### フッター（`SiteFooter.tsx:11`）
- 著作権: `© {year} Wedding Content Creator. All rights reserved.` ← **屋号と不一致（未更新）**

#### SP 固定ドック（`mobile-dock.ts:12-14`）
- 主 CTA: `まず相談する`
- 補助: `日程が未定でもご相談いただけます` / `送信後に担当よりメールでご連絡します`

### 4.2 禁句チェック結果（`WCC_BRAND.md` セクション 4.3 の禁句リスト）

| 禁句 | 使用箇所 | 評価 |
|---|---|---|
| 「感動」（感情の断定） | なし（LP P3 で除去済み） | ✅ |
| 「最高の」「奇跡の」 | なし | ✅ |
| 「AI搭載」「テクノロジー」 | なし | ✅ |
| 「インスタ映え」「バズる」 | なし | ✅ |
| 「お客様」「クライアント」 | なし（LP 上では） | ✅ |
| 「世界に一つ」「一生に一度」（v2 追加） | なし | ✅ |
| 「感動を届ける」（v2 追加） | なし | ✅ |
| **「永遠に残す」相当表現** | `FooterCtaSection.tsx:20`「**永遠に残る思い出を捉える**」| ⚠️ グレーゾーン |

`FooterCtaSection` の H2「永遠に残る思い出を捉える」は、`WCC_BRAND_v2.md` で Social Sisters の "capturing memories that will last forever" と **意図的に対比**し「WCC は言わない」方向性が示されている概念に近い。確認が必要。

### 4.3 推奨語使用状況

| 推奨語 | 使用箇所 |
|---|---|
| 翌朝 | ヒーロー H1・Sub、pricing Sub など複数 |
| ふたり | ヒーロー H1・Sub、service-detail など |
| 余韻 | なし（現状 LP では未使用） |
| 軽やかに | service-detail `軽やかに流れる一本` |
| 高まり | service-detail / highlights 複数 |
| そのまま | highlights H2、`what-is-wcc` |
| 等身大 | なし |
| iPhoneで | `what-is-wcc` |

---

## 5. 実装上の負債

### 5.1 ロゴフォント間違い（LP P3 で私が導入したバグ）

**場所**: `site/components/layout/SiteHeader.tsx:22`
**問題**: ロゴに `font-display`（= Plus Jakarta Sans）を使用しているが、`WCC_BRAND.md`の指定は Cormorant Garamond（= `font-heading`）
**修正**: `font-display` → `font-heading`
**影響**: 現在ロゴ「For Your Wedding Day」が Plus Jakarta Sans サンセリフで表示されている

### 5.2 Tailwind `ink` = 純黒 `#000000`（命名トラップ）

**場所**: `tailwind.config.ts:17`
**問題**: `ink` が `--color-ink-heading`（`#000000`）にマップされており、本文色 `--color-ink`（`#202620`）は `ink-body` に割り当てられている。直感と逆。`text-ink` を使うと純黒になる。
**現状**: Hero H1、section H2 等で `text-ink` が使われており、純黒レンダリングになっている。これが意図的かどうかが不明。

### 5.3 ページメタデータ未更新

**場所**: `app/layout.tsx:35-39`
```ts
title: "Wedding Content Creator",   // → "For Your Wedding Day" に更新が必要
description: "...Wedding Content Creator（WCC）の公式サイト。"
```
**影響**: SEO・SNS シェア時に「Wedding Content Creator」で表示される

### 5.4 フッター著作権表記未更新

**場所**: `site/components/layout/SiteFooter.tsx:11`
```tsx
© {new Date().getFullYear()} Wedding Content Creator. All rights reserved.
// → 「For Your Wedding Day」に更新が必要
```

### 5.5 架空の海外カップル証言4件

**場所**: `app/page.tsx:198-219`（highlights セクション）
Lucy and Chris（UK）/ Sophie & Daniel（Lake Como）/ Taylor Morgan（NYC）/ Amelia & George（UK）
実績なしの時点で掲載しているが、海外ストック素材との違いが視覚的に判断できない状態。
K・Y 様・M・R 様の日本の実証言との混在は「信頼性向上」目的と逆効果のリスク。

### 5.6 dead CSS: `.hero-pass-mobile`

**場所**: `site/app/globals.css:147-157`
`.hero-pass-mobile` クラスは定義されているが、`HeroHighlightCarousel.tsx` でこのクラスを使っている箇所がない。SP の動画マルキーは `hero-marquee-track` で実装されており、`hero-pass-mobile` は古い設計の残骸と思われる。

### 5.7 ヒーローテキストシャドウの数値ハードコード

**場所**: `app/page.tsx:48-49`
```ts
const HERO_TEXT_SHADOW_CLASS =
  "[text-shadow:0_0_48px_rgb(var(--color-canvas-rgb)/_0.4),...,0_1px_3px_rgb(32_38_32/_0.25)]";
//                                                                              ^^^^^^^^
//                                                              #202620 = --color-ink の数値直書き
```
CSS変数を使わずハードコード。`--color-canvas-rgb` は変数を使っているが一部だけ。

### 5.8 Hero 内テキストブロックに `md:p-[150px]` という特大余白

**場所**: `app/page.tsx:92`
```tsx
<div className="... md:min-h-[800px] md:p-[150px]">
```
PC で H1 テキストが左上隅に大きな余白で表示される設計。`min-h-[800px]` も絶対値指定。
PC レイアウトが設計意図通りかは視覚確認が必要。

### 5.9 `service-detail` の H2 コピーに禁句グレーゾーン

**場所**: `app/page.tsx:146-149`
```
「結婚式のステキな瞬間を、翌日にはシェアできる。」
```
「ステキな瞬間」は「一生に一度」系の常套句に近いニュアンス。また「シェアできる」はツール的な言葉で WCC のトーンと微妙にズレる。

### 5.10 `service-detail` で "Wedding Content Creator" を主語に

**場所**: `app/page.tsx:153`
「Wedding Content Creatorは、演出ではなく...」— 屋号は "For Your Wedding Day" なので、「わたしたちは」または「For Your Wedding Dayは」に変更が望ましい。

---

## 6. ベンチマーク比較（Social Sisters）

### 6.1 近い部分

| 観点 | 現状実装 |
|---|---|
| ヘッダー構造 | 左ロゴ・右ナビ＋ CTA ピル形状 — Social Sisters 型に近い |
| 9:16 動画縦表示 | ハイライトグリッド・ヒーローマルキーで採用 |
| ダークセクション | `#highlights` 黒背景 — Social Sisters の暗色展開と近い |
| モバイルファースト | SP 固定ドック・ヒーロー高さ計算が SP 優先設計 |
| セリフ体アクセント | `font-heading`（Cormorant Garamond）— Social Sisters のサーキュラーセリフと類似方向 |

### 6.2 違う部分（WCC の現状 LP が Social Sisters より劣る点）

| 観点 | Social Sisters | WCC 現状 |
|---|---|---|
| 視覚的洗練度 | 一貫した高品質写真・動画 | サンプルはあるが件数・質の均一性未確認 |
| 実績のリアリティ | 3年・250件以上 | 架空カップル4件混在 |
| コピーの密度 | シンプル・余白重視 | service-detail・FAQ が情報量多め |
| ロゴ | ブランドロゴが確立 | 現状テキスト（かつ誤フォント） |
| SNS 連動 | Instagram・TikTok が live | リンク先がトップページ（未開設） |

---

## 7. 全面見直しに向けた論点候補

Claude Desktop に判断を仰ぐべき論点:

### 論点1: `text-ink` = `#000000` は意図的か

Tailwind の `ink` が純黒を指していることは設計意図と一致しているか。
Hero H1（`text-ink`）が `#202620` でなく `#000000` で表示されている現状をどう評価するか。
**修正するなら**: Tailwind config の `ink` を `var(--color-ink)` に変更し、`ink-body` を廃止または `ink-heading: var(--color-ink-heading)` に改名する。

### 論点2: ヒーロー構造の全面見直し方針

現状のヒーローは「テキスト左上 + 動画マルキー全面背景」構造（PC）。
`md:min-h-[800px]` / `md:p-[150px]` という特大値が前提になっている。
全面見直し時に、このヒーロー構造を維持するか、より単純化するか。

### 論点3: `#highlights` セクションの架空カップル処理

実績なしの時点でのストック証言4件をどう扱うか。
**選択肢**: (a) セクション丸ごと削除（実績蓄積まで非表示）/(b) 架空カップルのみ削除して日本実証言2件のみ残す/(c) 動画だけ残して証言ゼロの「作例動画」として見せる

### 論点4: フッター CTA「永遠に残る思い出を捉える」の扱い

"capturing memories that will last forever" に相当する文言を WCC が使うかどうか（`WCC_BRAND_v2.md` の Social Sisters との対比で「WCCは言わない」方向性が示されていた概念）。
**修正案**: 「翌朝のふたりに届ける」「式の翌日にはもう共有できる」など翌朝軸のコピーに置き換える。

### 論点5: ページタイトル・メタ description の更新

`title: "Wedding Content Creator"` → `"For Your Wedding Day"` への変更可否。
SEO 影響（現状 WCC で検索流入がある場合は慎重に）と屋号統一のトレードオフ。

### 論点6: ロゴフォント修正の即時対応 vs 見直し待ち

LP P3 で誤って Plus Jakarta Sans を使ったロゴ（`font-display`）を、見直し全体の前に先行修正（`font-heading` に変更）するか、全面見直しと同時にやるか。

### 論点7: `service-detail` セクションのコピー・役割の再定義

現状のコピーが "Wedding Content Creator は..." と主語が屋号になっており、また「ステキな瞬間」という常套句を含む。
翌朝軸のヒーローコピーとの世界観接続が弱い。全面見直しで `#service-detail` をどう位置付けるか。

### 論点8: SP ヒーロー動画マルキーの方式維持か変更か

現状は6枚の縦動画が右から左へ流れる（56s ループ）。`hero-pass-mobile`（pass-through アニメーション）という設計が残骸として残っている。SP ヒーロービジュアルをマルキー以外の方式（フルスクリーン1本・スワイプカード等）に変えるかどうか。

### 論点9: Hero テキストとビジュアルのレイヤー関係

現状: テキスト（z:10）が動画（z:0）の上に乗り、半透明ベール（z:1）で読みやすさを確保。
動画が背景の場合、コピーの視認性はテキストシャドウに依存している。
「写真・動画を主役にする」BRAND 原則と「コピーが動画の上に被さる」構造のトレードオフをどう解決するか。

### 論点10: Section H2 の「Plus Jakarta Sans 固定」は適切か

現状の `SECTION_H2_CLASS` は全セクション H2 を `font-display`（Plus Jakarta Sans）で表示。
`#what-is-wcc` のみ `font-heading`（Cormorant Garamond）+ `lang="en"` で差異をつけている。
見直し後、日本語 H2 も `font-body`（Noto Sans JP）または `font-heading` で設計するか、Plus Jakarta Sans を維持するか。

---

*作成日: 2026-05-06*
*ステータス: 調査完了・未コミット（commit は Masatoshi が判断）*
