import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { adminCookieName, verifyAdminSessionToken } from "@/lib/admin-auth";

export async function requireAdminSession(): Promise<void> {
  const token = cookies().get(adminCookieName())?.value;
  if (!verifyAdminSessionToken(token)) {
    redirect("/admin/login");
  }
}
