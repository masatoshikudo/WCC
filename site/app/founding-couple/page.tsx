import type { Metadata } from "next";
import { InstagramThumbnailCardList } from "@/components/embeds/InstagramEmbed";
import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";
import { RECEPTION_COPY } from "@/lib/reception";

export const metadata: Metadata = {
  title: "Founding Couple | For Your Wedding Day",
  description:
    "2026年8〜10月挙式のカップルから、Founding Couple 2組を募集。スタンダードプラン（176,000円・税込）を無償でご提供。",
};

const INSTAGRAM_DM_URL = "https://ig.me/m/foryour_weddingday";

/** GALLERY に並べる実績 Reel のサムネイルカード（将来は配列に追加するだけで増やせる） */
const GALLERY_REELS = [
  {
    reelUrl: "https://www.instagram.com/reel/DLXNT3kh9ed/",
    imageSrc: "/thumbnail.jpg",
    alt: "ウェディング映像サンプル（Instagramで見る）",
  },
];

export default function FoundingCouplePage() {
  return (
    <>
      {/* ページヘッダー帯 */}
      <section className="section-hero w-full bg-canvas px-4 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-sm uppercase tracking-[0.15em] text-ink-muted">
              Founding Couple
            </p>
            <h1
              className="mt-4 font-heading font-light text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] text-ink"
              style={{ letterSpacing: "0.02em" }}
              lang="ja"
            >
              最初のおふたりへ
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-ink-muted">
              {RECEPTION_COPY.generalHeadline}
              <br />
              {RECEPTION_COPY.foundingCouple}
            </p>
            <div className="mt-8">
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display inline-flex min-h-[52px] min-w-[200px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Instagram で相談する
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 特典セクション */}
      <section className="section-benefits w-full border-t-[1.5px] border-hairline bg-canvas">
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
          <div className="mx-auto max-w-5xl py-32 md:py-48">
            <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
              <div>
                <p className="font-display text-sm uppercase tracking-[0.15em] text-ink-muted">
                  What you get
                </p>
                <h2
                  className="mt-4 font-heading font-normal text-[clamp(2rem,4vw,3.5rem)] leading-[1.12] text-ink"
                  style={{ letterSpacing: "0.02em" }}
                  lang="ja"
                >
                  特典
                </h2>
              </div>
              <ul className="flex flex-col divide-y-[1.5px] divide-hairline border-y-[1.5px] border-hairline">
                {[
                  "スタンダードプラン（通常 176,000 円・税込）を無償でご提供",
                  "撮影当日の縦動画 2 本を 24 時間以内に納品",
                ].map((item) => (
                  <li key={item} className="py-5 font-body text-base leading-relaxed text-ink-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 募集条件セクション */}
      <section className="section-requirements w-full border-t-[1.5px] border-hairline bg-canvas">
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
          <div className="mx-auto max-w-5xl py-32 md:py-48">
            <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
              <div>
                <p className="font-display text-sm uppercase tracking-[0.15em] text-ink-muted">
                  Requirements
                </p>
                <h2
                  className="mt-4 font-heading font-normal text-[clamp(2rem,4vw,3.5rem)] leading-[1.12] text-ink"
                  style={{ letterSpacing: "0.02em" }}
                  lang="ja"
                >
                  募集条件
                </h2>
              </div>
              <ul className="flex flex-col divide-y-[1.5px] divide-hairline border-y-[1.5px] border-hairline">
                {[
                  "2026 年 8 月〜10 月に挙式予定のカップル",
                  "Founding Couple は期間全体で 2 組限定",
                  "サイトや SNS で作例としてご紹介させていただけること",
                  "Instagram DM で気軽にやり取りができること",
                ].map((item) => (
                  <li key={item} className="py-5 font-body text-base leading-relaxed text-ink-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY セクション */}
      <section className="section-gallery w-full border-t-[1.5px] border-hairline bg-canvas">
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
          <div className="mx-auto max-w-5xl py-32 md:py-48">
            <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
              <div>
                <p className="font-display text-sm uppercase tracking-[0.15em] text-ink-muted">
                  Gallery
                </p>
                <h2
                  className="mt-4 font-heading font-normal text-[clamp(2rem,4vw,3.5rem)] leading-[1.12] text-ink"
                  style={{ letterSpacing: "0.02em" }}
                  lang="ja"
                >
                  作例
                </h2>
                <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-ink-muted">
                  実際にお届けする縦動画のイメージを Instagram でご覧いただけます
                </p>
              </div>
              <div>
                <InstagramThumbnailCardList items={GALLERY_REELS} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 応募 CTA セクション */}
      <section className="section-cta w-full border-t-[1.5px] border-hairline bg-canvas">
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
          <div className="mx-auto max-w-2xl py-32 text-center md:py-48">
            <p className="font-display text-sm uppercase tracking-[0.15em] text-ink-muted">
              応募方法
            </p>
            <h2
              className="mt-4 font-heading font-normal text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.12] text-ink"
              style={{ letterSpacing: "0.02em" }}
              lang="ja"
            >
              Instagram DM で
              <br />
              気軽に話しかけて
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-ink-muted">
              フォームなし、面倒な手続きなし
              <br />
              @foryour_weddingday にメッセージを送るだけ
            </p>
            <div className="mt-8">
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display inline-flex min-h-[52px] min-w-[240px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Instagram でメッセージを送る
              </a>
            </div>
            <p className="mt-4 font-body text-sm text-ink-muted">
              @foryour_weddingday
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
