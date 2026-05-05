import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { HomeHeroSection } from "@/components/marketing/HomeHeroSection";
import { HomeHighlightsSection } from "@/components/marketing/HomeHighlightsSection";
import { HomePricingSectionSkeleton } from "@/components/home/HomeDynamicSkeletons";
import { HOME_ANCHOR_HREF } from "@/lib/site-links";
import {
  HOME_CONTENT_INNER_COLUMN_CLASS,
  HOME_WHAT_IS_WCC_VERT_PAD_CLASS,
} from "@/lib/layout/home-sections";
import { cn } from "@/lib/utils/cn";

const HomePricingSection = dynamic(
  () => import("@/components/home/HomePricingSection").then((m) => m.HomePricingSection),
  { loading: () => <HomePricingSectionSkeleton /> },
);

/** トップ各セクションの H2 */
const SECTION_H2_CLASS =
  "mx-auto max-w-4xl text-center font-display text-[clamp(2rem,4.2vw,4rem)] leading-[1.12] text-ink";
const SECTION_H2_STYLE: CSSProperties = { letterSpacing: "-0.03em" };

export default function HomePage() {
  return (
    <>
      <HomeHeroSection />

      <HomeHighlightsSection />

      <section id="service-detail" className="w-full scroll-mt-48 mt-24 pt-40 pb-40 bg-canvas md:mt-56 md:pt-48 md:pb-48">
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
          <div className="mx-auto max-w-5xl">
            <h2 className={SECTION_H2_CLASS} style={SECTION_H2_STYLE}>
              結婚式のステキな瞬間を、
              <br />
              翌日にはシェアできる。
            </h2>

            <div className="mt-14 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-12">
              <p className="font-body text-base leading-relaxed text-ink-muted">
                Wedding Content Creatorは、演出ではなく当日その場の高まりをそのまま縦型のショート動画へ仕立てるサービスです。軽やかに流れる一本は、見返すたびにあの日の空気がよみがえり、気分が上がる記録になります。
              </p>

              <p className="font-body text-base leading-relaxed text-ink-muted">
                納品は、SNSにそのまま使える9:16の縦動画です。ハイライトは当日中から翌日を目安にお届けするため、ご家族やゲストともすぐ共有できます。
                <Link href={HOME_ANCHOR_HREF.serviceDetail} className="ml-2 inline-block underline underline-offset-4 hover:opacity-70">
                  サービス詳細
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <section
          id="what-is-wcc"
          data-test="page-section"
          className={cn(
            "scroll-mt-48 mt-0 md:mt-0",
            HOME_WHAT_IS_WCC_VERT_PAD_CLASS,
          )}
        >
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-20 md:grid-cols-2 md:items-center md:gap-24 lg:gap-32">
              <h2
                lang="en"
                className="mx-auto max-w-xl text-center font-heading text-[clamp(2rem,4.2vw,4rem)] leading-[1.12] text-ink md:mx-0 md:text-left"
                style={SECTION_H2_STYLE}
              >
                Wedding Content Creator?
              </h2>
              <div className="flex min-w-0 flex-col gap-12 text-center md:text-left">
                <p className="font-body text-base leading-relaxed text-ink-muted">
                  Wedding Content Creator（以下、WCC）は、結婚式当日におふたりのそばで取材する担当です。iPhoneで式の流れを記録し、あとから見て情景がつながる短い映像に編集します。
                </p>
                <p className="font-body text-base leading-relaxed text-ink-muted">
                  大掛かりな演出を組み立てる役割ではなく、近い距離から拾った表情やゲストの反応を、一本の流れとして立ち上げます。プロの本編ムービーとは役割が異なり、当日の空気を手軽に残したい方向けの記録です。
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <HomePricingSection
        sectionH2ClassName={SECTION_H2_CLASS}
        sectionH2Style={SECTION_H2_STYLE}
        compact
      />
    </>
  );
}
