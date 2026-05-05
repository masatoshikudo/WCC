import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_JP, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { HashScrollOnMount } from "@/components/layout/HashScrollOnMount";
import { MobileBottomCta } from "@/components/layout/MobileBottomCta";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WebVitalsReporter } from "@/components/performance/WebVitalsReporter";
import { MOBILE_STICKY_LAYOUT_BOTTOM_PAD_CLASS } from "@/lib/layout/mobile-dock";
import { cn } from "@/lib/utils/cn";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  /** UIは bold / semibold / 既定の 400 のみ使用（medium は未使用のため除外） */
  weight: ["400", "600", "700"],
});

const notoSansJp = Noto_Sans_JP({
  /** Next 14.2 の Google Fonts 定義では `japanese` subset 未提供のため `latin` のみ */
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "For Your Wedding Day",
  description:
    "結婚式のスマホ映像・当日納品。For Your Wedding Day の公式サイト。",
};

/** iOS の safe-area（env）を有効にし、下部固定CTAの位置を安定させる */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${plusJakarta.variable} ${notoSansJp.variable} ${cormorantGaramond.variable} min-h-screen flex flex-col`}
      >
        <WebVitalsReporter />
        <HashScrollOnMount />
        <SiteHeader />
        <main className={cn("flex-1 w-full", MOBILE_STICKY_LAYOUT_BOTTOM_PAD_CLASS)}>{children}</main>
        <MobileBottomCta />
        <SiteFooter />
      </body>
    </html>
  );
}
