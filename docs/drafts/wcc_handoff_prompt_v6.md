# For Your Wedding Day (WCC) — 引き継ぎプロンプト v6

> **作成日**: 2026-05-08
> **前回セッション**: 2026-05-08(Phase B 完了後の小タスク群 + Phase C' 完了)
> **ステータス**: Phase C'(/book フォーム最適化)完了。MVP として起動可能な状態。

---

## 役割分担(三者)

このプロジェクトは三者役割分担で進行している:

- **Claude Desktop(設計役)**: Masatoshi との対話、設計判断、Claude Code 向け指示書の起草、コピー本体の起草
- **Claude Code(実装役)**: Desktop が起草した指示書に従ったコード実装、コミット作成
- **Masatoshi(判断役)**: 事業判断、ブランチ運用、push、PR 作成、マージ、レビュー

**運用ルール**:
- Claude Code への指示には「コミットする」を含める(`userMemories` 記載)
- push / PR 作成 / マージは Masatoshi が手動で行う
- CLAUDE.md の PR 分割ルール: コード修正とドキュメント追加は別 PR
- **指示書は一発でコピペできる形で渡す**(v5→v6 セッションで確立した運用)
- **確認の往復を最小化する**(必要最小限の判断材料だけ揃えて進める)

---

## プロジェクト概要

**サービス名**: For Your Wedding Day(WCC = Wedding Contents Creator)

**ポジション**: 株式会社 NaTRIUM(Masatoshi の一人会社)の事業ライン。SNS 運用代行(月額 50 万、本命事業)の前段「お試し撮影」の実績作りとして機能する。

**スタンダードプラン仕様(確定済み)**:
- 価格: **176,000 円(税込)**
- 撮影時間: **4 時間連続**
- スタッフ: 1 名
- 機材: iPhone または DJI Osmo Pocket
- 納品: **24 時間以内**、9:16 縦動画 2 本 + 全素材

**Extras 5 項目**:
1. 撮影時間延長 +33,000 円 / 1 時間
2. 追加編集動画 +33,000 円 / 1 本
3. WCC スタッフ追加 +132,000 円 / 1 名(時間内固定)
4. 機材貸出(DJI Osmo Pocket)+38,500 円 / 1 台、最大 2 台
5. 遠方出張費 実費 + 11,000 円

**Bespoke**: 330,000 円(税込)〜
- 共通項: 基本 4 時間撮影 + クリエイター 1 名(スタンダードと同じ)
- 可変部分: メニューにないご要望に応じた個別対応

**業務フロー(v2)**:
/book フォーム → メールで見積もり → Stripe 請求書 URL → 決済 → 公式 LINE → ZOOM 詳細打ち合わせ → 撮影当日 → 24 時間以内納品

**MVP 設計判断(v5→v6 セッションで確定)**:
- **/book フォームに自動計算機能は実装しない**。価格は Masatoshi が個別見積もりで決定する v2 業務フロー前提
- **Extras 選択 UI も実装しない**。「ご希望の追加オプション・撮影体制」自由記述欄でヒアリング
- 接客機会の確保(撮影時間延長を相談されたら式進行を聞いてベストな時間配分を一緒に考える等)を優先

---

## v5→v6 セッション 完了サマリ(2026-05-08)

### 事前確認 + 修正

| 項目 | 内容 | 状態 |
|---|---|---|
| WCC_PRODUCT.md v2 配置確認 | docs/WCC_PRODUCT.md に存在、v2 仕様反映済み確認 | ✅ |
| WCC_PRODUCT.md Bespoke 価格修正 | 220,000 → 330,000 円(4 箇所) | ✅ マージ済み |

### 小タスク群(Phase B → Phase C' の橋渡し)

| Step | 内容 | 状態 |
|---|---|---|
| **S-1** | /packages 削除 + 301 リダイレクト + docs 整合 | ✅ マージ済み(`chore/remove-packages-page`) |
| **S-2** | tokushoho-draft.ts 所在確認 | ✅ 問題なし(site/lib/legal/ 配下に正常配置、B-0 修正反映済み) |

### Phase C'(/book フォーム MVP 化)

| Step | 内容 | 状態 |
|---|---|---|
| **C'-1** | BookFlow.tsx: Step 3 下部「48時間」→「24時間」修正、任意項目に extrasNote 自由記述欄追加、Server Action 呼び出しに反映 | ✅ マージ済み |
| **C'-2** | Server Action(booking.ts)に extrasNote 反映、運営者通知メールに「ご希望の追加オプション」セクション追加、顧客確認メールに入力内容サマリ追記 | ✅ マージ済み |

---

## v5→v6 セッションで得られた設計知見

### 1. /book フォームの設計方針

**ヒアリング項目構成**(C'-1 完了時点):
- 必須: 新郎・新婦氏名、メール、電話、挙式日、式場、エリア、開始時刻、撮影範囲(ceremony_only / ceremony_reception / through_afterparty)
- 任意: タイムライン、撮ってほしいシーン、**ご希望の追加オプション・撮影体制(extrasNote)**、使用予定媒体、参考動画 URL、会場側の撮影制限

**extrasNote の設計**:
- 自由記述欄(rows: 3)
- プレースホルダ: 「例: 撮影時間の延長、追加スタッフ、機材貸出、遠方からの出張など。ご希望があればご記入ください。詳細はお見積もりにてご提案します。」
- Server Action → DB 保存 → 運営者通知メールに転記
- 配置: 「撮ってほしいシーン」の直後

### 2. メール文面の設計方針

**運営者通知メール**(`booking-notification.ts`):
- 任意項目セクションは「内容があれば表示、空なら出さない」条件付きレンダリング
- 「ご希望の追加オプション」セクションは「撮ってほしいシーン」直後に配置(BookFlow と並び一致)

**顧客確認メール**(`customer-confirmation.ts`):
- 「お預かりした内容」セクション追加(C'-2 で実装)
- 必須項目(挙式日・会場・撮影範囲・連絡先)は値を表示
- 任意項目は「記載あり」のみ表示(全文転記しない、可読性優先)
- 使用予定媒体は媒体名を表示(短い識別子のため)
- 参考動画 URL は件数のみ表示

### 3. /packages 整理の経緯

- 旧 LP の 6 時間スタンダード時代に作られた独立ページ
- v2 移行時点で /pricing に統合済み、docs では「リダイレクト済み」記述だったが実態は実コンテンツ残存
- 削除 + 301 リダイレクトで実態を docs に合わせた
- リダイレクト先は `/pricing`(ハッシュなし、現在の単一ソースが /pricing ページ全体のため)

### 4. tokushoho-draft.ts の所在

- 当初 `site/lib/` 直下を探して見つからない懸念があったが、`site/lib/legal/` 配下に正しく配置されている
- 法務ファイル群(tokushoho / privacy / terms × draft / manuscript / page-spec / verification)は `site/lib/legal/` 配下に階層化済み
- 特商法ページの価格表記は「160,000円(税抜)」で、LP の「176,000円(税込)」と表記が異なるが、これは法令上の慣習による意図的な仕様

---

## 確定済み実装基盤(Phase D 以降の参照用)

### Stripe(既に実装済み)

調査済みファイル:
- `site/lib/stripe/client.ts`
- `site/lib/stripe/handlers/invoice-paid.ts`
- `site/lib/stripe/handlers/quote-accepted.ts`
- `site/lib/stripe/handlers/invoice-payment-failed.ts`
- `site/app/api/stripe/webhook/route.ts`
- `site/app/admin/actions.ts`(stripe 参照あり)

環境変数: `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`

**Phase D-1 の主タスク**: 既存実装が v2 業務フロー(個別見積もり → Stripe 請求書 URL 送付 → 決済)に整合しているかの**確認**。実装ではなく適合性検証が中心。

### メール送信(Resend)

- `site/lib/email/booking-notification.ts`(運営者通知)
- `site/lib/email/customer-confirmation.ts`(顧客確認)
- パッケージ: `resend@^3.5.0`
- 環境変数: `RESEND_API_KEY` / `RESEND_FROM` / `OWNER_NOTIFICATION_EMAIL`

### LINE 連携

- **完全未実装**(ライブラリ・環境変数なし)
- 当面は手動運用(URL を見積もりメールに添付)で問題なし
- Phase D-3 で「自動化するか手動継続か」の方針決定

### Supabase

- `booking_intents` テーブルに /book フォーム入力を保存
- C'-2 で extrasNote カラム追加(または既存カラムに統合)済み
- 環境変数: `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`

### `WCC_EXTRAS` データ構造(`site/lib/plans.ts`、Phase B-5 で確定)

```typescript
export const WCC_EXTRAS = [
  {
    id: 'extension',
    name: '撮影時間延長',
    priceYen: 33000,
    unit: 'time',
    note: '※2 名体制時は +25% 加算',
    description: '標準 4 時間に追加',
    maxQuantity: null,
  },
  // ... 他 4 項目
] as const;
```

`formatExtraPrice()` ヘルパーで unit ごとに表示文字列を生成(time / video / person / unit / flat)。`never` 型による網羅性チェック付き。

スタッフ追加時の延長料金:
- 1 名体制延長: 33,000 円/h
- 2 名体制延長: 41,250 円/h(+25%)
- 3 名体制延長: 49,500 円/h(+50%)

→ MVP では自動計算しないため、Masatoshi の見積もり判断材料として記録。将来 Phase C(本格版・自動計算実装)を行う場合に使用。

---

## 残課題と次フェーズ候補

### Phase D-1: 既存 Stripe フローの v2 適合確認(規模: 小〜中、優先度: 高)

**目的**: 既存 Stripe 実装が v2 業務フローに整合しているか検証、不整合があれば修正

**想定 Step**:
- D-1-1: Stripe ファイル群の現状調査(各ファイル全文 + ドキュメント整合)
- D-1-2: v2 フロー(個別見積もり → 請求書 URL 送付 → 決済 → webhook → メール)の動作経路確認
- D-1-3: 不整合があれば修正

**価値**: サービス起動の最後の確認。完了すれば「LINE 自動化以外は完成」状態。

### Phase E: ドキュメント整合(規模: 中、優先度: 中)

**目的**: v2 仕様への整合確認、役目を終えたドラフトの整理

**想定 Step**:
- E-1: WCC_BRAND.md(2026-05-06、468 行)の v2 整合確認
- E-2: `docs/drafts/` 棚卸し
  - `LP_CURRENT_STATE.md`(500 行、2026-05-06): LP v2 化完了で役目終わり、アーカイブ移動か削除
  - `LP_REDESIGN_PLAN.md`(518 行、2026-05-06): 同上
  - `WCC_BRAND_v2.md`(431 行、2026-05-05): docs/WCC_BRAND.md に統合済みの草稿、削除候補
  - `WCC_COPY_GUIDE.md`(803 行、v4): 現役、移動の必要なし
  - `wcc_handoff_prompt_v3〜v6.md`: 未追跡ファイル、git 管理方針決定が必要
- E-3: WCC_ARCHITECTURE.md の最新化(/packages 削除済みは S-1 で更新済み、他に古い記述があれば修正)

### Phase D-3: LINE 連携(規模: 中、優先度: 低)

**目的**: 自動化方針決定 → 必要なら実装

- 現状: 手動運用(LINE 招待 URL を Masatoshi が見積もりメールに添付)で十分回る
- 自動化のメリット: 決済完了 webhook → 公式 LINE 招待自動送信
- 自動化のデメリット: LINE Messaging API 設定 + ライブラリ導入 + テスト
- **判断保留**で問題なし。事業が回り始めて手動運用の負荷が見えてから判断するのが合理的

### 次セッションで「触らない」と決めた論点

将来検討するために記録(Phase C' で発見されたが意図的に対応外):

- **「新郎」「新婦」ラベル**: BookFlow.tsx で固定。WCC のブランドポジション(同性婚・多様性対応)を考えると性別ニュートラルにすべきだが、別途ブランド議論が必要なため Phase C' のスコープ外
- **bookerName が常に null**: Server Action の型に存在するが UI に欄なし、coupleName から間接的に取得可能。実害なし
- **plans.ts の planNote(決済・ZOOM 説明文)が未使用**: BookFlow で参照していない。C'-2 顧客確認メール改善で代替効果あり、現状実害なし

---

## 推奨着手順

1. **Phase D-1(Stripe v2 適合確認)** ← サービス完全起動への最後の確認
2. **Phase E(ドキュメント整合)** ← 次セッションでの作業効率向上、引き継ぎ品質保持
3. **Phase D-3(LINE 連携)** ← 事業が回り始めて運用負荷が見えてから判断

---

## 次セッション開始時の最初のアクション

引き継ぎプロンプトを Desktop に貼り付けた直後、以下を確認する:

1. **本セッションのマージ済み PR の最終確認**
   - WCC_PRODUCT.md Bespoke 価格修正
   - /packages 削除 + リダイレクト
   - Phase C'-1 BookFlow 修正
   - Phase C'-2 Server Action + メール文面整合

2. **次フェーズの選択**
   - 推奨: Phase D-1(Stripe v2 適合確認)から
   - 別の優先度があれば調整

3. **着手フェーズの事前情報収集**
   - Phase D-1 を選ぶ場合: Stripe 関連ファイル群の現状調査(client / handlers / webhook / admin actions)
   - Phase E を選ぶ場合: WCC_BRAND.md 全文 + docs/drafts/ 配下のファイル一覧

---

## 重要な事業設計判断のリマインダー

### MVP の定義(v5→v6 で確定)

「サービスとして起動可能な最小実装」=「フォーム送信 → Masatoshi が個別見積もり → Stripe 請求 → 決済 → LINE(手動)→ ZOOM → 撮影 → 納品」が手動運用込みで回る状態。

Phase C'(/book フォーム MVP 化)完了時点で、上記フローは**ほぼ起動可能**。残るは Phase D-1(Stripe 適合確認)のみ。

### 「無料」を約束しない原則

業務フロー変更(無料 ZOOM 相談廃止)以降、コピー上での「無料」明示は避ける。/book フォームでの問い合わせ・お見積もりは無償だが、これを「無料相談」と表現すると旧フローを連想させる。「日程未定の段階からご相談いただけます」のように別の言い方でハードルの低さを表現する。

### Bespoke の位置付け

Bespoke は「Extras を積み上げた延長線」ではなく、**スタンダードと SNS 運用代行(月額 50 万)の架け橋**。基本構造(4 時間撮影 + クリエイター 1 名)はスタンダードと同じだが、「メニューにないご要望」に応じた個別対応が乗ることで価格差(176,000 → 330,000 円)が生まれる。

「初期設計」という業務専門用語は表に出さない方針(コピーガイド v4 セクション 14.1 参照)。

### コピー全体の温度設定

- LP トップ: 高温・詩的(ヒーロー)/ 高温・解説(What is、Do I need)/ 中温(Pricing、OUR WORK)/ 低温・明快(service-flow、FAQ)
- /pricing: 中温・口語(ヘッダ帯)/ 中温・正確(Pricing)/ 低温(Extras、FAQ、service-flow)/ 中温・解説(Bespoke)
- 二人称: 詩的 = 「2人」 / 本文 = 「ふたり」 / 業務文 = 「お二人」 / 「あなた」禁止

詳細はコピーガイド v4(`docs/drafts/WCC_COPY_GUIDE.md`)を参照。

---

## 過去セッション参照リンク

- 引き継ぎプロンプト v5(2026-05-08 セッション開始時): リポジトリ過去版または `wcc_handoff_prompt_v5.md`
- コピーガイド v4 全文: `docs/drafts/WCC_COPY_GUIDE.md`
- WCC_PRODUCT.md v2: `docs/WCC_PRODUCT.md`(2026-05-08 Bespoke 価格更新版)
- 各 Phase の判断記録は PR コミットメッセージに記録済み

---

*作成: 2026-05-08(Phase C' 完了直後)*
*ステータス: MVP 起動可能、Phase D-1(Stripe v2 適合確認)が次の本命*
