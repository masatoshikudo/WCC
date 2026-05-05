import type Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { notifyOwnerOfPaymentFailure } from "@/lib/email/booking-notification";

const LOG = "[stripe-webhook][invoice-payment-failed]";

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  let attemptId: string | null = null;
  let email: string | null = null;
  let bookerName: string | null = null;

  const supabase = createSupabaseAdmin();
  if (supabase) {
    const { data: quote } = await supabase
      .from("booking_quotes")
      .select("attempt_id")
      .eq("stripe_invoice_id", invoice.id)
      .maybeSingle();
    attemptId = quote?.attempt_id ?? null;

    if (attemptId) {
      const { data: intent } = await supabase
        .from("booking_intents")
        .select("email, booker_name")
        .eq("attempt_id", attemptId)
        .maybeSingle();
      email = intent?.email ?? null;
      bookerName = intent?.booker_name ?? null;
    }
  }

  console.warn(
    `${LOG} Payment failed:`,
    invoice.id,
    "attempt_id:", attemptId ?? "(not linked)",
    "next_payment_attempt:", invoice.next_payment_attempt ?? "none"
  );

  // 紐付け済み booking_quote が見つかった場合のみ通知
  if (attemptId && email) {
    await notifyOwnerOfPaymentFailure({
      invoiceId: invoice.id,
      attemptCount: invoice.attempt_count,
      failureReason: null,
      nextPaymentAttempt: invoice.next_payment_attempt ?? null,
      attemptId,
      email,
      bookerName,
      amountDue: invoice.amount_due,
      currency: invoice.currency,
    });
  }
}
