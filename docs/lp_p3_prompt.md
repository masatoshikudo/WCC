# タスク: LP P3 ブランド見直し実装（WCC_BRAND_v2.md 確定版反映）

`docs/drafts/WCC_BRAND_v2.md` の議論したい論点5点について人間判断が確定したため、実装に着手します。

---

## 確定した方針（人間判断結果）

| 論点 | 確定した方針 |
|---|---|
| 論点1: カラーパレット | **案A（最小修正）を M1 で実施**。案C（くすみベージュ）への大改訂は M2 以降 |
| 論点2: ロゴ表示形式 | **案A（フル一行）**: 「For Your Wedding Day」を Cormorant Garamond で1行表示 |
| 論点3: ヒーローコピー | **案A（翌朝軸）**: 「翌朝、ふたりで観る、昨日のすべて。」 |
| 論点4: 「感動を」表現 | **案Aへの完全置き換え**（現状の「挙式の感動を、」は廃止） |
| 論点5: カラー大改訂タイミング | **M1 では案A 最小修正のみ**。案Cは M2 以降、実顧客の作例写真と合わせて検討 |

---

## やってほしいこと（このタスクのスコープ）

### 1. WCC_BRAND.md を v2 確定版で上書き更新

- `docs/drafts/WCC_BRAND_v2.md` の確定版（下記参照）を `docs/WCC_BRAND.md` に反映
- 「議論したい論点」セクションは確定後の方針に書き換え（決定の歴史として残す）
- v2 ドラフトは削除せず保持（判断の歴史としてリポジトリに残す）

### 2. カラーパレット最小修正（案A）

`site/app/globals.css` で以下のCSS変数を修正:

| 変数 | 既存値 | 新値 | 備考 |
|---|---|---|---|
| `--color-accent-hover` | `#0f766e` | `#b84a0f` | Plan With Laur 取り違えの修正、accent と整合 |
| `--color-ink-muted` | `#202620` | `#525252` | BRAND.md 既存記載と整合 |

注: それ以外のカラーは変更しない。

### 3. ヘッダーロゴ修正（案A: フル英字横一行）

現状ヘッダーで「WCC」と表示されている箇所を「For Your Wedding Day」に変更。

**仕様:**
- 表記: `For Your Wedding Day`（各単語頭文字大文字、半角スペース区切り）
- フォント: `Cormorant Garamond`（既存セリフ体を活用）
- ウェイト: 500〜600 を試す（実装時にデザインバランスで決定）
- スタイル例:
  - PC: `font-size: 20px; letter-spacing: 0.04em;`
  - SP: `font-size: 14px; letter-spacing: 0.02em;`（375px幅で折り返さないか実装後に確認）
- リンク先: 既存「WCC」のリンクと同じ（トップページ `/`）

**重要な検証ポイント:**
- SP（375px幅）で「For Your Wedding Day」20文字が折り返さないこと
- ナビメニュー（料金 / ギャラリー等）と視覚的に競合しないこと
- ヘッダー高さ（`h-20` SP / `h-24` PC）に収まること

### 4. ヒーローコピー修正（案A: 翌朝軸）

`site/app/page.tsx` のヒーローセクションで以下を反映:

**H1（変更前 → 変更後）:**
```
変更前: 挙式の感動を、
変更後: 翌朝、ふたりで観る、
        昨日のすべて。
```

- 改行は `<br />` または HTML レンダリング上の自然な折り返し

**サブコピー（変更前 → 変更後）:**

変更前は現状の page.tsx を確認して該当行を特定。

```
変更後:
結婚式の翌朝、コーヒーを淹れて。
その日のうちに届く、ふたりだけの縦動画。
```

**重要:** 「感動」という単語は完全に廃止。

### 5. WCC_ROADMAP.md / CLAUDE.md の更新

- `WCC_ROADMAP.md`: M1 の LP P3 を「✅ 完了」マークに更新
- `CLAUDE.md` セクション7: LP P3 進行中の注記を「完了（コミットハッシュ）」に更新

### 6. Git コミット

複数コミットに分けて実施（変更内容を後から追跡しやすくするため）:

**コミット1: WCC_BRAND.md を v2 確定版で更新**
```
docs: WCC_BRAND.md を v2 確定版で更新

5つの論点について人間判断が確定したため、改訂版（drafts/WCC_BRAND_v2.md）を
正式版に反映。

確定方針:
- カラー: 案A（最小修正、accent-hover と ink-muted の整合のみ）
- ロゴ: 案A（フル一行「For Your Wedding Day」）
- ヒーローコピー: 案A（翌朝軸「翌朝、ふたりで観る、昨日のすべて。」）
- 「感動」表現は廃止
- カラー大改訂は M2 以降、実作例写真とハーモナイズして決定

LP P3 実装は別コミットで実施。

Refs: docs/drafts/WCC_BRAND_v2.md
```

**コミット2: LP P3 実装（カラー・ロゴ・コピー）**
```
feat(lp): LP P3 ブランド見直し実装（WCC_BRAND.md 準拠）

WCC_BRAND.md 確定版を反映:
- カラー: --color-accent-hover を #b84a0f に統一（Plan With Laur 取り違え修正）
- カラー: --color-ink-muted を #525252 に統一
- ヘッダーロゴ: 「WCC」→「For Your Wedding Day」（Cormorant Garamond）
- ヒーローコピー: 「翌朝、ふたりで観る、昨日のすべて。」（翌朝軸）
- サブコピー: 「結婚式の翌朝、コーヒーを淹れて。その日のうちに届く、ふたりだけの縦動画。」

確認事項:
- SP (375px) でヘッダーロゴが折り返さないこと
- LP がローカルでビルド成功すること

Refs: docs/WCC_BRAND.md, docs/WCC_ROADMAP.md
```

**コミット3: ROADMAP / CLAUDE.md 完了マーク**
```
docs: LP P3 完了マーク（WCC_ROADMAP.md / CLAUDE.md）

LP P3 ブランド見直しの完了を反映。
```

---

## 実装フロー（Pre-Implementation Research Pattern）

実装前に以下を確認してください:

### A. 現状確認

```bash
# ヒーローコピーの現状を確認
grep -n "挙式の感動" site/app/page.tsx
grep -n "WCC" site/app/page.tsx site/components/**/*.tsx | head -20

# ヘッダーロゴの現状実装場所を確認
grep -rn "WCC" site/components/ | head -20
ls site/components/ | head
```

### B. CSS変数の現状確認

```bash
grep -n "color-accent-hover\|color-ink-muted" site/app/globals.css
grep -n "color-accent\|color-ink" site/tailwind.config.ts
```

### C. Cormorant Garamond の既存利用箇所を確認

```bash
grep -rn "Cormorant" site/app/ site/components/ | head
```

### D. ヒーローセクションのレイアウト確認

`site/app/page.tsx` のヒーロー部分のJSX構造を確認し、改行の入れ方（`<br />` または HTML自動折り返し）を判断。

---

## 留意点・PR の観点

### 完了の定義

- [ ] WCC_BRAND.md が v2 確定版で更新されている
- [ ] CSS変数の修正が反映されている
- [ ] ヘッダーロゴが「For Your Wedding Day」になっている
- [ ] ヒーローコピーが翌朝軸に置き換わっている
- [ ] 「感動」という単語が page.tsx から消えている（page.tsx 内の他箇所もチェック）
- [ ] SP（375px）でヘッダーロゴが折り返さない
- [ ] ローカルで `npm run build` が成功する
- [ ] WCC_ROADMAP.md / CLAUDE.md に完了マークがついている

### PR フロー

- ブランチ名: `feat/lp-p3-brand-revision`
- main直push禁止、feature ブランチ → PR → マージ
- PR 説明には WCC_BRAND_v2.md の論点1〜5の確定方針を記載

### 「感動」の網羅チェック

`page.tsx` 以外の箇所にも「感動」表現が残っている可能性があります:
```bash
grep -rn "感動" site/app/ site/components/
```
ヒットした場合、文脈を確認して必要に応じて削除/置換。
ただし `WCC_BRAND.md` の禁句リスト記載や、コミットメッセージ等の歴史的記録は残してOK。

---

## 報告フォーマット

```markdown
## LP P3 ブランド見直し実装レポート

### 1. 事前確認の結果
- ヒーローコピーの現状箇所: ...
- ヘッダーロゴの現状実装箇所: ...
- CSS変数の現状値: ...

### 2. WCC_BRAND.md 更新
- 上書き内容: ...
- v2 ドラフト保持: ✅

### 3. CSS変数修正
- accent-hover: #0f766e → #b84a0f
- ink-muted: #202620 → #525252

### 4. ヘッダーロゴ修正
- 修正ファイル: ...
- フォント・サイズ: ...
- SP表示確認結果: ...

### 5. ヒーローコピー修正
- H1変更: ...
- サブコピー変更: ...
- 「感動」網羅チェック結果: ...

### 6. 完了マーク
- WCC_ROADMAP.md: ✅
- CLAUDE.md: ✅

### 7. ビルド確認
- npm run build: ✅
- ローカル確認: ✅

### 8. コミット
- コミット1（BRAND.md）: ハッシュ
- コミット2（実装）: ハッシュ
- コミット3（完了マーク）: ハッシュ

### 9. PR
- PR URL: ...

### 10. 議論したい論点（あれば）
- 論点A: ...
```

---

## 重要な注意

- **WCC_BRAND_v2.md（ドラフト）は削除しない**: 判断の歴史として残す
- **「感動」表現は完全廃止**: page.tsx 全体で検索して取り残しがないか確認
- **SP表示の確認は必須**: ヘッダーロゴの折り返し確認はリリース前に必ず実機 or DevTools で確認
- **カラー大改訂は今回はやらない**: 案C（くすみベージュ全面塗り替え）は M2 以降
- 質問や判断に迷う点があれば実装前に確認してください
