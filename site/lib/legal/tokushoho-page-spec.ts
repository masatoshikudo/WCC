import { type Metadata } from "next";

import { TOKUSHOHO_DRAFT, type DisclosureFieldStatus } from "@/lib/legal/tokushoho-draft";
import {
  TOKUSHOHO_MANUSCRIPT_SECTIONS,
  TOKUSHOHO_MISSING_FIELDS,
  TOKUSHOHO_TERM_GUIDE,
} from "@/lib/legal/tokushoho-manuscript";
import { LEGAL_PAGE_HREF } from "@/lib/site-links";

export type TokuShohoFieldView = {
  id: string;
  label: string;
  value: string;
  status: DisclosureFieldStatus;
  statusLabel: string;
  note?: string;
};

export type TokuShohoSectionView = {
  id: string;
  title: string;
  description: string;
  items: TokuShohoFieldView[];
};

export const TOKUSHOHO_PAGE_METADATA: Metadata = {
  title: `${TOKUSHOHO_TERM_GUIDE.pageTitle} | Wedding Content Creator`,
  description:
    "Wedding Content Creator の特定商取引法に基づく表記です。販売価格、支払方法、提供時期、キャンセル・返金条件などを掲載しています。",
};

/**
 * フェーズ3（実装設計）:
 * - ページURLとドラフト定義の整合を常に保証する
 * - 章構成（フェーズ2）を画面描画向けの ViewModel に変換する
 */
export function buildTokuShohoSectionViews(): TokuShohoSectionView[] {
  if (TOKUSHOHO_DRAFT.pagePath !== LEGAL_PAGE_HREF.tokushoho) {
    throw new Error("tokushoho page path mismatch between draft and site-links");
  }

  return TOKUSHOHO_MANUSCRIPT_SECTIONS.map((section) => ({
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

export const TOKUSHOHO_PENDING_SUMMARY = {
  total: TOKUSHOHO_MISSING_FIELDS.length,
  needsInputCount: TOKUSHOHO_MISSING_FIELDS.filter((field) => field.status === "needs_input").length,
  needsReviewCount: TOKUSHOHO_MISSING_FIELDS.filter((field) => field.status === "needs_review").length,
} as const;

function getStatusLabel(status: DisclosureFieldStatus): string {
  if (status === "confirmed") return "確定";
  if (status === "needs_input") return "要入力";
  return "要レビュー";
}
