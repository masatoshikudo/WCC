import Stripe from "stripe";

/** サーバー専用。STRIPE_SECRET_KEY が未設定なら null を返す（警告のみ、例外なし）。 */
export function createStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.warn("[stripe/client] STRIPE_SECRET_KEY is not set");
    return null;
  }
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}
