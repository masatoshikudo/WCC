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
              ウェディング
              <br />
              コンテンツ
              <br />
              とは
            </h2>
            <div className="flex flex-col gap-8">
              <p className="font-body text-base leading-relaxed text-ink-muted">
              結婚式当日の空気を、スマホで見やすい縦型動画として残すものです
              <br />
              翌日、ふたりで「昨日、いい一日だったね」と見返したり
              <br />
              当日来られなかったご友人やご家族へ
              <br />
              ふたりらしい一日を届けたり
              <br />
              大切な一日を、もっと早く、もっと身近に
              <br />
              その日の気持ちに近いまま、ふたりの手元へお届けします
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
