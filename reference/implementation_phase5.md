# フェーズ5：実装スキャフォールド（完了内容）

`DESIGN.md` の「次のステップ」で別タスクとなっていた **Next.js / Tailwind へのトークン移植とルート骨格**を、**`site/`** ディレクトリに実装した。

**基準日**: 2026-04-17

---

## 1. ディレクトリ

| パス | 内容 |
| :--- | :--- |
| `site/` | Next.js 14（App Router）＋ TypeScript ＋ Tailwind CSS 3 |
| `site/app/globals.css` | `DESIGN.md` フェーズ3 の `:root` CSS 変数 |
| `site/tailwind.config.ts` | 色・角丸・`max-w-content`（1200px）・`font-display` / `font-body` |
| `site/app/layout.tsx` | **Plus Jakarta Sans** ＋ **Noto Sans JP**（`next/font/google`）、`SiteHeader` / `SiteFooter` |
| `site/components/layout/` | 共通ヘッダー（高さ 56px・「予約する」CTA）・フッター（ライト `--color-canvas-subtle`） |
| `site/app/page.tsx` | LP 最小構成（英名 H1 ＋和文サブ・Primary/Secondary CTA・9:16 プレースホルダーグリッド） |
| `site/app/packages` 等 | `/packages`, `/portfolio`, `/contact`, `/book` のプレースホルダーページ |

---

## 2. 次の実装（`reference/STACK.md` との対応）

| STACK Step | 内容 |
| :---: | :--- |
| 1 | ✅ 土台（本フェーズで完了）。コンテンツ・画像の本番投入 |
| 2 | Stripe Payment Links または Checkout を `/book` に接続 |
| 3 | React Hook Form ＋ Zod ＋ Supabase で `/contact` |
| 4 | Resend でメール |
| 5 | Cloudinary / Vercel Blob で 9:16 ポートフォリオ |
| 6 | Stripe Webhook（デポジット・残金） |

---

## 3. ローカル起動

```bash
cd site
npm install
npm run dev
```

ブラウザ: `http://localhost:3000`

---

## 4. 改訂履歴

| 日付 | 内容 |
| :--- | :--- |
| 2026-04-17 | 初版（`site/` スキャフォールド） |
