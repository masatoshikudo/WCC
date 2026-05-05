import Link from "next/link";
import { LEGAL_PAGE_HREF } from "@/lib/site-links";
import { FooterCtaSection } from "@/components/layout/FooterCtaSection";

const FOOTER_NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/pricing", label: "PRICING" },
  { href: "/book", label: "CONTACT" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto w-full max-w-content px-4 pt-40 pb-16 md:px-6 md:pt-48 md:pb-20 lg:px-8">
        <FooterCtaSection />

        {/* ブランドブロック */}
        <div className="mt-24 flex flex-col items-center gap-8 text-center md:mt-28 lg:mt-32">
          <p
            className="font-heading font-normal text-[1.35rem] leading-snug text-ink md:text-[1.5rem]"
            style={{ letterSpacing: "0.02em" }}
          >
            For Your Wedding Day
          </p>

          <p className="max-w-xs font-body text-sm leading-relaxed text-ink-muted">
            結婚式の翌朝に届ける、
            <br />
            ふたりだけの縦動画。
          </p>

          <nav aria-label="フッターナビゲーション">
            <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.15em] text-ink">
              Useful Links
            </p>
            <ul className="flex flex-col gap-2">
              {FOOTER_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-ink underline-offset-4 transition-opacity hover:opacity-70 hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 法務情報 */}
        <div className="mt-16 border-t border-hairline pt-8 md:mt-20 md:text-center">
          <p className="font-body text-sm text-ink-muted">
            © {new Date().getFullYear()} For Your Wedding Day. All rights reserved.
          </p>
          <nav className="mt-4 flex flex-wrap items-center gap-4 md:justify-center" aria-label="フッター法務リンク">
            <Link
              href={LEGAL_PAGE_HREF.tokushoho}
              className="font-body text-sm text-ink-muted underline-offset-4 transition-opacity hover:opacity-70 hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              特定商取引法に基づく表記
            </Link>
            <Link
              href={LEGAL_PAGE_HREF.privacy}
              className="font-body text-sm text-ink-muted underline-offset-4 transition-opacity hover:opacity-70 hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              プライバシーポリシー
            </Link>
            <Link
              href={LEGAL_PAGE_HREF.terms}
              className="font-body text-sm text-ink-muted underline-offset-4 transition-opacity hover:opacity-70 hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              利用規約
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
