"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  MOBILE_STICKY_DOCK_AUX_LINE_CLASS,
  MOBILE_STICKY_DOCK_AUX_LINES,
  MOBILE_STICKY_DOCK_AUX_STACK_CLASS,
  MOBILE_STICKY_DOCK_CLASS,
  MOBILE_STICKY_DOCK_PRIMARY_CLASS,
} from "@/lib/layout/mobile-dock";

/** 予約フローではサイト共通ドックを出さない（BookFlow 側の専用ドックと二重になるため） */
function isBookPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/book" || pathname.startsWith("/book/");
}

/** ヘッダー直下レイアウト用：/book 以外で表示 */
export function SiteMobileStickyDock() {
  const pathname = usePathname();

  if (isBookPath(pathname)) {
    return null;
  }

  return (
    <div className={MOBILE_STICKY_DOCK_CLASS}>
      <Link href="/book" className={MOBILE_STICKY_DOCK_PRIMARY_CLASS}>
        まず相談する
      </Link>
      <div className={MOBILE_STICKY_DOCK_AUX_STACK_CLASS}>
        {MOBILE_STICKY_DOCK_AUX_LINES.map((line) => (
          <p key={line} className={MOBILE_STICKY_DOCK_AUX_LINE_CLASS}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

type BookMobileStickyDockProps = {
  step: 1 | 3;
  stepPrimaryLabel: string;
  onStep1Next: () => void;
  onStep3Submit: () => void;
  isStep3Submitting: boolean;
  isStep3Done: boolean;
};

/** 予約フロー専用（ステップに応じた primary） */
export function BookMobileStickyDock({
  step,
  stepPrimaryLabel,
  onStep1Next,
  onStep3Submit,
  isStep3Submitting,
  isStep3Done,
}: BookMobileStickyDockProps) {
  return (
    <div className={MOBILE_STICKY_DOCK_CLASS}>
      {step === 1 ? (
        <button type="button" onClick={onStep1Next} className={MOBILE_STICKY_DOCK_PRIMARY_CLASS}>
          {stepPrimaryLabel}
        </button>
      ) : null}

      {step === 3 ? (
        <button
          type="button"
          onClick={onStep3Submit}
          disabled={isStep3Submitting || isStep3Done}
          className={MOBILE_STICKY_DOCK_PRIMARY_CLASS}
        >
          {isStep3Submitting ? "送信中…" : isStep3Done ? "送信済み" : stepPrimaryLabel}
        </button>
      ) : null}

      <div className={MOBILE_STICKY_DOCK_AUX_STACK_CLASS}>
        {MOBILE_STICKY_DOCK_AUX_LINES.map((line) => (
          <p key={line} className={MOBILE_STICKY_DOCK_AUX_LINE_CLASS}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
