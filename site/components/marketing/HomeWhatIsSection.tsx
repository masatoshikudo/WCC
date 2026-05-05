import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";

export function HomeWhatIsSection() {
  return (
    <section
      id="service-detail"
      className="w-full scroll-mt-24 border-t border-hairline bg-canvas pt-32 pb-32 md:pt-48 md:pb-48"
    >
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
            <h2
              className="font-heading font-normal text-[clamp(2rem,5vw,4rem)] leading-[1.12] text-ink md:sticky md:top-32"
              style={{ letterSpacing: "0.02em" }}
              lang="ja"
            >
              ウェディング
              <br />
              コンテンツとは
            </h2>
            <div className="flex flex-col gap-8">
              <p className="font-body text-base leading-relaxed text-ink-muted">
                Wedding Content Creatorは、演出ではなく当日その場の高まりをそのまま縦型のショート動画へ仕立てるサービスです。軽やかに流れる一本は、見返すたびにあの日の空気がよみがえり、気分が上がる記録になります。
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
                納品は、SNSにそのまま使える9:16の縦動画です。ハイライトは当日中から翌日を目安にお届けするため、ご家族やゲストともすぐ共有できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
