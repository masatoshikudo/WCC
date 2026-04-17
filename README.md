# WCC（Wedding Contents Creator）事業サイト

ウェディング・コンテンツ・クリエイター（WCC）向けの公式サイトおよび関連ドキュメントを管理するリポジトリです。

## リポジトリ構成

| パス | 内容 |
| :--- | :--- |
| `site/` | **Next.js 14（App Router）** の実装。LP・料金・ポートフォリオ・問い合わせ・予約フロー |
| `DESIGN.md` | デザインシステム（トークン・コンポーネント規約） |
| `STACK.md` | 技術スタック・アーキテクチャ（Vercel / Supabase / Stripe 等の想定） |
| `VOICE.md` | トーン・表記の指針 |
| `reference/` | 調査・実装フェーズの参照資料 |
| `images/` | ルート用アセット（バックアップ SVG 等） |

詳細なルーティングやファイル配置は `site/README.md` および `reference/implementation_phase5.md` を参照してください。

## 前提条件

- [Node.js](https://nodejs.org/)（LTS 推奨）
- npm（`site/package-lock.json` に準拠）

## 開発サーバー

```bash
cd site
npm install
npm run dev
```

ブラウザ: [http://localhost:3000](http://localhost:3000)

主要パス: `/` · `/packages` · `/portfolio` · `/contact` · `/book`

## ビルド・品質

```bash
cd site
npm run build
npm run lint
```

## ライセンス

リポジトリルートの `LICENSE` を参照してください。

## AI エージェント向け

コード変更・提案時の制約とルールは **`AGENTS.md`** に記載しています。
