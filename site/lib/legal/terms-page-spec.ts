import { type Metadata } from "next";

import { TERMS_DRAFT } from "@/lib/legal/terms-draft";
import {
  TERMS_MANUSCRIPT_SECTIONS,
  TERMS_MISSING_FIELDS,
  TERMS_TERM_GUIDE,
} from "@/lib/legal/terms-manuscript";
import { type DisclosureFieldStatus } from "@/lib/legal/tokushoho-draft";
import { LEGAL_PAGE_HREF } from "@/lib/site-links";

export type TermsFieldView = {
  id: string;
  label: string;
  value: string;
  status: DisclosureFieldStatus;
  statusLabel: string;
  note?: string;
};

export type TermsSectionView = {
  id: string;
  title: string;
  description: string;
  items: TermsFieldView[];
};

export const TERMS_PAGE_METADATA: Metadata = {
  title: `${TERMS_TERM_GUIDE.pageTitle} | Wedding Content Creator`,
  description:
    "Wedding Content Creator の利用規約です。契約成立時点、支払条件、キャンセル・返金、責任範囲、準拠法・管轄などを掲載しています。",
};

/**
 * フェーズ3（実装設計）:
 * - ページURLとドラフト定義の整合を常に保証する
 * - 章構成（フェーズ2）を画面描画向けの ViewModel に変換する
 */
export function buildTermsSectionViews(): TermsSectionView[] {
  if (TERMS_DRAFT.pagePath !== LEGAL_PAGE_HREF.terms) {
    throw new Error("terms page path mismatch between draft and site-links");
  }

  return TERMS_MANUSCRIPT_SECTIONS.map((section) => ({
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

export const TERMS_PENDING_SUMMARY = {
  total: TERMS_MISSING_FIELDS.length,
  needsInputCount: TERMS_MISSING_FIELDS.filter((field) => field.status === "needs_input").length,
  needsReviewCount: TERMS_MISSING_FIELDS.filter((field) => field.status === "needs_review").length,
} as const;

function getStatusLabel(status: DisclosureFieldStatus): string {
  if (status === "confirmed") return "確定";
  if (status === "needs_input") return "要入力";
  return "要レビュー";
}
