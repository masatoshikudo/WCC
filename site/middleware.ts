import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isMaintenanceMode(): boolean {
  const v = process.env.MAINTENANCE_MODE?.trim();
  return v === "true" || v === "1";
}

/**
 * Basic 認証（一時的な鍵かけ）。
 * BASIC_AUTH_USER と BASIC_AUTH_PASS の両方が設定されている間だけ有効。
 * どちらかを消せば即解除。Edge で動かすため Buffer ではなく atob を使う。
 */
function basicAuthResponse(request: NextRequest): NextResponse | null {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;
  if (!user || !pass) return null;

  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const i = decoded.indexOf(":");
      const u = decoded.slice(0, i);
      const p = decoded.slice(i + 1);
      if (u === user && p === pass) return null;
    } catch {
      // 不正な Base64 は未認証として扱う
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="WCC", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

/** Edge でそのまま返す最小 HTML（503）。フォントはシステムスタックのみ。 */
const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>メンテナンス中 | Wedding Content Creator</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    background: #faf8f5; color: #1a1a1a; line-height: 1.6; }
  main { max-width: 28rem; text-align: center; }
  h1 { font-size: 1.125rem; font-weight: 600; margin: 0 0 0.75rem; letter-spacing: 0.02em; }
  p { margin: 0; font-size: 0.9375rem; color: #444; }
</style>
</head>
<body>
<main>
  <h1>ただいまメンテナンス中です</h1>
  <p>ご不便をおかけします。しばらくしてから、再度アクセスをお試しください。</p>
</main>
</body>
</html>`;

export function middleware(request: NextRequest) {
  // Basic 認証は /admin を含む全ページに掛ける（メンテナンスモードより先に判定）
  const unauthorized = basicAuthResponse(request);
  if (unauthorized) return unauthorized;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!isMaintenanceMode()) {
    return NextResponse.next();
  }

  return new NextResponse(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "3600",
    },
  });
}

export const config = {
  matcher: [
    /*
     * API・Next 内部（/_next/* 全体）・favicon を除外。
     * `_next/webpack-hmr` 等を漏らすとメンテ時に 503 が返り、開発で JS/CSS/HMR が壊れる。
     * 公式の除外パターンに近い形で `_next/` を一括除外する。
     * /api は Stripe Webhook 等の外部からの呼び出しがあるため Basic 認証も掛けない。
     */
    "/((?!api|_next/|favicon.ico).*)",
  ],
};
