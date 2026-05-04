import { type RecordBookingIntentInput } from "@/app/actions/booking";
import { escapeHtml } from "@/lib/email/escape-html";
import { sendEmailSafe } from "@/lib/email/resend";

const DIVIDER = "─".repeat(16);
const SITE_URL = "https://for-your-wedding-day.com";

export async function sendBookingConfirmationToCustomer(
  input: RecordBookingIntentInput,
): Promise<void> {
  const greeting = buildGreeting(input.coupleName);
  const subject = "[For Your Wedding Day] ご相談を受け付けました";
  const text = buildText(greeting);

  await sendEmailSafe({
    to: input.email.trim(),
    subject,
    html: `<pre style="font-family:monospace;white-space:pre-wrap;font-size:14px;">${escapeHtml(text)}</pre>`,
    text,
  });
}

function buildGreeting(coupleName: string): string {
  if (!coupleName.trim()) return "ご相談者 様";
  return coupleName
    .split(" / ")
    .map((name) => `${name.trim()} 様`)
    .join("・");
}

function buildText(greeting: string): string {
  const lines = [
    greeting,
    "",
    "このたびはご相談をありがとうございます。",
    "",
    "内容を確認のうえ、担当よりお見積もりと日程のご提案をメールでお送りします。",
    "通常24時間以内のご連絡となります。",
    "",
    "お急ぎの場合は、このメールに返信いただくか、公式サイトからお問い合わせください。",
    "",
    DIVIDER,
    "For Your Wedding Day",
    SITE_URL,
  ];

  return lines.join("\n");
}
