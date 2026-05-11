import Link from "next/link";
import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";

export function HomeWhatIsSection() {
  return (
    <section
      id="service-detail"
      className="w-full scroll-mt-24 border-t-[1.5px] border-hairline bg-canvas pt-32 pb-32 md:pt-48 md:pb-48"
    >
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
            <h2
              className="font-heading font-normal text-[clamp(2rem,5vw,4rem)] leading-[1.12] text-ink"
              style={{ letterSpacing: "0.02em" }}
              lang="ja"
            >
              ウェディングコンテンツ
              <br />
              とは
            </h2>
            <div className="flex flex-col gap-8">
              <p className="font-body text-base leading-relaxed text-ink-muted">
                式の翌朝、ふたりで見返せる動画は、手元にありますか
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
                写真が届くまでの数週間
                <br />
                ムービーが届くまでの数ヶ月
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
                その前に、当日の空気をもう一度見返せるように
                <br />
                余韻が一番濃い時間のうちに、ふたりの手元へ届ける動画です
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 font-body text-xs uppercase tracking-[0.12em] text-ink hover:opacity-70"
              >
                LEARN MORE <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
