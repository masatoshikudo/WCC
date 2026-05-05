"use client";

import Link from "next/link";
import { useState } from "react";

import { HOME_ANCHOR_HREF } from "@/lib/site-links";

const nav = [
  { href: HOME_ANCHOR_HREF.pricing, label: "価格" },
  { href: HOME_ANCHOR_HREF.highlights, label: "ギャラリー" },
] as const;

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="relative h-20 shrink-0 border-b border-hairline bg-canvas md:h-24">
      <div className="mx-auto flex h-full w-full max-w-content items-center justify-between gap-4 px-5 md:px-8 lg:px-12">
        <Link
          href="/"
          className="font-heading text-sm font-medium tracking-[0.04em] text-ink md:text-base"
          onClick={closeMenu}
        >
          For Your Wedding Day
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-7 md:flex lg:gap-9" aria-label="メイン">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:text-accent focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:inline-flex"
            aria-label="Instagram"
          >
            <img
              src="/icons/instagram-brands-solid-full.svg"
              alt=""
              aria-hidden="true"
              className="h-8 w-8"
            />
          </a>
          <a
            href="https://www.threads.net/"
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:inline-flex"
            aria-label="Threads"
          >
            <img
              src="/icons/threads-brands-solid-full.svg"
              alt=""
              aria-hidden="true"
              className="h-8 w-8"
            />
          </a>
          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:inline-flex"
            aria-label="TikTok"
          >
            <img
              src="/icons/tiktok-brands-solid-full.svg"
              alt=""
              aria-hidden="true"
              className="h-8 w-8"
            />
          </a>
          <Link
            href="/book"
            className="font-display hidden min-h-[52px] min-w-[52px] items-center justify-center rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:inline-flex"
            onClick={closeMenu}
          >
            まず相談する
          </Link>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="メニューを開閉"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <img
              src="/icons/bars-solid-full.svg"
              alt=""
              aria-hidden="true"
              className="h-7 w-7"
            />
            <span className="sr-only">{isMenuOpen ? "閉じる" : "メニュー"}</span>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-menu"
          className="absolute left-0 top-20 z-20 w-full border-b border-white/20 bg-bg-dark md:hidden"
          aria-label="モバイルメイン"
        >
          <div className="mx-auto flex w-full max-w-content flex-col px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-display min-h-[44px] py-2 text-sm font-semibold text-text-on-dark underline-offset-4 transition-colors hover:text-footer-nav-link hover:underline focus-visible:text-footer-nav-link focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="font-display mt-3 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent px-6 text-xs font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={closeMenu}
            >
              まず相談する
            </Link>
            <div className="mt-2 flex items-center gap-3 border-t border-white/20 pt-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label="Instagram"
              >
                <img
                  src="/icons/instagram-brands-solid-full.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-8 invert"
                />
              </a>
              <a
                href="https://www.threads.net/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label="Threads"
              >
                <img
                  src="/icons/threads-brands-solid-full.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-8 invert"
                />
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label="TikTok"
              >
                <img
                  src="/icons/tiktok-brands-solid-full.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-8 invert"
                />
              </a>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
