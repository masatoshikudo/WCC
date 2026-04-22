import {
  WCC_PACKAGE_TAX_LUMP_NOTE,
  WCC_PAYMENT_TIMING_NOTE,
  WCC_STANDARD_PACKAGE_DISCLAIMER,
} from "@/lib/plans";
import { type DisclosureFieldStatus } from "@/lib/legal/tokushoho-draft";

export type TermsDraftField = {
  id: string;
  label: string;
  value: string;
  status: DisclosureFieldStatus;
  note?: string;
};

export type TermsDraft = {
  pagePath: string;
  pageTitle: string;
  purpose: string[];
  fields: TermsDraftField[];
};

/**
 * フェーズ1（情報収集）用ドラフト: 利用規約
 * 予約・決済フローの現行実装に基づく事実と、条文化が必要な論点を切り分ける。
 */
export const TERMS_DRAFT: TermsDraft = {
  pagePath: "/legal/terms",
  pageTitle: "利用規約",
  purpose: [
    "サービス提供条件と契約成立時点を明示する",
    "キャンセル・返金・免責等のルールを明示する",
    "紛争発生時の準拠法・管轄を明示する",
  ],
  fields: [
    {
      id: "service-name",
      label: "サービス名",
      value: "Wedding Content Creator（WCC）",
      status: "confirmed",
    },
    {
      id: "provider",
      label: "提供事業者",
      value: "株式会社NaTRIUM",
      status: "confirmed",
    },
    {
      id: "application-method",
      label: "申込方法",
      value: "本サイトの予約フォーム（/book）または問い合わせフォームから申し込むものとします。",
      status: "confirmed",
    },
    {
      id: "contract-formation",
      label: "契約成立時点",
      value:
        "予約フォーム送信後、Stripe の決済ページで所定料金の決済が完了し、当社が受付を確認した時点で契約が成立します。",
      status: "needs_review",
      note: "「決済完了時」か「当社承諾時」かを最終確定",
    },
    {
      id: "price-and-payment",
      label: "料金・支払方法",
      value: `${WCC_PAYMENT_TIMING_NOTE}${WCC_PACKAGE_TAX_LUMP_NOTE}支払方法はクレジットカード決済（Stripe Payment Link）です。`,
      status: "confirmed",
    },
    {
      id: "additional-cost",
      label: "追加費用",
      value: WCC_STANDARD_PACKAGE_DISCLAIMER,
      status: "confirmed",
    },
    {
      id: "service-delivery",
      label: "提供内容・提供時期",
      value:
        "挙式当日に撮影を実施し、ハイライトは当日中〜24時間以内、追加編集は72時間以内を目安に納品します。",
      status: "confirmed",
    },
    {
      id: "cancellation",
      label: "キャンセル・日程変更",
      value:
        "お客様都合によるキャンセル・日程変更は、挙式日の14日前まで無料、13日前〜8日前はご請求額の30%、7日前〜3日前は50%、2日前〜前日は80%、当日は100%のキャンセル料を申し受けます。日程変更は空き状況により1回まで振替対応します。",
      status: "confirmed",
    },
    {
      id: "refund",
      label: "返金",
      value:
        "返金はキャンセル料規定に基づき、返金対象がある場合に限り対応します。返金額は所定のキャンセル料および返金手数料を差し引いた金額とし、返金確定日から10営業日以内を目安に処理します。",
      status: "confirmed",
    },
    {
      id: "prohibited-acts",
      label: "禁止事項",
      value: "未設定",
      status: "needs_input",
      note: "虚偽申告、権利侵害、法令違反、業務妨害等を条文化",
    },
    {
      id: "suspension",
      label: "提供中断・解除",
      value: "未設定",
      status: "needs_input",
      note: "不可抗力・安全確保・法令対応時の提供停止条件を定義",
    },
    {
      id: "liability",
      label: "免責・責任範囲",
      value: "未設定",
      status: "needs_input",
      note: "損害賠償責任の範囲、間接損害除外等を法務確認",
    },
    {
      id: "intellectual-property",
      label: "知的財産権・利用許諾",
      value: "未設定",
      status: "needs_input",
      note: "撮影素材・編集成果物の権利帰属と利用範囲を定義",
    },
    {
      id: "governing-law",
      label: "準拠法・管轄裁判所",
      value: "未設定",
      status: "needs_input",
      note: "例: 日本法準拠 / 東京地裁 or さいたま地裁の専属合意管轄",
    },
    {
      id: "contact",
      label: "連絡先",
      value: "メール: mk@natrium.co.jp / 電話: 08036975639",
      status: "confirmed",
    },
    {
      id: "effective-date",
      label: "制定日・改定日",
      value: "未設定",
      status: "needs_input",
    },
  ],
};
