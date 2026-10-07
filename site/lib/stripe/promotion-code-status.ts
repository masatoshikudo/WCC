import type Stripe from "stripe";

import { createStripeClient } from "@/lib/stripe/client";

export type PromotionCodeStatus =
  | "active" // 使える
  | "expired" // 期限切れ
  | "max_reached" // 回数の上限に達した
  | "inactive" // Stripe で無効にしている
  | "not_found" // Stripe に存在しない
  | "unavailable"; // 確認できない（キー未設定・通信エラー）

export const PROMOTION_CODE_STATUS_LABEL: Record<PromotionCodeStatus, string> = {
  active: "使える",
  expired: "期限切れ",
  max_reached: "上限に達した",
  inactive: "無効",
  not_found: "存在しない",
  unavailable: "確認できません",
};

function judge(promo: Stripe.PromotionCode, nowSec: number): PromotionCodeStatus {
  const coupon = typeof promo.promotion.coupon === "object" ? promo.promotion.coupon : null;
  if (promo.expires_at !== null && promo.expires_at <= nowSec) return "expired";
  if (coupon?.redeem_by != null && coupon.redeem_by <= nowSec) return "expired";
  if (promo.max_redemptions !== null && promo.times_redeemed >= promo.max_redemptions) {
    return "max_reached";
  }
  if (coupon?.max_redemptions != null && coupon.times_redeemed >= coupon.max_redemptions) {
    return "max_reached";
  }
  if (!promo.active || (coupon && !coupon.valid)) return "inactive";
  return "active";
}

/**
 * 管理画面用。コードごとに Stripe の Promotion code の状態を調べる（同じコードは1回だけ問い合わせる）。
 * STRIPE_SECRET_KEY が無い・通信に失敗した場合は "unavailable" を返し、例外は投げない。
 */
export async function getPromotionCodeStatuses(
  codes: Array<string | null>,
): Promise<Map<string, PromotionCodeStatus>> {
  const unique = Array.from(new Set(codes.filter((c): c is string => Boolean(c))));
  const result = new Map<string, PromotionCodeStatus>();
  if (unique.length === 0) return result;

  const stripe = createStripeClient();
  if (!stripe) {
    for (const code of unique) result.set(code, "unavailable");
    return result;
  }

  const nowSec = Math.floor(Date.now() / 1000);
  await Promise.all(
    unique.map(async (code) => {
      try {
        const list = await stripe.promotionCodes.list({
          code,
          limit: 10,
          expand: ["data.promotion.coupon"],
        });
        if (list.data.length === 0) {
          result.set(code, "not_found");
          return;
        }
        // 同じ文字列が複数ある場合は、使えるものを優先する
        const statuses = list.data.map((promo) => judge(promo, nowSec));
        result.set(code, statuses.includes("active") ? "active" : statuses[0]);
      } catch (error) {
        console.error("[promotion-code-status]", error instanceof Error ? error.message : error);
        result.set(code, "unavailable");
      }
    }),
  );
  return result;
}
