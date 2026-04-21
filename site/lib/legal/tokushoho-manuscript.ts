import {
  TOKUSHOHO_DRAFT,
  type DisclosureField,
  type DisclosureFieldStatus,
} from "@/lib/legal/tokushoho-draft";

type ManuscriptSectionId =
  | "seller"
  | "service"
  | "price-payment"
  | "delivery"
  | "cancellation-refund"
  | "notes";

export type TokuShohoManuscriptSection = {
  id: ManuscriptSectionId;
  title: string;
  description: string;
  fields: DisclosureField[];
};

export type TokuShohoMissingField = {
  id: string;
  label: string;
  status: Exclude<DisclosureFieldStatus, "confirmed">;
  note?: string;
};

/**
 * フェーズ2（原稿設計）で固定する用語。
 * ページ本文ではこの表現を正とし、類義語の混在を避ける。
 */
export const TOKUSHOHO_TERM_GUIDE = {
  pageTitle: "特定商取引法に基づく表記",
  serviceLabel: "販売サービス名",
  feeLabel: "商品代金以外の必要料金",
  timingLabel: "役務提供時期",
  cancellationLabel: "キャンセル・変更",
  refundLabel: "返金ポリシー",
  paymentMethodLabel: "支払方法",
  paymentTimingLabel: "支払時期",
} as const;

const FIELD_MAP = new Map(TOKUSHOHO_DRAFT.fields.map((field) => [field.id, field]));

function getField(fieldId: string): DisclosureField {
  const field = FIELD_MAP.get(fieldId);
  if (!field) {
    throw new Error(`Unknown disclosure field id: ${fieldId}`);
  }
  return field;
}

function pickFields(fieldIds: readonly string[]): DisclosureField[] {
  return fieldIds.map((id) => getField(id));
}

/**
 * フェーズ2成果物:
 * - 公開ページで使う見出し順
 * - 各見出しに含める記載項目
 * - 項目ごとの説明文
 */
export const TOKUSHOHO_MANUSCRIPT_SECTIONS: readonly TokuShohoManuscriptSection[] = [
  {
    id: "seller",
    title: "事業者情報",
    description: "販売主体と連絡手段を明示します。",
    fields: pickFields(["seller-name", "operator-name", "location", "phone", "email"]),
  },
  {
    id: "service",
    title: "サービス内容",
    description: "提供するサービスの名称と概要を記載します。",
    fields: pickFields(["service-name", "service-description"]),
  },
  {
    id: "price-payment",
    title: "販売価格・お支払い",
    description: "価格、追加費用、支払方法と支払時期を記載します。",
    fields: pickFields(["price", "additional-fees", "payment-method", "payment-timing"]),
  },
  {
    id: "delivery",
    title: "提供時期",
    description: "役務提供および納品のタイミングを記載します。",
    fields: pickFields(["service-timing"]),
  },
  {
    id: "cancellation-refund",
    title: "キャンセル・返金",
    description: "契約後の変更・キャンセル・返金条件を記載します。",
    fields: pickFields(["cancellation-policy", "refund-policy"]),
  },
  {
    id: "notes",
    title: "その他の注意事項",
    description: "必要に応じて動作環境・販売条件の特記事項を記載します。",
    fields: pickFields(["operating-environment", "special-conditions"]),
  },
] as const;

/**
 * 未確定項目一覧（フェーズ2のレビュー対象）。
 * 後続フェーズで `needs_input` / `needs_review` を 0 件にする。
 */
export const TOKUSHOHO_MISSING_FIELDS: readonly TokuShohoMissingField[] = TOKUSHOHO_DRAFT.fields
  .filter((field): field is DisclosureField & { status: Exclude<DisclosureFieldStatus, "confirmed"> } => {
    return field.status !== "confirmed";
  })
  .map((field) => ({
    id: field.id,
    label: field.label,
    status: field.status,
    note: field.note,
  }));
