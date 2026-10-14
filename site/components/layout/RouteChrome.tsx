"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { MOBILE_STICKY_LAYOUT_BOTTOM_PAD_CLASS } from "@/lib/layout/mobile-dock";
import { cn } from "@/lib/utils/cn";

/**
 * B3 デザインのページ（トップ・ご相談）は、専用のヘッダー・フッター・スマホ下部ボタンを持つ。
 * サイト共通のヘッダー・フッター・下部ボタンはこれらのページでは出さない。
 */
const B3_PATHS = ["/", "/book"];
const isHome = (pathname: string | null) =>
  !!pathname && B3_PATHS.some((p) => pathname === p || (p !== "/" && pathname.startsWith(`${p}/`)));

export function HideOnHome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return isHome(pathname) ? null : <>{children}</>;
}

/** main の SP 下端の余白（共通の下部ボタン分）は、B3 のページでは付けない */
export function MainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <main className={cn("flex-1 w-full", !isHome(pathname) && MOBILE_STICKY_LAYOUT_BOTTOM_PAD_CLASS)}>{children}</main>
  );
}
