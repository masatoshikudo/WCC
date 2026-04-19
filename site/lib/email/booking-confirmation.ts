import { escapeHtml } from "./escape-html";

export type BookingConfirmationPayload = {
  email: string;
  bookerName: string | null;
  weddingDateLabel: string;
  planLabel: string;
  priceLabel: string;
};

export function buildBookingConfirmationEmail(params: { data: BookingConfirmationPayload }) {
  const { data } = params;
  const greetingHtml = data.bookerName?.trim()
    ? `${escapeHtml(data.bookerName.trim())} 様`
    : "お客様";
  const dateLine = escapeHtml(data.weddingDateLabel);
  const planLine = escapeHtml(data.planLabel);
  const priceLine = escapeHtml(data.priceLabel);

  const subject = "お支払いを確認しました（Wedding Content Creator）";

  const text = [
    data.bookerName?.trim() ? `${data.bookerName.trim()} 様` : "お客様",
    "",
    "パッケージ料金のお支払いを確認しました。ご予約内容として受け付けています。",
    "",
    `挙式日: ${data.weddingDateLabel}`,
    `パッケージ: ${data.planLabel}`,
    `料金: ${data.priceLabel}`,
    "",
    "正式な条件や今後の流れは、追ってご案内します。内容に相違がある場合は、お問い合わせからご連絡ください。",
    "",
    "— Wedding Content Creator",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #111;">
  <p>${greetingHtml}</p>
  <p>パッケージ料金のお支払いを確認しました。ご予約内容として受け付けています。</p>
  <table style="border-collapse: collapse; margin-top: 12px;">
    <tbody>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">挙式日</td><td>${dateLine}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">パッケージ</td><td>${planLine}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">料金</td><td>${priceLine}</td></tr>
    </tbody>
  </table>
  <p style="margin-top: 16px;">正式な条件や今後の流れは、追ってご案内します。内容に相違がある場合は、お問い合わせからご連絡ください。</p>
  <p style="margin-top: 24px; color: #444;">— Wedding Content Creator</p>
</body>
</html>`;

  return { subject, html, text };
}
