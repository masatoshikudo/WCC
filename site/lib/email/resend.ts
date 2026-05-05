import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

/** Resend ダッシュボードで検証済みの送信元。未検証時は onboarding@resend.dev を利用可 */
export function getDefaultFrom(): string {
  return process.env.RESEND_FROM?.trim() || "For Your Wedding Day <onboarding@resend.dev>";
}

export async function sendEmailSafe(params: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY is not set; skipping send");
    return { ok: false, message: "missing_api_key" };
  }

  const { error } = await resend.emails.send({
    from: getDefaultFrom(),
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
    reply_to: params.replyTo,
  });

  if (error) {
    console.error("[email] Resend error", error);
    return { ok: false, message: error.message ?? "send_failed" };
  }

  return { ok: true };
}
