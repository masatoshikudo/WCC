import type Stripe from "stripe";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const LOG = "[stripe-webhook][quote-accepted]";

export async function handleQuoteAccepted(quote: Stripe.Quote): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    console.warn(`${LOG} Supabase not configured`);
    return;
  }

  const { data, error } = await supabase
    .from("booking_quotes")
    .select("id, status")
    .eq("stripe_quote_id", quote.id)
    .maybeSingle();

  if (error) {
    console.error(`${LOG} DB error looking up quote:`, error.message);
    throw error;
  }

  if (!data) {
    // admin 画面でまだ stripe_quote_id を紐付けていない可能性がある
    console.warn(`${LOG} No booking_quotes found for stripe_quote_id:`, quote.id);
    return;
  }

  if (data.status === "approved" || data.status === "paid") {
    console.log(`${LOG} Already processed (${data.status}), skipping:`, quote.id);
    return;
  }

  const { error: updateError } = await supabase
    .from("booking_quotes")
    .update({ status: "approved" })
    .eq("id", data.id);

  if (updateError) {
    console.error(`${LOG} Failed to update status:`, updateError.message);
    throw updateError;
  }

  console.log(`${LOG} Set status=approved for stripe_quote_id:`, quote.id);
}
