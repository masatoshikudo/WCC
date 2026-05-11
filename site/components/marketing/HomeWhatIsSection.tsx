import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";

export function HomeWhatIsSection() {
  return (
    <section
      id="service-detail"
      className="w-full scroll-mt-24 border-t-[1.5px] border-hairline bg-canvas pt-32 pb-32 md:pt-48 md:pb-48"
    >
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-center md:gap-24 lg:gap-32">
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
                ウェディングコンテンツとは
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
                写真や本編ムービーが届くまでのあいだ
                <br />
                結婚式当日の様子を
                <br />
                ふたりで見返したり
                <br />
                列席できなかった友人やご家族へ届けたりできるように
                <br />
                スマホで見やすい縦型動画として
                <br />
                ふたりの手元へ届けるものです
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
                その前に、当日の空気をもう一度見返せるように
                <br />
                余韻が一番濃い時間のうちに、ふたりの手元へ届ける動画です
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
