# WCC（Wedding Contents Creator）事業サイト

ウェディング・コンテンツ・クリエイター（WCC）向けの公式サイトおよび関連ドキュメントを管理するリポジトリです。

## リポジトリ構成

| パス | 内容 |
| :--- | :--- |
| `site/` | **Next.js 14（App Router）** の実装。LP・料金・問い合わせ・予約フロー |
| `docs/` | 事業・プロダクト・ブランド・インフラのドキュメント群 |
| `reference/` | 調査・参照資料（DB スキーマ・将来構想 SQL 等） |

ロードマップ（事業フェーズ全体の俯瞰）は `docs/WCC_ROADMAP.md` を参照してください。
開発ルール・AI 協業ルールは `CLAUDE.md` に記載しています。

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

主要パス: `/`（料金は `/#pricing`、ギャラリーは `/#highlights`）· `/contact` · `/book`（旧 `/packages` → `/#pricing`、旧 `/portfolio` → `/#highlights`）

## ビルド・品質

```bash
cd site
npm run build
npm run lint
```

## ライセンス

リポジトリルートの `LICENSE` を参照してください。

## AI エージェント向け

コード変更・提案時の制約とルールは **`CLAUDE.md`** に記載しています。
