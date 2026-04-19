import { cn } from "@/lib/utils/cn";

/**
 * ホーム本文の標準ガター（`max-w-content` ＋横パディング）。
 * `#service-detail` / `#highlights` 内列、`#what-is-wcc` ラッパー、料金・FAQ 周りで共用。
 */
export const HOME_CONTENT_INNER_COLUMN_CLASS =
  "mx-auto w-full max-w-content px-4 md:px-6 lg:px-8";

/**
 * `#what-is-wcc` の `<section>` 本文と、料金の2カラム（`max-w-5xl`）ブロックで揃える縦パディング。
 */
export const HOME_WHAT_IS_WCC_VERT_PAD_CLASS =
  "pt-40 pb-40 md:pt-48 md:pb-48";

/**
 * `#faq` など、同一縦リズムで積むアンカーセクションのルート。
 */
export const HOME_SECTION_ANCHOR_STACK_CLASS = "scroll-mt-24 mt-16 pt-16";

/** `#faq` を包む外枠（標準ガター＋下余白）。 */
export const HOME_FAQ_SECTION_OUTER_CLASS = cn(
  HOME_CONTENT_INNER_COLUMN_CLASS,
  "pb-8 md:pb-10 lg:pb-12",
);
