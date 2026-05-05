import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { HomeHighlightLazyVideo } from "@/components/home/HomeHighlightLazyVideo";
import {
  HeroHighlightCarouselLoading,
  HomeFaqSectionSkeleton,
  HomePricingSectionSkeleton,
  HomeServiceFlowSectionSkeleton,
} from "@/components/home/HomeDynamicSkeletons";
import { getHomeFaqJsonLd } from "@/lib/home-faq";
import { HOME_HIGHLIGHT_VIDEO_SLIDES } from "@/lib/home-highlight-videos";
import { HOME_ANCHOR_HREF } from "@/lib/site-links";
import {
  HOME_CONTENT_INNER_COLUMN_CLASS,
  HOME_FAQ_SECTION_OUTER_CLASS,
  HOME_WHAT_IS_WCC_VERT_PAD_CLASS,
} from "@/lib/layout/home-sections";
import {
  MOBILE_HERO_MAIN_HEIGHT_CSS,
  MOBILE_STICKY_LAYOUT_BOTTOM_PAD_CLASS,
} from "@/lib/layout/mobile-dock";
import { cn } from "@/lib/utils/cn";

const HeroHighlightCarousel = dynamic(
  () => import("@/components/home/HeroHighlightCarousel").then((m) => m.HeroHighlightCarousel),
  { loading: () => <HeroHighlightCarouselLoading /> },
);

const HomePricingSection = dynamic(
  () => import("@/components/home/HomePricingSection").then((m) => m.HomePricingSection),
  { loading: () => <HomePricingSectionSkeleton /> },
);

const HomeServiceFlowSection = dynamic(
  () => import("@/components/home/HomeServiceFlowSection").then((m) => m.HomeServiceFlowSection),
  { loading: () => <HomeServiceFlowSectionSkeleton /> },
);

const HomeFaqSection = dynamic(
  () => import("@/components/home/HomeFaqSection").then((m) => m.HomeFaqSection),
  { loading: () => <HomeFaqSectionSkeleton /> },
);

const HOME_FAQ_JSON_LD = getHomeFaqJsonLd();

/** ヒーロー見出し・リード（動画の上でも読めるキャンバス光彩＋弱いインク） */
const HERO_TEXT_SHADOW_CLASS =
  "[text-shadow:0_0_48px_rgb(var(--color-canvas-rgb)_/_0.4),0_0_96px_rgb(var(--color-canvas-rgb)_/_0.3),0_1px_3px_rgb(32_38_32_/_0.25)]";

/** トップ各セクションの H2（DESIGN.md §5.3 と整合） */
const SECTION_H2_CLASS =
  "mx-auto max-w-4xl text-center font-display text-[clamp(2rem,4.2vw,4rem)] leading-[1.12] text-ink";
const SECTION_H2_STYLE: CSSProperties = { letterSpacing: "-0.03em" };

/** `#service-detail` 背景（DESIGN.md §4.0 `--color-canvas-subtle`）— ルートを全幅にし本項のみ変更しやすくする */
const SERVICE_DETAIL_SECTION_BG_CLASS = "bg-canvas-subtle";

/** `#service-detail` 外枠: ビューポート幅の帯＋区切り・縦余白（`#what-is-wcc` と同じ縦リズム）。SP は `#hero` 下端リザーブと役割が重なるため上マージンを抑える */
const SERVICE_DETAIL_SECTION_ROOT_CLASS = cn(
  "w-full scroll-mt-48 mt-24 pt-40 pb-40 md:mt-56 md:pt-48 md:pb-48",
  SERVICE_DETAIL_SECTION_BG_CLASS,
);

/** `#highlights` — フッターと同じ帯。余白は `margin` にせず `padding`（マージンは背景が塗られない） */
const HIGHLIGHTS_SECTION_ROOT_CLASS = cn(
  "w-full scroll-mt-24 border-t border-white/20 bg-bg-dark",
  /** 旧 `mt-16 pt-16` をパディングに統合。下は旧 `#what-is-wcc` の上マージン分をダーク帯で確保 */
  "pt-32 pb-48 md:pb-56",
);

/** ダーク帯上の H2（`SECTION_H2_CLASS` の色だけ `text-white` に差し替え） */
const HIGHLIGHTS_SECTION_H2_CLASS =
  "mx-auto max-w-4xl text-center font-display text-[clamp(2rem,4.2vw,4rem)] leading-[1.12] text-white";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_FAQ_JSON_LD) }}
      />
      {/* ヒーローは max-w の外（main 直下）に置き、背面は 100% 幅。SP: ヘッダー下〜下端の範囲でテキストを縦中央（下は固定CTA用に pb）、md+ で 800px 揃え */}
      <section
        id="hero"
        className={cn(
          "scroll-mt-24 relative isolate flex w-full min-h-[calc(100svh-5rem)] flex-col justify-center pt-0 md:min-h-[max(36rem,78svh)] md:py-10 lg:min-h-[calc(100svh-5rem)] lg:py-12",
          MOBILE_STICKY_LAYOUT_BOTTOM_PAD_CLASS,
        )}
      >
        <div className="relative z-10 mx-auto w-full max-w-content px-4 md:px-6 lg:px-8">
          <div className="animate-fade-up relative box-border flex w-full max-w-[800px] flex-col gap-8 rounded-3xl [animation-delay:120ms] p-6 sm:p-10 md:min-h-[800px] md:p-[150px]">
            <div className="relative z-10 flex flex-col gap-8">
              <h1
                className={cn(
                  "font-body text-[clamp(2.35rem,5vw,4.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-ink",
                  HERO_TEXT_SHADOW_CLASS,
                )}
                lang="ja"
              >
                翌朝、ふたりで観る、
                <br />
                昨日のすべて。
              </h1>
              <div className="flex flex-col gap-3">
                <p className={cn("font-body text-lg leading-relaxed text-ink", HERO_TEXT_SHADOW_CLASS)}>
                  結婚式の翌朝、コーヒーを淹れて。
                  <br />
                  その日のうちに届く、ふたりだけの縦動画。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-0 flex flex-col overflow-x-hidden py-0 md:py-10"
          aria-hidden="true"
        >
          {/* SP: 高さを「ヘッダー下〜ドック上」のメイン矩形に固定し、その中で動画を縦中央。md+ は従来どおり flex-1 でセンター */}
          <div
            className={cn(
              "flex w-full flex-col md:min-h-0 md:flex-1 md:justify-center",
              "max-md:h-[var(--mobile-hero-main-h)] max-md:min-h-0 max-md:max-h-[var(--mobile-hero-main-h)] max-md:flex-none max-md:justify-center",
            )}
            style={
              {
                "--mobile-hero-main-h": MOBILE_HERO_MAIN_HEIGHT_CSS,
              } as CSSProperties
            }
          >
            <HeroHighlightCarousel />
          </div>
        </div>
        {/* 動画レイヤー全面の薄いベール（z-0 より上・コピー z-10 より下。backdrop は使わず色面のみ） */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-canvas/25"
          aria-hidden="true"
        />
      </section>

      <section id="service-detail" className={SERVICE_DETAIL_SECTION_ROOT_CLASS}>
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

      <section id="highlights" className={HIGHLIGHTS_SECTION_ROOT_CLASS}>
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <h2 className={HIGHLIGHTS_SECTION_H2_CLASS} style={SECTION_H2_STYLE}>
          その日の空気を
          <br />
          そのまま
        </h2>
        <p className="mx-auto mt-6 max-w-4xl text-center font-body text-base leading-relaxed text-white/80 md:mt-8">
        その日の空気をそのまま残した縦型コンテンツ動画と、実際の新郎新婦の声をまとめています
          <br />
          あの一日の高まりが、どんな形で残るのかをご覧ください
        </p>
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
          {(
            [
              {
                couple: "K・Y 様",
                venue: "東京都内（会場名非公開）",
                description:
                  "「披露宴後すぐに家族へ共有できました。自然な空気感がそのまま残っていて安心しました。」",
                credit: "2025年秋婚 / 東京都",
              },
              {
                couple: "M・R 様",
                venue: "神奈川県内（会場名非公開）",
                description:
                  "「フォト・ムービーと役割が分かれていたので、記録用とSNS用をどちらも無理なく残せました。」",
                credit: "2026年春婚 / 神奈川県",
              },
              {
                couple: "Lucy and Chris",
                venue: "The Post Barn, Newbury, UK",
                description:
                  "「短い動画でも流れが自然で、スマホで何度も見返したくなりました。」",
              },
              {
                couple: "Sophie & Daniel",
                venue: "Villa Balbiano, Lake Como, Italy",
                description:
                  "「景色と余韻が、一本の縦動画にまとまって届くのがうれしかったです。」",
              },
              {
                couple: "Taylor Morgan",
                venue: "New York City Loft Wedding",
                description:
                  "「準備から祝宴まで、縦型でも臨場感が伝わるとゲストにも好評でした。」",
              },
              {
                couple: "Amelia & George",
                venue: "Cotswolds Barn Celebration, UK",
                description:
                  "「屋外と屋内の切り替えがスムーズで、すぐ共有できて助かりました。」",
              },
            ] as const
          ).map((item, index) => {
            const slide = HOME_HIGHLIGHT_VIDEO_SLIDES[index];
            const credit = "credit" in item ? item.credit : undefined;
            return (
            <article key={`highlight-${index}`} className="p-3 animate-fade-up" style={{ animationDelay: `${index * 120}ms` }}>
              <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem]">
                {slide ? (
                  <HomeHighlightLazyVideo slide={slide} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="font-display text-[10px] font-semibold uppercase tracking-[0.1em] text-white/80">9:16</p>
                  </div>
                )}
              </div>
              <div className="mt-3 px-4 py-4 text-center">
                <p className="font-body text-sm font-semibold text-white/80">{item.couple}</p>
                <h4 className="mt-1 font-display text-base font-semibold text-white/80">{item.venue}</h4>
                <p className="mt-2 font-body text-sm leading-relaxed text-white/80">{item.description}</p>
                {credit ? (
                  <p className="mt-2 font-body text-xs leading-relaxed text-white/60">{credit}</p>
                ) : null}
              </div>
            </article>
            );
          })}
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

      <HomePricingSection sectionH2ClassName={SECTION_H2_CLASS} sectionH2Style={SECTION_H2_STYLE} />

      <HomeServiceFlowSection sectionH2ClassName={SECTION_H2_CLASS} sectionH2Style={SECTION_H2_STYLE} />

      <div className={HOME_FAQ_SECTION_OUTER_CLASS}>
        <HomeFaqSection sectionH2ClassName={SECTION_H2_CLASS} sectionH2Style={SECTION_H2_STYLE} />
      </div>
    </>
  );
}
