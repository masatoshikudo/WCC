import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "wcc_admin_session";

export function adminCookieName(): typeof COOKIE_NAME {
  return COOKIE_NAME;
}

function signingSecret(): string | null {
  return process.env.ADMIN_BOOKINGS_SECRET?.trim() || null;
}

/** ログイン成功時にクッキーへ保存するトークン（平文パスワードは保存しない） */
export function issueAdminSessionToken(): string {
  const secret = signingSecret();
  if (!secret) {
    throw new Error("ADMIN_BOOKINGS_SECRET is not set");
  }
  return createHmac("sha256", secret).update("wcc-admin-v1").digest("base64url");
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  const secret = signingSecret();
  if (!secret || !token) return false;
  try {
    const expected = createHmac("sha256", secret).update("wcc-admin-v1").digest("base64url");
    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_BOOKINGS_PASSWORD?.trim();
  if (!expected || !password) return false;
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
