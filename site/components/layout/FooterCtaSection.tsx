"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isBookPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/book" || pathname.startsWith("/book/");
}

export function FooterCtaSection() {
  const pathname = usePathname();

  if (isBookPath(pathname)) {
    return null;
  }

  return (
    <>
      <div className="mx-auto w-full max-w-content px-4 pt-40 pb-28 md:px-6 md:pt-48 md:pb-32 md:text-center lg:px-8 lg:pb-40">
        <h2
          className="font-heading font-normal text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.12] text-ink"
          style={{ letterSpacing: "0.02em" }}
        >
          明日のふたりへ、
          <br />
          ありのままの一日を
        </h2>
        <p className="mt-3 max-w-2xl font-body leading-relaxed text-ink-muted md:mx-auto">
        撮りたい内容も、日程も
        <br />
        これからで大丈夫です。
        </p>
        <p className="mt-2 max-w-2xl font-body leading-relaxed text-ink-muted md:mx-auto">
          どんな一日にしたいか、どう残したいか
          <br />
          そこから一緒に考えていきませんか？
        </p>
        <div className="mt-6 flex flex-wrap gap-3 md:justify-center">
          <Link
            href="/book"
            className="font-display hidden min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-opacity hover:opacity-80 md:inline-flex"
          >
            まず相談する
          </Link>
        </div>
      </div>
      {/* /book 以外でのみレンダリングされるため、このボーダーも条件付きで全幅に引かれる */}
      <div className="border-t-[1.5px] border-hairline" />
    </>
  );
}
