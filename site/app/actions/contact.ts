"use server";

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";

export type SubmitContactResult =
  | { ok: true }
  | { ok: false; error: string };

function parseGuestCount(raw: string | undefined): number | null {
  if (raw == null || raw.trim() === "") return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function submitContactInquiry(values: ContactFormValues): Promise<SubmitContactResult> {
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      Object.values(first)
        .flat()
        .find(Boolean) ?? "入力内容を確認してください";
    return { ok: false, error: msg };
  }

  const data = parsed.data;
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "送信処理の設定が完了していません。しばらくしてから再度お試しください。" };
  }

  const row = {
    name: data.name.trim(),
    partner_name: data.partnerName?.trim() || null,
    email: data.email.trim(),
    phone: data.phone.trim(),
    wedding_date_first: data.weddingDateFirst,
    wedding_date_second: data.weddingDateSecond?.trim() || null,
    wedding_date_third: data.weddingDateThird?.trim() || null,
    venue: data.venue?.trim() || null,
    guest_count: parseGuestCount(data.guestCount),
    budget: data.budget?.trim() || null,
    message: data.message.trim(),
  };

  const { error } = await supabase.from("contact_inquiries").insert(row);

  if (error) {
    console.error("[submitContactInquiry]", error.message);
    return { ok: false, error: "送信に失敗しました。時間をおいて再度お試しください。" };
  }

  return { ok: true };
}
