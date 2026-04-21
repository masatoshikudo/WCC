import { TERMS_DRAFT, type TermsDraftField } from "@/lib/legal/terms-draft";
import { type DisclosureFieldStatus } from "@/lib/legal/tokushoho-draft";

type TermsSectionId =
  | "basic"
  | "application-contract"
  | "price-delivery"
  | "cancellation-refund"
  | "rights-liability"
  | "legal"
  | "revision";

export type TermsManuscriptSection = {
  id: TermsSectionId;
  title: string;
  description: string;
  fields: TermsDraftField[];
};

export type TermsMissingField = {
  id: string;
  label: string;
  status: Exclude<DisclosureFieldStatus, "confirmed">;
  note?: string;
};

/**
 * フェーズ2（原稿設計）で固定する用語。
 */
export const TERMS_TERM_GUIDE = {
  pageTitle: "利用規約",
  contractLabel: "契約成立時点",
  paymentLabel: "料金・支払方法",
  deliveryLabel: "提供内容・提供時期",
  cancellationLabel: "キャンセル・日程変更",
  refundLabel: "返金",
  liabilityLabel: "免責・責任範囲",
  lawLabel: "準拠法・管轄裁判所",
} as const;

const FIELD_MAP = new Map(TERMS_DRAFT.fields.map((field) => [field.id, field]));

function getField(fieldId: string): TermsDraftField {
  const field = FIELD_MAP.get(fieldId);
  if (!field) {
    throw new Error(`Unknown terms draft field id: ${fieldId}`);
  }
  return field;
}

function pickFields(fieldIds: readonly string[]): TermsDraftField[] {
  return fieldIds.map((id) => getField(id));
}

/**
 * フェーズ2成果物（Terms）:
 * - 公開ページで使う見出し順
 * - 見出しごとの掲載項目
 */
export const TERMS_MANUSCRIPT_SECTIONS: readonly TermsManuscriptSection[] = [
  {
    id: "basic",
    title: "基本情報",
    description: "サービス名および提供事業者を記載します。",
    fields: pickFields(["service-name", "provider"]),
  },
  {
    id: "application-contract",
    title: "申込方法・契約成立",
    description: "申込手段と契約成立時点を明示します。",
    fields: pickFields(["application-method", "contract-formation"]),
  },
  {
    id: "price-delivery",
    title: "料金・提供条件",
    description: "支払条件、追加費用、提供時期を明示します。",
    fields: pickFields(["price-and-payment", "additional-cost", "service-delivery"]),
  },
  {
    id: "cancellation-refund",
    title: "キャンセル・返金",
    description: "キャンセル料と返金方針を明示します。",
    fields: pickFields(["cancellation", "refund"]),
  },
  {
    id: "rights-liability",
    title: "禁止事項・責任範囲",
    description: "禁止行為、提供停止、免責、知的財産の取り扱いを記載します。",
    fields: pickFields(["prohibited-acts", "suspension", "liability", "intellectual-property"]),
  },
  {
    id: "legal",
    title: "準拠法・管轄",
    description: "紛争時の準拠法および裁判管轄を記載します。",
    fields: pickFields(["governing-law"]),
  },
  {
    id: "revision",
    title: "連絡先・改定情報",
    description: "問い合わせ先と制定日・改定日を記載します。",
    fields: pickFields(["contact", "effective-date"]),
  },
] as const;

export const TERMS_MISSING_FIELDS: readonly TermsMissingField[] = TERMS_DRAFT.fields
  .filter((field): field is TermsDraftField & { status: Exclude<DisclosureFieldStatus, "confirmed"> } => {
    return field.status !== "confirmed";
  })
  .map((field) => ({
    id: field.id,
    label: field.label,
    status: field.status,
    note: field.note,
  }));
