import { PRIVACY_DRAFT, type PrivacyDraftField } from "@/lib/legal/privacy-draft";
import { type DisclosureFieldStatus } from "@/lib/legal/tokushoho-draft";

type PrivacySectionId =
  | "basic"
  | "collection-purpose"
  | "external-sharing"
  | "retention-security"
  | "rights-contact"
  | "revision";

export type PrivacyManuscriptSection = {
  id: PrivacySectionId;
  title: string;
  description: string;
  fields: PrivacyDraftField[];
};

export type PrivacyMissingField = {
  id: string;
  label: string;
  status: Exclude<DisclosureFieldStatus, "confirmed">;
  note?: string;
};

/**
 * フェーズ2（原稿設計）で固定する用語。
 */
export const PRIVACY_TERM_GUIDE = {
  pageTitle: "プライバシーポリシー",
  collectionLabel: "取得する情報",
  purposeLabel: "利用目的",
  externalLabel: "利用する外部サービス",
  thirdPartyLabel: "第三者提供",
  retentionLabel: "保有期間・削除",
  rightsLabel: "開示・訂正・利用停止等の請求",
} as const;

const FIELD_MAP = new Map(PRIVACY_DRAFT.fields.map((field) => [field.id, field]));

function getField(fieldId: string): PrivacyDraftField {
  const field = FIELD_MAP.get(fieldId);
  if (!field) {
    throw new Error(`Unknown privacy draft field id: ${fieldId}`);
  }
  return field;
}

function pickFields(fieldIds: readonly string[]): PrivacyDraftField[] {
  return fieldIds.map((id) => getField(id));
}

/**
 * フェーズ2成果物（Privacy）:
 * - 公開ページで使う見出し順
 * - 見出しごとの掲載項目
 */
export const PRIVACY_MANUSCRIPT_SECTIONS: readonly PrivacyManuscriptSection[] = [
  {
    id: "basic",
    title: "基本情報",
    description: "ポリシーの対象事業者と問い合わせ窓口を記載します。",
    fields: pickFields(["operator", "contact-window"]),
  },
  {
    id: "collection-purpose",
    title: "取得情報と利用目的",
    description: "取得する情報の範囲と利用目的を明示します。",
    fields: pickFields(["collected-data", "usage-purpose"]),
  },
  {
    id: "external-sharing",
    title: "外部サービス利用・第三者提供",
    description: "委託先サービスと第三者提供の取り扱いを明示します。",
    fields: pickFields(["external-services", "third-party-provision"]),
  },
  {
    id: "retention-security",
    title: "保有期間・安全管理",
    description: "データの保持方針と安全管理措置を記載します。",
    fields: pickFields(["retention", "security", "cookies-analytics"]),
  },
  {
    id: "rights-contact",
    title: "開示等の請求",
    description: "利用者からの開示・訂正・利用停止等の請求方法を記載します。",
    fields: pickFields(["disclosure-rights"]),
  },
  {
    id: "revision",
    title: "改定情報",
    description: "ポリシー改定時の取り扱いと日付情報を記載します。",
    fields: pickFields(["revision", "effective-date"]),
  },
] as const;

export const PRIVACY_MISSING_FIELDS: readonly PrivacyMissingField[] = PRIVACY_DRAFT.fields
  .filter((field): field is PrivacyDraftField & { status: Exclude<DisclosureFieldStatus, "confirmed"> } => {
    return field.status !== "confirmed";
  })
  .map((field) => ({
    id: field.id,
    label: field.label,
    status: field.status,
    note: field.note,
  }));
