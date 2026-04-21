import { TOKUSHOHO_DRAFT } from "@/lib/legal/tokushoho-draft";
import { TOKUSHOHO_MISSING_FIELDS } from "@/lib/legal/tokushoho-manuscript";
import { LEGAL_PAGE_HREF } from "@/lib/site-links";

export type TokuShohoChecklistStatus = "ok" | "ng";

export type TokuShohoChecklistItem = {
  id: string;
  label: string;
  status: TokuShohoChecklistStatus;
  detail: string;
};

const REQUIRED_FIELD_IDS = [
  "seller-name",
  "operator-name",
  "location",
  "phone",
  "email",
  "price",
  "additional-fees",
  "payment-method",
  "payment-timing",
  "service-timing",
  "cancellation-policy",
  "refund-policy",
] as const;

function hasRequiredField(fieldId: string): boolean {
  return TOKUSHOHO_DRAFT.fields.some((field) => field.id === fieldId);
}

function getFieldValue(fieldId: string): string {
  return TOKUSHOHO_DRAFT.fields.find((field) => field.id === fieldId)?.value ?? "";
}

export const TOKUSHOHO_VERIFICATION_CHECKLIST: readonly TokuShohoChecklistItem[] = [
  {
    id: "page-path",
    label: "ページURLの整合",
    status: TOKUSHOHO_DRAFT.pagePath === LEGAL_PAGE_HREF.tokushoho ? "ok" : "ng",
    detail: `${TOKUSHOHO_DRAFT.pagePath} / ${LEGAL_PAGE_HREF.tokushoho}`,
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
    status: TOKUSHOHO_MISSING_FIELDS.length === 0 ? "ok" : "ng",
    detail: `未確定 ${TOKUSHOHO_MISSING_FIELDS.length}件（0件で公開推奨）`,
  },
  {
    id: "payment-method",
    label: "決済手段の明記（Stripe）",
    status: getFieldValue("payment-method").includes("Stripe") ? "ok" : "ng",
    detail: getFieldValue("payment-method") || "未記載",
  },
  {
    id: "refund-cancellation",
    label: "キャンセル・返金条件の明記",
    status:
      getFieldValue("cancellation-policy") !== "未設定" &&
      getFieldValue("refund-policy") !== "未設定"
        ? "ok"
        : "ng",
    detail: "未設定のままでは Stripe/特商法観点で公開不可",
  },
];

export const TOKUSHOHO_PUBLICATION_STATUS = {
  ready: TOKUSHOHO_VERIFICATION_CHECKLIST.every((item) => item.status === "ok"),
  passedCount: TOKUSHOHO_VERIFICATION_CHECKLIST.filter((item) => item.status === "ok").length,
  totalCount: TOKUSHOHO_VERIFICATION_CHECKLIST.length,
} as const;
