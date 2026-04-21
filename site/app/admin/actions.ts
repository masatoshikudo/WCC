"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { adminCookieName, issueAdminSessionToken, verifyAdminPassword } from "@/lib/admin-auth";
import { requireAdminSession } from "@/lib/admin-auth-server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export type AdminLoginState = { ok: false; message: string };

export async function adminLoginAction(
  _prev: AdminLoginState | undefined,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = formData.get("password");
  if (typeof password !== "string") {
    return { ok: false, message: "パスワードを入力してください。" };
  }

  if (!verifyAdminPassword(password)) {
    return { ok: false, message: "パスワードが正しくありません。" };
  }

  let token: string;
  try {
    token = issueAdminSessionToken();
  } catch {
    return {
      ok: false,
      message: "管理画面の設定（ADMIN_BOOKINGS_SECRET）が未設定です。",
    };
  }

  cookies().set(adminCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin/bookings");
}

export async function adminLogoutAction(): Promise<void> {
  cookies().delete(adminCookieName());
  redirect("/admin/login");
}

type QuoteStatus = "draft" | "sent" | "approved" | "paid" | "expired" | "cancelled";

function parseStatus(raw: FormDataEntryValue | null): QuoteStatus {
  if (typeof raw !== "string") return "draft";
  const v = raw.trim();
  if (v === "sent" || v === "approved" || v === "paid" || v === "expired" || v === "cancelled") {
    return v;
  }
  return "draft";
}

function parseNonNegativeInt(raw: FormDataEntryValue | null): number {
  if (typeof raw !== "string") return 0;
  const parsed = Number.parseInt(raw.trim(), 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

function parseNullableText(raw: FormDataEntryValue | null): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim();
  return v === "" ? null : v;
}

export async function upsertBookingQuoteReferenceAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return;
  }

  const attemptId = parseNullableText(formData.get("attempt_id"));
  if (!attemptId) {
    return;
  }

  const payload = {
    attempt_id: attemptId,
    status: parseStatus(formData.get("status")),
    base_price_ex_tax: parseNonNegativeInt(formData.get("base_price_ex_tax")),
    option_fee_ex_tax: parseNonNegativeInt(formData.get("option_fee_ex_tax")),
    travel_fee_ex_tax: parseNonNegativeInt(formData.get("travel_fee_ex_tax")),
    lodging_fee_ex_tax: parseNonNegativeInt(formData.get("lodging_fee_ex_tax")),
    discount_ex_tax: parseNonNegativeInt(formData.get("discount_ex_tax")),
    subtotal_ex_tax: parseNonNegativeInt(formData.get("subtotal_ex_tax")),
    tax_amount: parseNonNegativeInt(formData.get("tax_amount")),
    total_in_tax: parseNonNegativeInt(formData.get("total_in_tax")),
    stripe_customer_id: parseNullableText(formData.get("stripe_customer_id")),
    stripe_quote_id: parseNullableText(formData.get("stripe_quote_id")),
    stripe_invoice_id: parseNullableText(formData.get("stripe_invoice_id")),
    payment_url: parseNullableText(formData.get("payment_url")),
    expires_at: parseNullableText(formData.get("expires_at")),
  };

  const { error } = await supabase
    .from("booking_quotes")
    .upsert(payload, { onConflict: "attempt_id" });

  if (error) {
    console.error("[upsertBookingQuoteReferenceAction]", error.message);
    return;
  }
  revalidatePath("/admin/bookings");
}
