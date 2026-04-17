# Plan With Laur — 配色分析レポート

本レポートは、[Plan With Laur](https://www.planwithlaur.com/) のウェブサイト上で実際に使用されている配色（CSSから抽出した値）を整理・分析したものです。サイト全体のデザインは、無彩色（白・黒・クリーム）を基調としつつ、1色のアクセントカラーを効果的に配置することで、洗練された印象と高い視認性を両立しています。

---

## 1. ブランドカラー（アクセント）

サイト全体を通じて、インタラクティブな要素（リンク、ボタン、ホバー時の色など）には一貫して **Burnt Orange（#CA5311）** が使用されています。この1色がブランドの個性を際立たせ、ユーザーの視線を自然に誘導する役割を果たしています。

| 役割 | 色名 | HEX | RGB値 |
|------|------|-----|-------|
| **CTA・リンク・ホバー全般** | Burnt Orange | `#CA5311` | rgba(202, 83, 17, 1) |

---

## 2. 背景色

背景色は、セクションごとに明度の異なる3色を使い分けることで、コンテンツの区切りを明確にしています。特に、Heroセクション（ファーストビュー）やCTAエリアには温かみのあるクリーム色を用いることで、ユーザーに安心感を与えています。

| セクション | 色名 | HEX | RGB値 |
|-----------|------|-----|-------|
| Hero（イントロ）・CTA | Warm Cream | `#F9F4F1` | rgba(249, 244, 241, 1) |
| サービス・メディア掲載 | Pure White | `#FFFFFF` | rgba(255, 255, 255, 1) |
| フッター・モバイルナビ | Jet Black | `#000000` | rgba(0, 0, 0, 1) |
| ナビゲーションバー | Pure White | `#FFFFFF` | rgba(255, 255, 255, 1) |

---

## 3. テキスト色

テキスト色は、完全な黒（#000000）を見出しに限定し、本文にはわずかに緑みを帯びた深い色（#202620）を採用しています。これにより、白背景とのコントラストが和らぎ、長文でも読みやすく、かつ上品な印象を与えます。

| 用途 | 色名 | HEX | RGB値 |
|------|------|-----|-------|
| 見出し（h1 / h2 / h3） | Black | `#000000` | rgba(0, 0, 0, 1) |
| 本文テキスト（paragraph） | Deep Forest | `#202620` | rgba(32, 38, 32, 1) |
| 本文内リンク | Dark Forest | `#263930` | rgba(38, 57, 48, 1) |
| フッター・ナビ（黒背景上） | White | `#FFFFFF` | rgba(255, 255, 255, 1) |
| フッター本文 | Warm Gray | `#7A6E6E` | rgba(122, 110, 110, 1) |
| フッターリンク | Dusty Rose | `#84544D` | rgba(132, 84, 77, 1) |

---

## 4. ボタン

ボタンのデザインは、重要度に応じて塗りつぶし（Primary）とアウトライン（Secondary）を使い分けています。また、特定のセクションではアクセントカラーを用いた透明背景のボタンが配置されています。

| ボタン種別 | 背景色 | テキスト色 | ボーダー色 |
|-----------|--------|-----------|-----------|
| Primary（塗りつぶし） | `#000000` | `#FFFFFF` | `#000000` |
| Secondary（アウトライン） | 透明 | `#000000` | `#000000` |
| CTA（intro / services） | 透明 | `#CA5311` | `#CA5311` |

---

## 5. サブカラー（フッター内）

黒背景のフッター領域では、白文字だけでなく、複数の淡いトーンの色をリンクやテキストに用いることで、情報の階層を視覚的に整理しています。

| 役割 | 色名 | HEX | RGB値 |
|------|------|-----|-------|
| フッターナビ サブリンク | Lavender Mist | `#EBDBF5` | rgba(235, 219, 245, 1) |
| フッターナビ リンク | Warm Sand | `#EDC9AE` | rgba(237, 201, 174, 1) |

---

## 総評

Plan With Laurのウェブサイトは、**「ニュートラルな背景 × 1点のアクセントカラー」** という構成を徹底しています。クリーム色（#F9F4F1）、白色（#FFFFFF）、黒色（#000000）という無彩色系の背景に対して、Burnt Orange（#CA5311）という温かみのある1色がブランドの個性を担っています。

また、本文テキストに純粋な黒ではなく、わずかに緑みを帯びた深い色（#202620）を使用することで、コントラストを抑え、柔らかく洗練された印象を演出しています。フッター領域では、暗い背景に対して淡いラベンダーやサンドカラーを配置することで、情報の優先度を効果的にコントロールしています。

---

![カラーパレット可視化](https://private-us-east-1.manuscdn.com/sessionFile/0MDYqCvAfdwo4nHEgMzggO/sandbox/YawOTXb1BBt3zXLxjiiHvy-images_1776414300071_na1fn_L2hvbWUvdWJ1bnR1L3BsYW53aXRobGF1cl9jb2xvcnM.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvME1EWXFDdkFmZHdvNG5IRWdNemdnTy9zYW5kYm94L1lhd09UWGIxQkJ0M3pYTHhqaWlIdnktaW1hZ2VzXzE3NzY0MTQzMDAwNzFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwzQnNZVzUzYVhSb2JHRjFjbDlqYjJ4dmNuTS5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=My6CMBoBRotgXBF~j79COwdHMVohNRAdmnsxZnQjoGh-lUSgfpr269p2njfIkrxz~SnMtPtFBKG0gW9d1sao2JYlVyR-Jol9r2aJOn~WaxpUnRCLppUEnsWPeNryeo2tPD66X84IMdJWtOGuvFialXcfE4UmiV5sC1yXdbEeKgBg0Lfeh8hNkCuwfsRD0jQmUx0H83cTtWgEwinuG9ALSFXQ03hgPehQjcz-2zr74eNFgOCAyBO6eUKNRaRKy0B37wT-gc9IpE6Ust334ukYldHc6LLeoA70BNGP6LuKNFmpgN1hEZIXrH-J4C8~riYx8PltL7Xv-Fx8FN5EiQMWWQ__)
