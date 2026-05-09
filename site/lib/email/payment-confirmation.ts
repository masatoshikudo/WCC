import { escapeHtml } from "@/lib/email/escape-html";
import { sendEmailSafe } from "@/lib/email/resend";

const DIVIDER = "─".repeat(16);
const SITE_URL = "https://for-your-wedding-day.com";

export interface PaymentConfirmationInput {
  email: string;
  bookerName: string | null;
  planLabel: string;
}

export async function sendPaymentConfirmationToCustomer(
  input: PaymentConfirmationInput,
): Promise<void> {
  const lineInviteUrl = process.env.LINE_INVITE_URL?.trim();
  if (!lineInviteUrl) {
    console.warn("[payment-confirmation] LINE_INVITE_URL is not set; skipping customer payment confirmation");
    return;
  }

  const greeting = input.bookerName?.trim() ? `${input.bookerName.trim()} 様` : "お客様 様";
  const subject = "ご入金ありがとうございます — For Your Wedding Day";
  const text = buildText(greeting, input.planLabel, lineInviteUrl);
  const html = buildHtml(greeting, input.planLabel, lineInviteUrl);

  await sendEmailSafe({
    to: input.email.trim(),
    subject,
    html,
    text,
  });
}

function buildText(greeting: string, planLabel: string, lineInviteUrl: string): string {
  const lines = [
    greeting,
    "",
    "For Your Wedding Day をご利用いただき、ありがとうございます",
    "",
    "このたびはご入金を確認いたしました",
    "お二人の大切な一日をお手伝いできることを、心より楽しみにしております",
    "",
    `ご依頼内容: ${planLabel}`,
    "",
    "撮影に向けた詳細のお打ち合わせは、公式 LINE にてご案内いたします",
    "下記よりご登録ください",
    "",
    lineInviteUrl,
    "",
    "ご不明点がございましたら、いつでもご連絡ください",
    "",
    DIVIDER,
    "For Your Wedding Day",
    SITE_URL,
  ];

  return lines.join("\n");
}

function buildHtml(greeting: string, planLabel: string, lineInviteUrl: string): string {
  const escapedUrl = escapeHtml(lineInviteUrl);
  const lines = [
    escapeHtml(greeting),
    "",
    "For Your Wedding Day をご利用いただき、ありがとうございます",
    "",
    "このたびはご入金を確認いたしました",
    "お二人の大切な一日をお手伝いできることを、心より楽しみにしております",
    "",
    `ご依頼内容: ${escapeHtml(planLabel)}`,
    "",
    "撮影に向けた詳細のお打ち合わせは、公式 LINE にてご案内いたします",
    "下記よりご登録ください",
    "",
    `<a href="${escapedUrl}">${escapedUrl}</a>`,
    "",
    "ご不明点がございましたら、いつでもご連絡ください",
    "",
    DIVIDER,
    "For Your Wedding Day",
    escapeHtml(SITE_URL),
  ];

  return `<pre style="font-family:monospace;white-space:pre-wrap;font-size:14px;">${lines.join("\n")}</pre>`;
}
