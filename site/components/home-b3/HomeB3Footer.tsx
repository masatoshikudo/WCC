import Image from "next/image";
import Link from "next/link";

import { LEGAL_PAGE_HREF } from "@/lib/site-links";

/** B3 デザインのフッター（トップ・ご相談ページ） */
export function HomeB3Footer() {
  return (
    <footer className="hb3-footer">
      <div className="wrap">
        <div className="ft">
          <Link href="/" className="ft-logo" aria-label="For Your Wedding Day トップへ">
            <Image src="/Footer_FYWD_logo.png" alt="For Your Wedding Day" width={1600} height={1772} />
          </Link>
          <nav aria-label="法務情報">
            <Link href={LEGAL_PAGE_HREF.tokushoho}>特定商取引法に基づく表記</Link>
            <Link href={LEGAL_PAGE_HREF.privacy}>プライバシーポリシー</Link>
            <Link href={LEGAL_PAGE_HREF.terms}>利用規約</Link>
          </nav>
        </div>
        <p className="copy">© {new Date().getFullYear()} For Your Wedding Day. All rights reserved.</p>
      </div>
    </footer>
  );
}
