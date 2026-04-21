import { PRIVACY_DRAFT } from "@/lib/legal/privacy-draft";
import { PRIVACY_MISSING_FIELDS } from "@/lib/legal/privacy-manuscript";
import { LEGAL_PAGE_HREF } from "@/lib/site-links";

export type PrivacyChecklistStatus = "ok" | "ng";

export type PrivacyChecklistItem = {
  id: string;
  label: string;
  status: PrivacyChecklistStatus;
  detail: string;
};

const REQUIRED_FIELD_IDS = [
  "operator",
  "contact-window",
  "collected-data",
  "usage-purpose",
  "external-services",
  "third-party-provision",
] as const;

function hasRequiredField(fieldId: string): boolean {
  return PRIVACY_DRAFT.fields.some((field) => field.id === fieldId);
}

function getFieldValue(fieldId: string): string {
  return PRIVACY_DRAFT.fields.find((field) => field.id === fieldId)?.value ?? "";
}

export const PRIVACY_VERIFICATION_CHECKLIST: readonly PrivacyChecklistItem[] = [
  {
    id: "page-path",
    label: "ページURLの整合",
    status: PRIVACY_DRAFT.pagePath === LEGAL_PAGE_HREF.privacy ? "ok" : "ng",
    detail: `${PRIVACY_DRAFT.pagePath} / ${LEGAL_PAGE_HREF.privacy}`,
  },
  {
    id: "required-fields",
    label: "必須掲載項目の定義",
    status: REQUIRED_FIELD_IDS.every((fieldId) => hasRequiredField(fieldId)) ? "ok" : "ng",
    detail: `必須項目 ${REQUIRED_FIELD_IDS.length}件の定義有無を確認`,
  },
  {
    id: "pending-fields",
    label: "未確定項目の有無",
    status: PRIVACY_MISSING_FIELDS.length === 0 ? "ok" : "ng",
    detail: `未確定 ${PRIVACY_MISSING_FIELDS.length}件（0件で公開推奨）`,
  },
  {
    id: "external-services",
    label: "外部サービスの明記",
    status:
      getFieldValue("external-services").includes("Supabase") &&
      getFieldValue("external-services").includes("Resend") &&
      getFieldValue("external-services").includes("Stripe")
        ? "ok"
        : "ng",
    detail: getFieldValue("external-services") || "未記載",
  },
  {
    id: "contact-window",
    label: "問い合わせ窓口の明記",
    status: getFieldValue("contact-window") !== "未設定" ? "ok" : "ng",
    detail: getFieldValue("contact-window") || "未記載",
  },
];

export const PRIVACY_PUBLICATION_STATUS = {
  ready: PRIVACY_VERIFICATION_CHECKLIST.every((item) => item.status === "ok"),
  passedCount: PRIVACY_VERIFICATION_CHECKLIST.filter((item) => item.status === "ok").length,
  totalCount: PRIVACY_VERIFICATION_CHECKLIST.length,
} as const;
