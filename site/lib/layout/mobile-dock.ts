/**
 * モバイル下部固定 CTA のシェル（MobileBottomCta / BookFlow で共有）
 * SP では viewport 下端に固定。背景は :root の canvas（#f9f4f1）でページ地色と揃える
 */
export const MOBILE_STICKY_DOCK_CLASS =
  "fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas px-4 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translate3d(0,0,0)] md:hidden";

export const MOBILE_STICKY_DOCK_PRIMARY_CLASS =
  "font-display inline-flex min-h-[78px] w-full items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover";

/** SP ドック内、予約系 CTA の直下（お問い合わせ送信のみのドックでは使わない） */
export const MOBILE_STICKY_DOCK_AUX_LINES = [
  "日程が未定でもご相談いただけます",
  "送信後に担当よりメールでご連絡します",
] as const;

/** 補助文ブロックのラッパー — SHELL_HEIGHT の上余白（mt-2）と揃える */
export const MOBILE_STICKY_DOCK_AUX_STACK_CLASS =
  "mt-2 flex flex-col gap-1 text-center";

/** 各行のタイポ — SHELL_HEIGHT の本文高さと揃える（改行・2行×2想定で余裕を取る） */
export const MOBILE_STICKY_DOCK_AUX_LINE_CLASS =
  "font-body text-xs leading-relaxed text-footer-muted";

/**
 * ドック帯の実高（MOBILE_STICKY_DOCK_CLASS の pt-6 + border-t + primary min-h + 補助文 + pb）
 * 補助文はお問い合わせ（送信のみ）では出さないが、レイアウト退避は常に最大高で取る
 * クラス側の数値を変えたらここも必ず合わせること
 */
export const MOBILE_STICKY_DOCK_SHELL_HEIGHT =
  "calc(1.5rem + 78px + 0.5rem + 5rem + 1.5rem + env(safe-area-inset-bottom,0px) + 1px)";

/** 従来の pb-48（12rem）と実ドックの大きい方。main / ヒーロー / SP カードの usable 計算で共通 */
export const MOBILE_STICKY_LAYOUT_BOTTOM_RESERVE = `max(12rem, ${MOBILE_STICKY_DOCK_SHELL_HEIGHT})`;

/**
 * SP ファーストビューの「メインエリア」縦幅（CSS `calc` 文字列）:
 * `100svh` − ヘッダー（`h-20` = 5rem）− {@link MOBILE_STICKY_LAYOUT_BOTTOM_RESERVE}。
 * ヒーロー動画の縦配置・カード usable 高さの単一ソース。
 */
export const MOBILE_HERO_MAIN_HEIGHT_CSS = `calc(100svh - 5rem - (${MOBILE_STICKY_LAYOUT_BOTTOM_RESERVE}))`;

/**
 * SP ヒーロー動画マルquee（`HeroHighlightCarousel`）の縦パディング合計。
 * `HeroHighlightCarousel` の `pt-*` / `pb-*` を変えたら同じ値に更新すること。
 * カード高さは {@link MOBILE_HERO_MAIN_HEIGHT_CSS} からこれを引いた残りに対して比率を掛ける（切れ防止）。
 */
export const MOBILE_HERO_SP_MARQUEE_VERTICAL_PAD_CSS = "5rem";

/**
 * Tailwind 用（`content` に lib/** があるため JIT が拾える）
 * layout / トップヒーロー section の SP 下端退避（md 以上では付与しない＝ページ側の md:py と競合しない）
 */
export const MOBILE_STICKY_LAYOUT_BOTTOM_PAD_CLASS =
  "max-md:pb-[max(12rem,calc(1.5rem+78px+0.5rem+5rem+1.5rem+env(safe-area-inset-bottom,0px)+1px))]";
