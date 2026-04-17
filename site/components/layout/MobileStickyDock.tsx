"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MOBILE_STICKY_DOCK_CLASS, MOBILE_STICKY_DOCK_PRIMARY_CLASS } from "@/lib/layout/mobile-dock";
import { cn } from "@/lib/utils/cn";

/** ヘッダー直下レイアウト用：/book 以外で表示 */
export function SiteMobileStickyDock() {
  const pathname = usePathname();

  if (pathname === "/book") {
    return null;
  }

  return (
    <div className={MOBILE_STICKY_DOCK_CLASS}>
      {pathname === "/contact" ? (
        <button
          type="submit"
          form="contact-form"
          className={MOBILE_STICKY_DOCK_PRIMARY_CLASS}
        >
          送信する
        </button>
      ) : (
        <Link href="/book" className={MOBILE_STICKY_DOCK_PRIMARY_CLASS}>
          今すぐ予約する
        </Link>
      )}
    </div>
  );
}

type BookMobileStickyDockProps = {
  step: 1 | 2 | 3;
  hasPaymentLink: boolean;
  paymentLink: string;
  stepPrimaryLabel: string;
  onStep1Next: () => void;
  onStep2Next: () => void;
};

/** 予約フロー専用（ステップに応じた primary） */
export function BookMobileStickyDock({
  step,
  hasPaymentLink,
  paymentLink,
  stepPrimaryLabel,
  onStep1Next,
  onStep2Next,
}: BookMobileStickyDockProps) {
  return (
    <div className={MOBILE_STICKY_DOCK_CLASS}>
      {step === 1 ? (
        <button type="button" onClick={onStep1Next} className={MOBILE_STICKY_DOCK_PRIMARY_CLASS}>
          {stepPrimaryLabel}
        </button>
      ) : null}

      {step === 2 ? (
        <button type="button" onClick={onStep2Next} className={MOBILE_STICKY_DOCK_PRIMARY_CLASS}>
          {stepPrimaryLabel}
        </button>
      ) : null}

      {step === 3 && hasPaymentLink ? (
        <a href={paymentLink} className={MOBILE_STICKY_DOCK_PRIMARY_CLASS}>
          {stepPrimaryLabel}
        </a>
      ) : null}

      {step === 3 && !hasPaymentLink ? (
        <span
          className={cn(MOBILE_STICKY_DOCK_PRIMARY_CLASS, "cursor-not-allowed bg-ink-subtle text-canvas opacity-80")}
          aria-disabled
        >
          {stepPrimaryLabel}
        </span>
      ) : null}
    </div>
  );
}
