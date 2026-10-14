/**
 * トップ（`/`）のアンカーへの導線の単一ソース。
 * 文言・ルート変更時はここと `next.config.mjs` のリダイレクトを揃える。
 */
export const HOME_ANCHOR_HREF = {
  hero: "/#top",
  serviceDetail: "/#service-detail",
  highlights: "/#works",
  whatIsWcc: "/#values",
  pricing: "/#pricing",
  serviceFlow: "/#flow",
  faq: "/#faq",
} as const;

/** 法務ページ導線の単一ソース */
export const LEGAL_PAGE_HREF = {
  tokushoho: "/legal/tokushoho",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
} as const;
