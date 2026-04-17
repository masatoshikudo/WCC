import type { ContactFormValues } from "@/lib/validations/contact";

import { escapeHtml } from "./escape-html";

function formatOptional(value: string | undefined): string {
  if (value == null || value.trim() === "") return "（未入力）";
  return escapeHtml(value.trim());
}

export function buildContactCustomerEmail(params: { data: ContactFormValues }) {
  const { data } = params;
  const name = escapeHtml(data.name.trim());

  const subject = "お問い合わせを受け付けました（Wedding Content Creator）";
  const text = [
    `${name} 様`,
    "",
    "この度は Wedding Content Creator（WCC）へお問い合わせいただき、ありがとうございます。",
    "内容を確認のうえ、2営業日以内を目安にご返信します。",
    "",
    "お急ぎの場合は、サイトに記載のLINEからもご連絡いただけます。",
    "",
    "— Wedding Content Creator",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #111;">
  <p>${name} 様</p>
  <p>この度は Wedding Content Creator（WCC）へお問い合わせいただき、ありがとうございます。</p>
  <p>内容を確認のうえ、2営業日以内を目安にご返信します。</p>
  <p>お急ぎの場合は、サイトに記載のLINEからもご連絡いただけます。</p>
  <p style="margin-top: 24px; color: #444;">— Wedding Content Creator</p>
</body>
</html>`;

  return { subject, html, text };
}

export function buildContactStaffEmail(params: { data: ContactFormValues }) {
  const { data } = params;
  const subject = `【WCC】お問い合わせ: ${data.name.trim()}`;

  const lines = [
    "お問い合わせフォームから新着です。",
    "",
    `お名前: ${data.name.trim()}`,
    `お相手のお名前: ${data.partnerName?.trim() || "（未入力）"}`,
    `メール: ${data.email.trim()}`,
    `電話: ${data.phone.trim()}`,
    `希望日（第1候補）: ${data.weddingDateFirst}`,
    `希望日（第2候補）: ${data.weddingDateSecond?.trim() || "（未入力）"}`,
    `希望日（第3候補）: ${data.weddingDateThird?.trim() || "（未入力）"}`,
    `式場名 / エリア: ${data.venue?.trim() || "（未入力）"}`,
    `ゲスト人数: ${data.guestCount?.trim() || "（未入力）"}`,
    `ご予算: ${data.budget?.trim() || "（未入力）"}`,
    "",
    "ご相談内容:",
    data.message.trim(),
  ];

  const text = lines.join("\n");

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #111;">
  <p>お問い合わせフォームから新着です。</p>
  <table style="border-collapse: collapse; margin-top: 8px;">
    <tbody>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">お名前</td><td>${escapeHtml(data.name.trim())}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">お相手のお名前</td><td>${formatOptional(data.partnerName)}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">メール</td><td>${escapeHtml(data.email.trim())}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">電話</td><td>${escapeHtml(data.phone.trim())}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">希望日（第1候補）</td><td>${escapeHtml(data.weddingDateFirst)}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">希望日（第2候補）</td><td>${formatOptional(data.weddingDateSecond)}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">希望日（第3候補）</td><td>${formatOptional(data.weddingDateThird)}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">式場名 / エリア</td><td>${formatOptional(data.venue)}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">ゲスト人数</td><td>${formatOptional(data.guestCount)}</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color:#555;">ご予算</td><td>${formatOptional(data.budget)}</td></tr>
    </tbody>
  </table>
  <p style="margin-top: 16px; font-weight: 600;">ご相談内容</p>
  <p style="white-space: pre-wrap;">${escapeHtml(data.message.trim())}</p>
</body>
</html>`;

  return { subject, html, text };
}
