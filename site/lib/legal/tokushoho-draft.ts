import { WCC_PLAN_NOTE, WCC_STANDARD_PACKAGE_DISCLAIMER } from "@/lib/plans";

export type DisclosureFieldStatus = "confirmed" | "needs_input" | "needs_review";

export type DisclosureField = {
  id: string;
  label: string;
  value: string;
  status: DisclosureFieldStatus;
  note?: string;
};

export type TokuShohoDraft = {
  pagePath: string;
  pageTitle: string;
  purpose: string[];
  fields: DisclosureField[];
};

/**
 * フェーズ1（記載情報の収集）用ドラフト。
 * - Stripe Commerce Disclosure 観点と特商法ページ観点の必須項目を一元管理する
 * - 未確定情報は `needs_input` として明示し、後続フェーズで確定させる
 */
export const TOKUSHOHO_DRAFT: TokuShohoDraft = {
  pagePath: "/legal/tokushoho",
  pageTitle: "特定商取引法に基づく表記",
  purpose: [
    "Stripe の Commerce Disclosure 要件を満たす",
    "購入前に取引条件を明確にする",
    "問い合わせ前の不明点を減らす",
  ],
  fields: [
    {
      id: "seller-name",
      label: "販売事業者名",
      value: "株式会社NaTRIUM",
      status: "confirmed",
      note: "法人名または屋号を記載",
    },
    {
      id: "operator-name",
      label: "運営統括責任者",
      value: "工藤雅俊",
      status: "confirmed",
    },
    {
      id: "location",
      label: "所在地",
      value: "埼玉県川口市前川2-1-29",
      status: "confirmed",
      note: "番地・建物名まで記載。省略運用を行う場合は条件文面を法務確認",
    },
    {
      id: "phone",
      label: "電話番号",
      value: "08036975639",
      status: "confirmed",
    },
    {
      id: "email",
      label: "メールアドレス",
      value: "mk@natrium.co.jp",
      status: "confirmed",
      note: "問い合わせ用に利用者が連絡できる実在アドレス",
    },
    {
      id: "service-name",
      label: "販売サービス名",
      value: "Wedding Content Creator（WCC）",
      status: "confirmed",
    },
    {
      id: "service-description",
      label: "販売URL / サービス説明",
      value:
        "結婚式当日のスマホ撮影と短尺編集を提供。9:16縦動画を中心に納品し、ハイライトは当日中〜翌日を目安に共有。",
      status: "confirmed",
    },
    {
      id: "price",
      label: "販売価格",
      value: "パッケージプラン 150,000円（税抜）",
      status: "confirmed",
      note: "追加プランを公開する場合は併記",
    },
    {
      id: "additional-fees",
      label: "商品代金以外の必要料金",
      value: WCC_STANDARD_PACKAGE_DISCLAIMER,
      status: "confirmed",
    },
    {
      id: "payment-method",
      label: "支払方法",
      value: "クレジットカード決済（Stripe Payment Link）",
      status: "confirmed",
    },
    {
      id: "payment-timing",
      label: "支払時期",
      value: WCC_PLAN_NOTE,
      status: "confirmed",
    },
    {
      id: "service-timing",
      label: "役務提供時期",
      value:
        "予約確定後、挙式当日に撮影を実施。ハイライトは当日中〜24時間以内、追加編集は72時間以内を目安に納品。",
      status: "confirmed",
      note: "混雑・内容により変動する場合の注記を最終版で明記",
    },
    {
      id: "cancellation-policy",
      label: "キャンセル・変更",
      value:
        "お客様都合によるキャンセル・日程変更は、挙式日の14日前まで無料、13日前〜8日前はご請求額の30%、7日前〜3日前は50%、2日前〜前日は80%、当日は100%のキャンセル料を申し受けます。日程変更は空き状況により1回まで振替対応します。",
      status: "confirmed",
      note: "期限、手数料、日程変更可否、不可抗力時対応を明文化",
    },
    {
      id: "refund-policy",
      label: "返金ポリシー",
      value:
        "決済完了後の返金は、上記キャンセル料規定に基づき、返金対象がある場合に限り対応します。返金額は決済金額から所定のキャンセル料および返金手数料（発生する場合）を差し引いた金額とし、返金方法は原則として決済時と同一手段（Stripe経由）で処理します。返金時期は返金確定日から10営業日以内を目安とします。",
      status: "confirmed",
      note: "返金可否、返金条件、返金方法・時期を明文化",
    },
    {
      id: "operating-environment",
      label: "動作環境・注意事項",
      value: "該当なし",
      status: "confirmed",
      note: "デジタル納品形式、閲覧環境、通信費負担などを必要に応じて記載",
    },
    {
      id: "special-conditions",
      label: "販売条件の特記事項",
      value: "該当なし",
      status: "confirmed",
      note: "対応エリア、提供上限、法的制限がある場合に記載",
    },
  ],
};
