/**
 * トップ（`/`）のアンカーへの導線の単一ソース。
 * 文言・ルート変更時はここと `next.config.mjs` のリダイレクトを揃える。
 */
export const HOME_ANCHOR_HREF = {
  hero: "/#hero",
  serviceDetail: "/#service-detail",
  highlights: "/#highlights",
  whatIsWcc: "/#what-is-wcc",
  pricing: "/#pricing",
  faq: "/#faq",
} as const;
