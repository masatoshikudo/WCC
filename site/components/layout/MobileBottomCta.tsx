"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBottomCta() {
  const pathname = usePathname();

  if (pathname === "/book") {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translate3d(0,0,0)] md:hidden">
      {pathname === "/contact" ? (
        <button
          type="submit"
          form="contact-form"
          className="font-display inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover"
        >
          送信する
        </button>
      ) : (
        <Link
          href="/book"
          className="font-display inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover"
        >
          今すぐ予約する
        </Link>
      )}
    </div>
  );
}
