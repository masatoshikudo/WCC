import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isMaintenanceMode(): boolean {
  const v = process.env.MAINTENANCE_MODE?.trim();
  return v === "true" || v === "1";
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
     * 静的ファイルと画像最適化は除外（タブのアイコン等のため favicon のみ通す）
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
