import { type RecordBookingIntentInput } from "@/app/actions/booking";
import { escapeHtml } from "@/lib/email/escape-html";
import { sendEmailSafe } from "@/lib/email/resend";
import { formatWeddingScheduleLabel } from "@/lib/reception";

const DIVIDER = "─".repeat(16);
const SITE_URL = "https://for-your-wedding-day.com";

const COVERAGE_SCOPE_LABELS: Record<RecordBookingIntentInput["coverageScope"], string> = {
  ceremony_only: "挙式のみ",
  ceremony_reception: "挙式 + 披露宴まで",
  through_afterparty: "二次会まで",
};

export async function sendBookingConfirmationToCustomer(
  input: RecordBookingIntentInput,
): Promise<void> {
  const greeting = buildGreeting(input.coupleName);
  const subject = "[For Your Wedding Day] ご相談を受け付けました";
  const text = buildText(greeting, input);

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

function buildText(greeting: string, input: RecordBookingIntentInput): string {
  const weddingDateLine =
    formatWeddingScheduleLabel({
      dateUndecided: input.dateUndecided,
      weddingDate: input.weddingDate,
      preferredWeddingMonth: input.preferredWeddingMonth,
    }) +
    (!input.dateUndecided && !input.startTimeUndecided && input.startTime
      ? `（${input.startTime} 開始）`
      : "");

  const lines: string[] = [
    greeting,
    "",
    "このたびはご相談をありがとうございます",
    "",
    "内容を確認のうえ、担当よりお見積もりをメールでお送りします",
    "通常 2 営業日以内のご連絡となります",
    "",
    DIVIDER,
    "お預かりした内容",
    "",
    `挙式日: ${weddingDateLine}`,
    `会場: ${input.venueName}（${input.venueArea}）`,
    `撮影範囲: ${COVERAGE_SCOPE_LABELS[input.coverageScope]}`,
    `連絡先: ${input.email.trim()}`,
  ];

  if (input.emergencyContact?.trim()) {
    lines.push(`電話番号: ${input.emergencyContact.trim()}`);
  }

  const optionalItems: string[] = [];
  if (input.timelineNote?.trim()) optionalItems.push("タイムライン: あり");
  if (input.requestedScenes?.trim()) optionalItems.push("撮影シーン: あり");
  if (input.extrasNote?.trim()) optionalItems.push("追加オプション希望: あり");
  if (input.deliveryChannels.length > 0) {
    optionalItems.push(`使用媒体: ${input.deliveryChannels.join(" / ")}`);
  }
  if (input.referenceVideoUrls.length > 0) {
    optionalItems.push(`参考動画: ${input.referenceVideoUrls.length}件`);
  }

  if (optionalItems.length > 0) {
    lines.push("", "任意項目:", ...optionalItems.map((item) => `  ${item}`));
  }

  lines.push(
    DIVIDER,
    "",
    "お急ぎの場合は、このメールに返信いただくか、公式サイトからお問い合わせください",
    "",
    DIVIDER,
    "For Your Wedding Day",
    SITE_URL,
  );

  return lines.join("\n");
}
