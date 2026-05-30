"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PostHogReactProvider } from "posthog-js/react";

/**
 * PostHog 初期化 + Provider。
 * - 手動計測方針: autocapture/pageview を無効化し、$pageview は `SuspendedPostHogPageView` から送る
 * - `product: 'wcc'` を register し、TinyKomainu と同一プロジェクトでの横断管理用タグを全イベントに付与
 * - person_profiles は 'identified_only'（訪問者は匿名、admin のみ後で identify する余地を残す）
 * - `NEXT_PUBLIC_POSTHOG_KEY` 未設定時は init をスキップ（ローカル/未設定環境で落とさない）
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
    posthog.register({ product: "wcc" });
  }, []);

  return <PostHogReactProvider client={posthog}>{children}</PostHogReactProvider>;
}
