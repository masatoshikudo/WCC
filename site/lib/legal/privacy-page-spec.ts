import { type Metadata } from "next";

import { PRIVACY_DRAFT } from "@/lib/legal/privacy-draft";
import {
  PRIVACY_MANUSCRIPT_SECTIONS,
  PRIVACY_MISSING_FIELDS,
  PRIVACY_TERM_GUIDE,
} from "@/lib/legal/privacy-manuscript";
import { type DisclosureFieldStatus } from "@/lib/legal/tokushoho-draft";
import { LEGAL_PAGE_HREF } from "@/lib/site-links";

export type PrivacyFieldView = {
  id: string;
  label: string;
  value: string;
  status: DisclosureFieldStatus;
  statusLabel: string;
  note?: string;
};

export type PrivacySectionView = {
  id: string;
  title: string;
  description: string;
  items: PrivacyFieldView[];
};

export const PRIVACY_PAGE_METADATA: Metadata = {
  title: `${PRIVACY_TERM_GUIDE.pageTitle} | Wedding Content Creator`,
  description:
    "Wedding Content Creator のプライバシーポリシーです。取得する情報、利用目的、第三者提供、問い合わせ窓口などを掲載しています。",
};

/**
 * フェーズ3（実装設計）:
 * - ページURLとドラフト定義の整合を常に保証する
 * - 章構成（フェーズ2）を画面描画向けの ViewModel に変換する
 */
export function buildPrivacySectionViews(): PrivacySectionView[] {
  if (PRIVACY_DRAFT.pagePath !== LEGAL_PAGE_HREF.privacy) {
    throw new Error("privacy page path mismatch between draft and site-links");
  }

  return PRIVACY_MANUSCRIPT_SECTIONS.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    items: section.fields.map((field) => ({
      id: field.id,
      label: field.label,
      value: field.value,
      status: field.status,
      statusLabel: getStatusLabel(field.status),
      note: field.note,
    })),
  }));
}

export const PRIVACY_PENDING_SUMMARY = {
  total: PRIVACY_MISSING_FIELDS.length,
  needsInputCount: PRIVACY_MISSING_FIELDS.filter((field) => field.status === "needs_input").length,
  needsReviewCount: PRIVACY_MISSING_FIELDS.filter((field) => field.status === "needs_review").length,
} as const;

function getStatusLabel(status: DisclosureFieldStatus): string {
  if (status === "confirmed") return "確定";
  if (status === "needs_input") return "要入力";
  return "要レビュー";
}
