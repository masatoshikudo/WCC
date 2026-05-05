import type Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const LOG = "[stripe-webhook][invoice-payment-failed]";

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  // DB 更新は行わない。ログ記録のみ。
  // 運営者への通知メールは Step 4 で実装。

  let attemptId: string | null = null;

  const supabase = createSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase
      .from("booking_quotes")
      .select("attempt_id")
      .eq("stripe_invoice_id", invoice.id)
      .maybeSingle();
    attemptId = data?.attempt_id ?? null;
  }

  console.warn(
    `${LOG} Payment failed:`,
    invoice.id,
    "attempt_id:", attemptId ?? "(not linked)",
    "next_payment_attempt:", invoice.next_payment_attempt ?? "none"
  );
}
