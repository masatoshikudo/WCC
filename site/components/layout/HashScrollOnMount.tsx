"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToHashIfPresent() {
  const { hash } = window.location;
  if (!hash || hash.length < 2) return;

  const id = decodeURIComponent(hash.slice(1));

  const scrollToTarget = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: "start", behavior: "auto" });
    }
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(scrollToTarget);
  });
}

/**
 * フルロード・クライアント遷移・同一ページ内のハッシュ変更で、
 * `/#pricing` 等のフラグメント先へスクロールする（旧 `/packages` リダイレクト含む）。
 */
export function HashScrollOnMount() {
  const pathname = usePathname();

  useEffect(() => {
    scrollToHashIfPresent();
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => scrollToHashIfPresent();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
