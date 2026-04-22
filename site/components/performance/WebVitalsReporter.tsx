"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Phase 0: Core Web Vitals の収集。
 * - 開発: ブラウザコンソールに `[web-vitals]` で出力
 * - 本番: `NEXT_PUBLIC_WEB_VITALS_ENDPOINT` があれば JSON POST（keepalive、失敗は握りつぶす）
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console -- Phase 0 計測用
      console.log("[web-vitals]", metric.name, {
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        navigationType: metric.navigationType,
      });
      return;
    }

    const url = process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT?.trim();
    if (!url) return;

    void fetch(url, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        navigationType: metric.navigationType,
      }),
    }).catch(() => {});
  });

  return null;
}
