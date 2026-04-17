"use server";

import { buildBookingConfirmationEmail } from "@/lib/email/booking-confirmation";
import { sendEmailSafe } from "@/lib/email/resend";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { bookingCheckoutPayloadSchema } from "@/lib/validations/booking-email";

const MAX_AGE_MS = 1000 * 60 * 60 * 48;

function formatWeddingDateLabel(payload: {
  dateUndecided: boolean;
  weddingDate: string;
}): string {
  if (payload.dateUndecided) return "未定";
  const d = payload.weddingDate.trim();
  return d === "" ? "未入力" : d;
}

export type RecordBookingIntentInput = {
  attemptId: string;
  email: string;
  bookerName: string | null;
  weddingDate: string;
  dateUndecided: boolean;
  planId: string;
  planLabel: string;
  priceLabel: string;
};

/** ステップ3到達時（お支払い前）。同一 attemptId は無視 */
export async function recordBookingIntent(input: RecordBookingIntentInput): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    console.warn("[recordBookingIntent] Supabase not configured");
    return;
  }

  const row = {
    attempt_id: input.attemptId,
    email: input.email.trim(),
    booker_name: input.bookerName?.trim() || null,
    wedding_date: input.weddingDate,
    date_undecided: input.dateUndecided,
    plan_id: input.planId,
    plan_label: input.planLabel,
    price_label: input.priceLabel,
  };

  const { error } = await supabase.from("booking_intents").insert(row);

  if (error) {
    if (error.code === "23505") {
      return;
    }
    console.error("[recordBookingIntent]", error.message);
  }
}

export type FinalizeBookingResult =
  | { ok: true; insertedPayment: boolean; emailSent: boolean }
  | { ok: false; error: string };

/**
 * 決済成功画面。intent の存在を保証しつつ payment を登録し、初回のみ確認メール送信。
 */
export async function finalizeBookingAfterPayment(
  raw: unknown,
  stripeCheckoutSessionId?: string | null,
): Promise<FinalizeBookingResult> {
  const parsed = bookingCheckoutPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn("[finalizeBookingAfterPayment] invalid payload", parsed.error.flatten());
    return { ok: false, error: "invalid_payload" };
  }

  const data = parsed.data;
  if (Date.now() - data.savedAt > MAX_AGE_MS) {
    console.warn("[finalizeBookingAfterPayment] expired payload");
    return { ok: false, error: "expired" };
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "supabase_unconfigured" };
  }

  const intentRow = {
    attempt_id: data.attemptId,
    email: data.email.trim(),
    booker_name: data.bookerName?.trim() || null,
    wedding_date: data.weddingDate,
    date_undecided: data.dateUndecided,
    plan_id: data.planId,
    plan_label: data.planLabel,
    price_label: data.priceLabel,
  };

  const { error: intentErr } = await supabase.from("booking_intents").insert(intentRow);

  if (intentErr && intentErr.code !== "23505") {
    console.error("[finalizeBookingAfterPayment] intent insert", intentErr.message);
    return { ok: false, error: "intent_write_failed" };
  }

  const paymentRow = {
    attempt_id: data.attemptId,
    email: data.email.trim(),
    booker_name: data.bookerName?.trim() || null,
    wedding_date: data.weddingDate,
    date_undecided: data.dateUndecided,
    plan_id: data.planId,
    plan_label: data.planLabel,
    price_label: data.priceLabel,
    stripe_checkout_session_id: stripeCheckoutSessionId?.trim() || null,
    source: "success_page",
  };

  const { data: inserted, error: payErr } = await supabase
    .from("booking_payments")
    .insert(paymentRow)
    .select("attempt_id")
    .maybeSingle();

  if (payErr) {
    if (payErr.code === "23505") {
      return { ok: true, insertedPayment: false, emailSent: false };
    }
    console.error("[finalizeBookingAfterPayment] payment insert", payErr.message);
    return { ok: false, error: "payment_write_failed" };
  }

  if (!inserted?.attempt_id) {
    return { ok: true, insertedPayment: false, emailSent: false };
  }

  const weddingDateLabel = formatWeddingDateLabel({
    dateUndecided: data.dateUndecided,
    weddingDate: data.weddingDate,
  });

  const body = buildBookingConfirmationEmail({
    data: {
      email: data.email.trim(),
      bookerName: data.bookerName?.trim() ? data.bookerName.trim() : null,
      weddingDateLabel,
      planLabel: data.planLabel,
      priceLabel: data.priceLabel,
    },
  });

  const mail = await sendEmailSafe({
    to: data.email.trim(),
    subject: body.subject,
    html: body.html,
    text: body.text,
  });

  if (!mail.ok) {
    console.error("[finalizeBookingAfterPayment] email failed", mail.message);
    return { ok: true, insertedPayment: true, emailSent: false };
  }

  return { ok: true, insertedPayment: true, emailSent: true };
}
