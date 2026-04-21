import { TOKUSHOHO_DRAFT } from "@/lib/legal/tokushoho-draft";
import { TERMS_DRAFT } from "@/lib/legal/terms-draft";
import { TERMS_MISSING_FIELDS } from "@/lib/legal/terms-manuscript";
import { LEGAL_PAGE_HREF } from "@/lib/site-links";

export type TermsChecklistStatus = "ok" | "ng";

export type TermsChecklistItem = {
  id: string;
  label: string;
  status: TermsChecklistStatus;
  detail: string;
};

const REQUIRED_FIELD_IDS = [
  "service-name",
  "provider",
  "application-method",
  "contract-formation",
  "price-and-payment",
  "service-delivery",
  "cancellation",
  "refund",
  "governing-law",
] as const;

function hasRequiredField(fieldId: string): boolean {
  return TERMS_DRAFT.fields.some((field) => field.id === fieldId);
}

function getTermsFieldValue(fieldId: string): string {
  return TERMS_DRAFT.fields.find((field) => field.id === fieldId)?.value ?? "";
}

function getTokuShohoFieldValue(fieldId: string): string {
  return TOKUSHOHO_DRAFT.fields.find((field) => field.id === fieldId)?.value ?? "";
}

export const TERMS_VERIFICATION_CHECKLIST: readonly TermsChecklistItem[] = [
  {
    id: "page-path",
    label: "ページURLの整合",
    status: TERMS_DRAFT.pagePath === LEGAL_PAGE_HREF.terms ? "ok" : "ng",
    detail: `${TERMS_DRAFT.pagePath} / ${LEGAL_PAGE_HREF.terms}`,
  },
  {
    id: "required-fields",
    label: "必須条項の定義",
    status: REQUIRED_FIELD_IDS.every((fieldId) => hasRequiredField(fieldId)) ? "ok" : "ng",
    detail: `必須項目 ${REQUIRED_FIELD_IDS.length}件の定義有無を確認`,
  },
  {
    id: "pending-fields",
    label: "未確定項目の有無",
    status: TERMS_MISSING_FIELDS.length === 0 ? "ok" : "ng",
    detail: `未確定 ${TERMS_MISSING_FIELDS.length}件（0件で公開推奨）`,
  },
  {
    id: "cancellation-refund",
    label: "キャンセル・返金条項の明記",
    status:
      getTermsFieldValue("cancellation") !== "未設定" && getTermsFieldValue("refund") !== "未設定"
        ? "ok"
        : "ng",
    detail: "未設定のままでは公開不可",
  },
  {
    id: "consistency-with-tokushoho",
    label: "特商法ページとの整合",
    status:
      getTermsFieldValue("cancellation") === getTokuShohoFieldValue("cancellation-policy") &&
      getTermsFieldValue("refund") !== "未設定"
        ? "ok"
        : "ng",
    detail: "キャンセル条件は特商法ページと同一文面を推奨",
  },
];

export const TERMS_PUBLICATION_STATUS = {
  ready: TERMS_VERIFICATION_CHECKLIST.every((item) => item.status === "ok"),
  passedCount: TERMS_VERIFICATION_CHECKLIST.filter((item) => item.status === "ok").length,
  totalCount: TERMS_VERIFICATION_CHECKLIST.length,
} as const;
