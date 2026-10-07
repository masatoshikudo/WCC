/** クーポンコードの最大文字数（Stripe の Promotion code の上限より十分短い範囲で受け付ける） */
export const COUPON_CODE_MAX_LENGTH = 40;

/** URL の `?coupon=` で受け取るパラメータ名（Wedding TODO アプリのリンクが付ける） */
export const COUPON_QUERY_PARAM = "coupon";

/**
 * 入力されたクーポンコードを保存用の形に整える。
 * Stripe の Promotion code は大文字小文字を区別しないため、大文字にそろえる。
 * 空・空白のみは null。
 */
export function normalizeCouponCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/\s+/g, "");
  if (!trimmed) return null;
  return trimmed.slice(0, COUPON_CODE_MAX_LENGTH).toUpperCase();
}
