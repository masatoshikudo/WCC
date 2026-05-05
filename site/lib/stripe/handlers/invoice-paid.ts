import type Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const LOG = "[stripe-webhook][invoice-paid]";

export async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    console.warn(`${LOG} Supabase not configured`);
    return;
  }

  const { data: quote, error: quoteError } = await supabase
    .from("booking_quotes")
    .select("id, status, attempt_id")
    .eq("stripe_invoice_id", invoice.id)
    .maybeSingle();

  if (quoteError) {
    console.error(`${LOG} DB error looking up quote:`, quoteError.message);
    throw quoteError;
  }

  if (!quote) {
    console.warn(`${LOG} No booking_quotes found for stripe_invoice_id:`, invoice.id);
    return;
  }

  // 冪等: すでに paid なら何もしない
  if (quote.status === "paid") {
    console.log(`${LOG} Already paid, skipping:`, invoice.id);
    return;
  }

  const { data: intent, error: intentError } = await supabase
    .from("booking_intents")
    .select("email, booker_name, wedding_date, date_undecided, plan_id, plan_label, price_label")
    .eq("attempt_id", quote.attempt_id)
    .single();

  if (intentError || !intent) {
    // FK 制約上は起こらないが、念のため
    console.error(`${LOG} booking_intents not found for attempt_id:`, quote.attempt_id, intentError?.message);
    return;
  }

  // 冪等 upsert: attempt_id が既存なら何もしない（success_page 経由のレコードを保護）
  const { error: paymentError } = await supabase
    .from("booking_payments")
    .upsert(
      {
        attempt_id: quote.attempt_id,
        email: intent.email,
        booker_name: intent.booker_name ?? null,
        wedding_date: intent.wedding_date,
        date_undecided: intent.date_undecided,
        plan_id: intent.plan_id,
        plan_label: intent.plan_label,
        price_label: intent.price_label,
        stripe_checkout_session_id: null,
        source: "webhook",
      },
      { onConflict: "attempt_id", ignoreDuplicates: true }
    );

  if (paymentError) {
    console.error(`${LOG} Failed to upsert booking_payments:`, paymentError.message);
    throw paymentError;
  }

  const { error: quoteUpdateError } = await supabase
    .from("booking_quotes")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", quote.id);

  if (quoteUpdateError) {
    console.error(`${LOG} Failed to update booking_quotes status:`, quoteUpdateError.message);
    throw quoteUpdateError;
  }

  console.log(`${LOG} booking_payments upserted + booking_quotes set to paid for:`, invoice.id);
}
