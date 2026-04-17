import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { adminCookieName, verifyAdminSessionToken } from "@/lib/admin-auth";

export default function AdminIndexPage() {
  const token = cookies().get(adminCookieName())?.value;
  if (verifyAdminSessionToken(token)) {
    redirect("/admin/bookings");
  }
  redirect("/admin/login");
}
