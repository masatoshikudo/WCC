import { type RecordBookingIntentInput } from "@/app/actions/booking";
import { escapeHtml } from "@/lib/email/escape-html";
import { sendEmailSafe } from "@/lib/email/resend";

const COVERAGE_SCOPE_LABELS: Record<RecordBookingIntentInput["coverageScope"], string> = {
  ceremony_only: "挙式のみ",
  ceremony_reception: "挙式 + 披露宴まで",
  through_afterparty: "二次会まで",
};

const DIVIDER = "─".repeat(16);
const ADMIN_URL = "https://for-your-wedding-day.com/admin/bookings";

export async function notifyOwnerOfBookingIntent(
  input: RecordBookingIntentInput,
): Promise<void> {
  const to = process.env.OWNER_NOTIFICATION_EMAIL?.trim();
  if (!to) {
    console.warn("[booking-notification] OWNER_NOTIFICATION_EMAIL is not set; skipping");
    return;
  }

  const subject = buildSubject(input);
  const text = buildText(input);

  await sendEmailSafe({
    to,
    subject,
    html: `<pre style="font-family:monospace;white-space:pre-wrap;font-size:14px;">${escapeHtml(text)}</pre>`,
    text,
    replyTo: input.email.trim(),
  });
}

function buildSubject(input: RecordBookingIntentInput): string {
  const couplePart = input.coupleName
    ? input.coupleName.split(" / ").map((n) => `${n.trim()} 様`).join("・")
    : "（名前未入力）";
  const datePart = input.dateUndecided ? "挙式日: 未定" : `${formatDate(input.weddingDate)} 挙式予定`;
  return `[新規ご相談] ${couplePart}（${datePart}）`;
}

function buildText(input: RecordBookingIntentInput): string {
  const lines: string[] = [
    "おふたりからのご相談を受け付けました。",
    "",
    DIVIDER,
    "おふたり",
    input.coupleName || "（未入力）",
    "",
    "挙式日",
    input.dateUndecided
      ? "未定"
      : `${formatDate(input.weddingDate)}（開始時刻: ${input.startTimeUndecided ? "未定" : input.startTime || "未入力"}）`,
    "",
    "会場",
    `${input.venueName}（エリア: ${input.venueArea}）`,
    "",
    "撮影範囲",
    COVERAGE_SCOPE_LABELS[input.coverageScope],
    "",
    "ご連絡先",
    input.email.trim(),
    input.emergencyContact?.trim() ?? "",
  ];

  if (input.timelineNote?.trim()) {
    lines.push("", "当日のタイムライン", input.timelineNote.trim());
  }
  if (input.requestedScenes?.trim()) {
    lines.push("", "撮影してほしいシーン", input.requestedScenes.trim());
  }
  if (input.deliveryChannels.length > 0) {
    lines.push("", "使用予定媒体", input.deliveryChannels.join(", "));
  }
  if (input.referenceVideoUrls.length > 0) {
    lines.push("", "参考動画", input.referenceVideoUrls.join("\n"));
  }
  if (input.venueRestrictions?.trim()) {
    lines.push("", "会場側の撮影制限情報", input.venueRestrictions.trim());
  }

  lines.push(
    DIVIDER,
    "",
    "管理画面で確認・対応:",
    ADMIN_URL,
    "",
    `attempt_id: ${input.attemptId}`,
  );

  return lines.join("\n");
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${year}年${parseInt(month, 10)}月${parseInt(day, 10)}日`;
}
