# For Your Wedding Day (WCC) — 引き継ぎプロンプト v8

> **作成日**: 2026-05-10
> **前回セッション**: 2026-05-09〜10(技術側 22 件 + マーケ設計 4 件 + ブランド整備)
> **ステータス**: MVP 起動可能、技術的に v2 業務フロー全体が動作 + LP/pricing/book の UI 大幅整備完了。マーケティング戦略(Founding Couple スカウト)の素材セットも揃った状態。

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
- 指示書は一発でコピペできる形で渡す
- 確認の往復を最小化する(必要最小限の判断材料だけ揃えて進める)
- **修正と調査を 1 ステップにせず、調査専用タスクで現状把握 → 修正方針確定 → 実装指示書、の順で進める**(v6→v7 で確立)
- **「同じ視覚効果が複数のコンポーネントに散らばってないか」も含めて調査させる**(v7→v8 で得た教訓)
- **Desktop の確認質問は最小限に、Masatoshi が決めたことは即実装に進む**(v7→v8 で Masatoshi から指摘あり)
- **`site/app/` 配下のファイル(特に `icon.png` / `apple-icon.png` 等のファビコン関連)は Masatoshi が手動管理。Claude Code に `images/icon/` などの保管庫から自動コピーする指示を出さない**(v7→v8 で確立、`userMemories` 記載済み)

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

**SNS アカウント**:
- Instagram: https://www.instagram.com/for_your_weddingday/
- Threads: https://www.threads.com/@for_your_weddingday
- TikTok: https://www.tiktok.com/@foryourweddingday(ハンドルのみ区切りなし `foryourweddingday`)

**本番 URL**: `https://for-your-wedding-day.com/`(Vercel デプロイ)

---

## v7→v8 セッション 完了サマリ(2026-05-09〜10)

本セッションは長時間にわたり、技術側 22 件のコミット + マーケ設計 4 件 + ブランド整備が完了した。

### コード・サイト関係(全 22 件、すべてマージ済み)

| # | カテゴリ | 内容 |
|---|---|---|
| 1 | 機能追加 | SNS 導線追加(Instagram + Threads + TikTok アイコン、フッター/ヘッダー) |
| 2 | 機能追加 | Phase D-1: Stripe v2 適合確認 + 顧客決済完了メール実装(`customer-payment-confirmation.ts` 新設、`LINE_INVITE_URL` 環境変数追加) |
| 3 | リファクタ | SNS URL 環境変数化(`NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_THREADS_URL` / `NEXT_PUBLIC_TIKTOK_URL`、未設定時は該当アイコン非表示) |
| 4 | 画像 | apple-icon.png 追加(180×180) |
| 5 | 画像 | favicon.ico 削除(Vercel デフォルト除去、icon.png にフォールバック) |
| 6 | デザイン | ヘッダーテキストロゴ → 画像化、サイズ拡大 |
| 7 | デザイン | 3 バリエーションロゴ実装(`FYWD_logo_PC.png` / `FYWD_logo_SP.png` / `Footer_FYWD_logo.png`)+ レスポンシブ切替(`hidden md:block` パターン) |
| 8 | デザイン | フッターロゴ 1.5 倍拡大 |
| 9 | デザイン | h2 を系統 B(`font-heading` + 0.02em + `clamp(2rem, 4.5vw, 3.5rem)`)に統一(LP トップ 6 箇所) |
| 10 | デザイン | h2 を中央寄せに統一 + Footer CTA テキストを 2 行に改行 |
| 11 | デザイン | sticky 削除(`HomeDoINeedSection` + `HomeWhatIsSection` + `BookFlow.tsx` の 3 箇所) |
| 12 | デザイン | SP 固定 CTA 縮小(78px → 56px、ドック高 170px → 130px) + ボーダー 1px → 2px + ファビコン更新 |
| 13 | デザイン | /pricing ボーダーを 2px に統一(/pricing 独自セクション含む) |
| 14 | デザイン | フッターボーダーを画面全幅に拡張 |
| 15 | デザイン | /pricing ボーダー細部整理(料金プラン下の二重ボーダー解消、ボーダー色を `text-ink` に変更、ServiceFlow ↔ FAQ 間にボーダー追加) |
| 16 | デザイン | ボーダー色 `#000000` → `#2A2624`(温かいチャコール、エディトリアル感重視) |
| 17 | デザイン | /book 二重ボーダー解消 |
| 18 | デザイン | SP 固定 CTA 上端ボーダー太さ統一(`border-t` → `border-t-2`) |
| 19 | デザイン | /pricing Extras / Bespoke ボーダー 2px に統一(取りこぼし修正) |
| 20 | デザイン | 全幅ボーダーを 1.5px に一括統一(`border-t-2` → `border-t-[1.5px]`、Tailwind 任意値構文使用) |
| 21 | デザイン | FAQ 行区切り 1.5px 統一(取りこぼし修正) |
| 22 | デザイン | /pricing 3 セクションを縦中央揃え(`md:items-center`) + Bespoke の CTA ボタン削除 |
| 23 | 運用 | ファビコン手動管理ルール確立(コミット bcee6b9、Masatoshi が望む画像で確定) |
| 24 | デザイン | /pricing Bespoke の価格配置をスタンダードに揃える(価格を右カラム → 左カラムに移動) |

### マーケティング設計(4 件、起草済み・未実行)

戦略の枠組みと素材は揃った。Masatoshi が実行準備をする段階。

| # | 成果物 | 状態 |
|---|---|---|
| M-1 | **モニター記事「Founding Couple」**(約 580 字、DM 添付用、LP 非掲載) | ✅ 起草済み |
| M-2 | **DM 3 ステップ文面**(個別言及型 + テンプレートとカスタマイズガイド) | ✅ 起草済み |
| M-3 | **Instagram 9 本コンテンツ設計**(投稿構成 + ビジュアル方針 + キャプション + ハッシュタグ + 投稿順序) | ✅ 起草済み |
| M-4 | **Instagram プロフィール案 3 パターン**(Bio 思想重心 / 情報重心 / バランス型 + カテゴリ + 連絡先ボタン) | ✅ 起草済み(未確定) |

### ブランド・運用整備

| # | 内容 | 状態 |
|---|---|---|
| B-1 | GitHub `main` ブランチ保護(Branch Rulesets、Active) | ✅ 設定済み |
|   | - Restrict deletions: ON |  |
|   | - Block force pushes: ON |  |
|   | - Require a pull request before merging: ON(approvals = 0) |  |
|   | - Bypass list: 空 |  |

---

## v7→v8 セッションで得られた設計知見

### 1. UI/コピー観点の 5 論点と判断記録

セッション中盤で Claude Code に「5 論点(ファビコン・固定 CTA・「。」・本文・ボーダー)の調査」を依頼。報告から判断:

- **「。」の使用**: ServiceFlow + FAQ で約 20 件、その他もほぼ混在。コピーガイド v4 に方針記載なし → リライトと同時に整理する方針(PR-B として持ち越し)
- **本文リライト**: HomeWhatIs / HomePricing / FooterCta が「!」連発の高温・口語で、エディトリアル路線とズレ。これも PR-B として持ち越し
- **ボーダー**: 1px、`#D5D2C8` → 太さを 2px → 1.5px に変更、色を `#2A2624` に変更
- **SP 固定 CTA**: 高さ 170px から 130px に縮小、補助文 2 行も削除
- **ファビコン**: `images/icon/180w/icon_1.png` で更新

### 2. ボーダー設計の最終形(本セッションで確定)

- **太さ**: **1.5px**(`border-t-[1.5px]` 等の Tailwind 任意値構文)
- **色**: **`#2A2624`**(温かいチャコール、`globals.css` の `--color-border-hairline`)
- **適用範囲**: 全幅セクション境界のみ(コンポーネント内部の区切りは触らない)
- **例外**: フッターのコピーライト分離線も「画面全幅」に揃え済み

### 3. Tailwind の任意値構文を活用する設計判断

Tailwind デフォルトは `border-2` = 2px、`border` = 1px の固定値。1.5px のような中間値が必要なら `border-t-[1.5px]` のように任意値構文を使う。Retina ディスプレイでは綺麗にレンダリングされる(通常解像度では微妙に丸められる可能性あり)。

### 4. Next.js App Router のファイルベース規約と通常画像の使い分け

| ファイル | 置き場所 | 理由 |
|---|---|---|
| `favicon.ico` / `icon.png` / `apple-icon.png` | `site/app/` | Next.js ファイル規約による特殊扱い |
| ロゴ画像、その他通常画像 | `site/public/` | 通常画像配信、`<Image src="/...">` で参照 |

混同するとビルドエラーや意図しないメタタグ生成の原因になる。

### 5. 調査時に「同じ視覚効果が複数コンポーネントに散らばってないか」も確認させる

v7→v8 で得た重要な教訓: 「ウェディング コンテンツ とは」(日本語版)と「Wedding Content Creator?」(英語版)が**異なるコンポーネント**(`HomeWhatIsSection.tsx` と `HomeDoINeedSection.tsx`)に分かれていて、片方の sticky 削除を依頼したつもりが英語版にしか効かなかった事故あり。

調査依頼時には「**同じ視覚効果が複数のコンポーネントに散らばってないか**」を明示的に確認させること。

### 6. h2 スタイル使い分けの構造(v7→v8 セッションで判明)

LP の h2 は当初 3 系統に分散していた:
- 系統 A(`font-display` + 中央 + tight tracking): セクション宣言型
- 系統 B(`font-heading` + 左寄せ + ゆったり tracking): コンテンツ寄り添い型
- 系統 C(`font-display` + 固定サイズ + bold): CTA 専用

→ 本セッションで **全部系統 B に統一**、その後さらに **中央寄せに統一**。最終的にはサイト全体で見出しの視覚スタイルが揃った。

「ロジックより空気感優先」という Masatoshi の方針が本セッションで明示された(技術的役割使い分けより、視覚の一貫性を優先)。

### 7. Stripe 実装は v2 業務フローに最初から整合していた(Phase D-1 の発見)

Phase D-1 調査で判明:
- /book は recordBookingIntent → メール 2 通(運営者通知 + 顧客確認)で完結
- Stripe Checkout 呼び出しはゼロ件、success_page 不在
- 旧フローの残骸はコメントのみ(`success_page 経由のレコードを保護` コメントは本セッションで書き換え済み)

→ Phase D-1 で実装したのは「決済完了後の顧客通知メール送信」のみ。残課題は WCC_ARCHITECTURE.md の旧フロー記述更新(Phase E)。

### 8. 「Founding Couple」スカウト戦略の枠組み

事業として動かしたい焦り(心理的期限)を「動いてる感の KPI」に置き換えるアプローチを採用。

- 期限: 10 日(心理的)→ ブランド初動を作る(具体)
- 価格: 定価近辺維持、無料モニター上限 2 件のみ(実績作り投資)
- ターゲット: 都内、1 ヶ月後挙式
- 方法: スカウト方式(募集ではない、こちらが選ぶ)
- 名称: **Founding Couple**(エディトリアル感、英語併記、特別感)

詳細な戦術設計(モニター記事、DM 文面、Instagram 9 本構成)は本セッションで起草済み。実行は Masatoshi の準備次第。

---

## 確定済み実装基盤(参照用)

### Stripe(v2 適合確認 + 顧客メール実装済み)

実装ファイル:
- `site/lib/stripe/client.ts`(API バージョン: `2026-04-22.dahlia`)
- `site/lib/stripe/handlers/invoice-paid.ts` ← **D-1 で顧客メール送信追加 + コメント整理済み**
- `site/lib/stripe/handlers/quote-accepted.ts`
- `site/lib/stripe/handlers/invoice-payment-failed.ts`
- `site/app/api/stripe/webhook/route.ts`
- `site/app/admin/actions.ts`(`upsertBookingQuoteReferenceAction` で見積もり手動登録)

webhook イベント:
- `quote.accepted` → status=approved
- `invoice.paid` → status=paid + booking_payments upsert + **顧客メール送信(LINE 招待 URL 含む)**
- `invoice.payment_failed` → 運営者通知メール

環境変数: `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`

### Quote → Invoice 発行運用

**Masatoshi が admin 画面(/admin/bookings)で手動発行する運用**:
1. Stripe ダッシュボード側で Invoice を finalize → URL を取得
2. admin 画面の `upsertBookingQuoteReferenceAction` で `stripe_invoice_id` と `payment_url` を入力
3. メールで顧客に payment_url を送付

`invoice.finalized` イベントの自動取得は未実装(手動運用で問題ないため)。

### メール送信(Resend)

- `site/lib/email/booking-notification.ts`(運営者通知 + 支払い失敗通知)
- `site/lib/email/customer-confirmation.ts`(/book フォーム送信時の顧客確認)
- `site/lib/email/customer-payment-confirmation.ts`(D-1 で新設、LINE 招待 URL 含む)
- `site/lib/email/escape-html.ts`
- `site/lib/email/resend.ts`
- パッケージ: `resend@^3.5.0`

環境変数: `RESEND_API_KEY` / `RESEND_FROM` / `OWNER_NOTIFICATION_EMAIL` / **`LINE_INVITE_URL`** / **`NEXT_PUBLIC_INSTAGRAM_URL`** / **`NEXT_PUBLIC_THREADS_URL`** / **`NEXT_PUBLIC_TIKTOK_URL`**

### LINE 連携

- **完全未実装**(ライブラリ・環境変数なし、API 連携なし)
- 友だち追加 URL は `LINE_INVITE_URL` 環境変数として保持(決済完了メールに含めるためのみ使用)
- 当面は手動運用(LINE で打ち合わせ・連絡を継続)で問題なし
- Phase D-3 で「自動化するか手動継続か」の方針決定

### Supabase

- `booking_intents` テーブル: /book フォーム入力(extrasNote 含む)
- `booking_payments` テーブル: 決済完了レコード(現在は webhook 経由のみ)
- `booking_quotes` テーブル: 見積もり管理(admin 画面で手動登録)

環境変数: `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`

### `WCC_EXTRAS` データ構造(`site/lib/plans.ts`)

Phase B-5 で確定。MVP では自動計算しないため Masatoshi の見積もり判断材料として使用。

### ブランド画像アセット

- `site/app/icon.png`(180×180、ファビコン)
- `site/app/apple-icon.png`(180×180、Apple Touch Icon)
- `site/public/FYWD_logo_PC.png`(PC ヘッダー用、横長)
- `site/public/FYWD_logo_SP.png`(SP ヘッダー用、正方形)
- `site/public/Footer_FYWD_logo.png`(フッター用、縦長)
- `site/public/icons/instagram-brands-solid-full.svg`(SNS アイコン)
- `site/public/icons/threads-brands-solid-full.svg`
- `site/public/icons/tiktok-brands-solid-full.svg`

### デザインシステム(本セッションで確定)

- **ボーダー太さ**: 1.5px(`border-t-[1.5px]` 等)
- **ボーダー色**: `#2A2624`(`--color-border-hairline`、温かいチャコール)
- **h2 スタイル**: `font-heading` + 中央寄せ + `clamp(2rem, 4.5vw, 3.5rem)` + `letterSpacing: 0.02em`
- **背景色**: クリーム/オフホワイト系(`bg-canvas`)
- **本文色**: `text-ink`
- **アクセント色**: `bg-accent` + `text-on-accent`(主に CTA ボタン)

---

## 残課題と次フェーズ候補

### PR-B: コピーリライト + 「。」整理(規模: 大、優先度: 高)

**目的**: WCC のブランドトーン(エディトリアル・上品・ミニマル)に沿うコピーへ整理

**判明している問題**:
- `HomeWhatIsSection`: 「全部拾う!」「するから。」など高温・口語が混在
- `HomePricingSection`(LP トップ表示): 「届く!」「すぐ送れる!」など「!」連発
- `FooterCtaSection`: 「ひとつでいい!」「全然大丈夫!」「まずは話そう!」など軽い口語の塊
- ServiceFlow / FAQ で「。」が約 20 件(リライトと同時に整理推奨)

**想定 Step**:
- B-1: コピーガイド v4(`docs/drafts/WCC_COPY_GUIDE.md`)を熟読、温度感の使い分けを再確認
- B-2: 重い順から整理(FooterCta → HomeWhatIs → HomePricing → ServiceFlow / FAQ → 残り)
- B-3: 「!」の使用を最小化、「。」を全削除
- B-4: 「お二人」「ふたり」「2 人」の使い分けを揃える(コピーガイド準拠)

**規模感**: 全セクションの本文を触る大規模変更。1 セッションでは完了しないので、複数 PR に分割が現実的。

### Instagram プロフィール選択(規模: 小、優先度: 中)

v7→v8 で 3 パターンの Bio 案 + カテゴリ + 連絡先ボタンの選択肢を提示済みだが、Masatoshi の選択がペンディング。

選択肢:
- Bio パターン 1(思想重心) / 2(情報重心) / 3(バランス型)
- カテゴリ: Video Creator / Film Production Company / Studio
- 連絡先ボタン: メール+住所 / 住所のみ / なし

選択が決まれば Masatoshi が手動で Instagram アカウントに反映するだけ(コード変更なし)。

### Phase E: ドキュメント整合(規模: 中、優先度: 中)

**目的**: v2 仕様への整合確認、役目を終えたドラフトの整理

**v6→v7 で発見された具体的な不整合(まだ未対応)**:
- `docs/WCC_ARCHITECTURE.md` 4.1 の現行フロー記述が**旧フロー(Stripe Checkout 即決済)のまま**。実装は v2 化済みのためドキュメントが古い
- 4.2 Phase 1 目標フローと 4.1 現行フローが内容的に近づいているため整理が必要

**想定 Step**:
- E-1: `docs/WCC_ARCHITECTURE.md` の 4.1 を v2 業務フローに書き換え、1.(全体構成図)も更新確認
- E-2: `docs/WCC_BRAND.md`(2026-05-06、468 行)の v2 整合確認
- E-3: `docs/drafts/` 棚卸し
  - `LP_CURRENT_STATE.md` / `LP_REDESIGN_PLAN.md`: LP v2 化完了で役目終わり、アーカイブ移動か削除
  - `WCC_BRAND_v2.md`: 統合済み草稿、削除候補
  - `WCC_COPY_GUIDE.md`: 現役、移動の必要なし
  - `wcc_handoff_prompt_v3〜v8.md`: 未追跡ファイル、git 管理方針決定が必要

### Phase D-3: LINE 連携(規模: 中、優先度: 低)

**目的**: 自動化方針決定 → 必要なら実装

- 現状: 手動運用で十分回る
- D-1 で「決済完了メールに LINE 招待 URL 自動付与」までは実装済み → 顧客が決済直後に LINE に登録できる導線は完成
- 自動化のメリット: LINE Messaging API で双方向対話、運営側の管理画面統合
- 自動化のデメリット: API 設定 + ライブラリ導入 + 運用テスト
- **判断保留で問題なし**。事業が回り始めて手動運用の負荷が見えてから判断するのが合理的

### Founding Couple スカウトの実行(規模: 大、優先度: 高、Masatoshi の準備次第)

素材は本セッションで揃った。実行に必要な準備:

1. **Instagram 9 本コンテンツの制作**(撮影 + テキストスライド作成 + 投稿)
2. **Bio 反映**(Masatoshi が選んだ Bio 案を Instagram プロフィールに設定)
3. **スカウトリスト作成**(都内・1 ヶ月後挙式のプレ花嫁を Instagram で 20〜30 組ピックアップ)
4. **DM 送信開始**(1 日 5〜8 件、個別言及で量産感を消す)

これは Masatoshi の作業時間とコンテンツ制作スキル次第。技術側のサポートは少ない。

### 将来検討するために記録(継続)

- **「新郎」「新婦」ラベル**: BookFlow.tsx で固定。同性婚・多様性対応を考えると性別ニュートラルにすべきだが、別途ブランド議論が必要
- **bookerName が常に null**: 実害なし
- **plans.ts の planNote が未使用**: 実害なし

---

## 推奨着手順

1. **PR-B(コピーリライト + 「。」整理)** ← ブランド毀損リスクの解消、優先度高
2. **Instagram プロフィール選択を確定** ← Masatoshi 単独で完了可能、軽い
3. **Phase E(ドキュメント整合)** ← 次セッションでの作業効率向上、引き継ぎ品質保持
4. **Founding Couple 実行** ← Masatoshi の準備次第、技術側サポートは限定的
5. **Phase D-3(LINE 連携)** ← 事業が回り始めて運用負荷が見えてから判断

---

## 次セッション開始時の最初のアクション

引き継ぎプロンプトを Desktop に貼り付けた直後、以下を確認する:

1. **本セッションのマージ済み PR の最終確認**(22 件、上記の表参照)
2. **次フェーズの選択**
   - 推奨: PR-B(コピーリライト)から
   - 別の優先度があれば調整
3. **着手フェーズの事前情報収集**
   - PR-B を選ぶ場合: コピーガイド v4(`docs/drafts/WCC_COPY_GUIDE.md`)全文 + リライト対象セクションの現状コピー
   - Phase E を選ぶ場合: WCC_ARCHITECTURE.md / WCC_BRAND.md / docs/drafts/ ファイル一覧
   - Instagram プロフィール選択を進める場合: 改めてパターン提示

---

## 重要な事業設計判断のリマインダー

### MVP の定義(v5→v6 で確定、v6→v7 で補強、v7→v8 で UI 整備が一段落)

「サービスとして起動可能な最小実装」=「フォーム送信 → Masatoshi が個別見積もり → Stripe 請求 → 決済 → 顧客に決済完了メール(LINE 招待 URL 含む)→ LINE で打ち合わせ → ZOOM → 撮影 → 納品」が手動運用込みで回る状態。

**v6→v7 で技術的完成、v7→v8 で UI/UX 整備が一段落**。残るは PR-B(コピーリライト)とドキュメント整理。

### 「無料」を約束しない原則

業務フロー変更(無料 ZOOM 相談廃止)以降、コピー上での「無料」明示は避ける。/book フォームでの問い合わせ・お見積もりは無償だが、「無料相談」と表現すると旧フローを連想させる。「日程未定の段階からご相談いただけます」のように別の言い方でハードルの低さを表現する。

ただしモニター記事(Founding Couple)は別。「ブランド側で負担します」と書く(「無料」とは書かない)。

### Bespoke の位置付け

Bespoke は「Extras を積み上げた延長線」ではなく、**スタンダードと SNS 運用代行(月額 50 万)の架け橋**。基本構造(4 時間撮影 + クリエイター 1 名)はスタンダードと同じだが、「メニューにないご要望」に応じた個別対応が乗ることで価格差(176,000 → 330,000 円)が生まれる。

### コピー全体の温度設定(コピーガイド v4 準拠)

- LP トップ: 高温・詩的(ヒーロー)/ 高温・解説(What is、Do I need)/ 中温(Pricing、OUR WORK)/ 低温・明快(service-flow、FAQ)
- /pricing: 中温・口語(ヘッダ帯)/ 中温・正確(Pricing)/ 低温(Extras、FAQ、service-flow)/ 中温・解説(Bespoke)
- 業務メール: 中温・業務文(「お二人」、過度な感動演出を避ける)
- 二人称: 詩的 = 「2人」 / 本文 = 「ふたり」 / 業務文 = 「お二人」 / 「あなた」禁止

詳細はコピーガイド v4(`docs/drafts/WCC_COPY_GUIDE.md`)を参照。**PR-B 着手時は必読**。

### 視覚優先のポリシー(v7→v8 で Masatoshi が明示)

「コードの設計理論より、人間の目に届く空気感が優先」。エンジニアリング的に正しい使い分けがあっても、視覚的に揃わない/不自然なら、視覚優先で揃える。本セッションの h2 統一、ボーダー統一、縦中央揃えなどは全てこの方針に沿った判断。

### 調査と修正の分離原則(v6→v7 で確立、v7→v8 で再確認)

不整合の疑いがある場合、修正と調査を 1 ステップにせず:
1. **調査専用タスク**を Claude Code に投げる(Markdown 報告のみ、コード変更ゼロを明示)
2. 報告を受けて Desktop 側で修正方針を確定
3. その後で実装指示書を起草

事業運用への影響が大きい修正(/book フォームの送信先変更、決済フロー変更等)では特に重要。

### 確認質問の最小化(v7→v8 で Masatoshi から指摘)

Masatoshi が決めたことに対して Desktop が再確認を繰り返すと、テンポが落ちる。**Masatoshi の指示が明確な場合は、即実装指示書に進む**。確認は本当に必要なときだけ。

### マーケティング戦略の核(Founding Couple)

- 期限を「動いてる感の KPI」に置き換える
- 「無料モニター」ではなく「ブランドが選ぶ Founding Couple」(構図の逆転)
- 募集ではなく**スカウト**(個別言及型 DM 3 ステップ)
- 上限 2 件の特別枠、定価近辺は維持(値下げしない)
- 撮影日は 1 ヶ月後でも数ヶ月後でも OK、契約締結が「動いてる感」の指標

---

## 過去セッション参照リンク

- 引き継ぎプロンプト v7(2026-05-08 末): `wcc_handoff_prompt_v7.md`
- 引き継ぎプロンプト v6(2026-05-08 中盤): `wcc_handoff_prompt_v6.md`
- 引き継ぎプロンプト v5(2026-05-08 開始時): `wcc_handoff_prompt_v5.md`
- コピーガイド v4 全文: `docs/drafts/WCC_COPY_GUIDE.md`(PR-B 必読)
- WCC_PRODUCT.md v2: `docs/WCC_PRODUCT.md`
- WCC_ARCHITECTURE.md(初版): `docs/WCC_ARCHITECTURE.md`(4.1 旧フロー記述、Phase E で更新予定)
- 各 Phase の判断記録は PR コミットメッセージに記録済み

---

*作成: 2026-05-10(本セッション 22 件マージ完了直後)*
*ステータス: MVP 起動可能 + UI/UX 整備完了 + マーケ戦略素材セット完了。次は PR-B(コピーリライト)が本命。*
