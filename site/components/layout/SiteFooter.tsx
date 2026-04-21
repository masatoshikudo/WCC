import Link from "next/link";
import { LEGAL_PAGE_HREF } from "@/lib/site-links";
import { FooterCtaSection } from "@/components/layout/FooterCtaSection";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/20 bg-bg-dark">
      <div className="mx-auto w-full max-w-content px-4 py-40 md:px-6 md:py-48 lg:px-8 lg:py-56">
        <FooterCtaSection />
        <p className="mt-24 font-body text-sm text-footer-muted md:mt-28 md:text-center lg:mt-32">
          © {new Date().getFullYear()} Wedding Content Creator. All rights
          reserved.
        </p>
        <nav className="mt-4 flex flex-wrap items-center gap-4 md:justify-center" aria-label="フッター法務リンク">
          <Link
            href={LEGAL_PAGE_HREF.tokushoho}
            className="font-body text-sm text-footer-nav-link underline-offset-4 transition-colors hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            特定商取引法に基づく表記
          </Link>
          <Link
            href={LEGAL_PAGE_HREF.privacy}
            className="font-body text-sm text-footer-nav-link underline-offset-4 transition-colors hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            プライバシーポリシー
          </Link>
          <Link
            href={LEGAL_PAGE_HREF.terms}
            className="font-body text-sm text-footer-nav-link underline-offset-4 transition-colors hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            利用規約
          </Link>
        </nav>
      </div>
    </footer>
  );
}
