"use server";

import { buildBookingConfirmationEmail } from "@/lib/email/booking-confirmation";
import { sendEmailSafe } from "@/lib/email/resend";
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

/**
 * 予約完了画面で呼び出し。Stripe 側の決済完了とは非同期のため、メールはベストエフォート送信。
 */
export async function sendBookingConfirmationEmail(raw: unknown): Promise<void> {
  const parsed = bookingCheckoutPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn("[sendBookingConfirmationEmail] invalid payload", parsed.error.flatten());
    return;
  }

  const data = parsed.data;
  if (Date.now() - data.savedAt > MAX_AGE_MS) {
    console.warn("[sendBookingConfirmationEmail] expired payload");
    return;
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

  const result = await sendEmailSafe({
    to: data.email.trim(),
    subject: body.subject,
    html: body.html,
    text: body.text,
  });

  if (!result.ok) {
    console.error("[sendBookingConfirmationEmail] send failed", result.message);
  }
}
