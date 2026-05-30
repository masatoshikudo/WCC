"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";

/**
 * 手動 $pageview 送信。遷移ごとに `$current_url`（searchParams 込み）を組み立てて capture する。
 * `useSearchParams` は static rendering でエラーになるため、`SuspendedPostHogPageView` 経由で Suspense 配下に置く。
 */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!pathname || !posthog) return;

    let url = window.origin + pathname;
    const query = searchParams.toString();
    if (query) {
      url = `${url}?${query}`;
    }

    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, posthog]);

  return null;
}

export function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
