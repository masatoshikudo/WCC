"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { adminCookieName, issueAdminSessionToken, verifyAdminPassword } from "@/lib/admin-auth";

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
