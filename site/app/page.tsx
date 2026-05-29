import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { HomeHeroSection } from "@/components/marketing/HomeHeroSection";
// import { HomeHighlightsSection } from "@/components/marketing/HomeHighlightsSection";
import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";
import { HomeWhatIsSection } from "@/components/marketing/HomeWhatIsSection";
import { HomeDoINeedSection } from "@/components/marketing/HomeDoINeedSection";
import { RECEPTION_COPY } from "@/lib/reception";
import { HomePricingSectionSkeleton } from "@/components/home/HomeDynamicSkeletons";

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

      {/* <HomeHighlightsSection /> */}
      <section className="w-full border-t-[1.5px] border-hairline bg-canvas">
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
          <div className="mx-auto max-w-2xl py-24 text-center md:py-32">
            <p className="font-display text-sm uppercase tracking-[0.15em] text-ink-muted">
              Founding Couple
            </p>
            <h2
              className="mt-4 font-heading font-normal text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.12] text-ink"
              style={{ letterSpacing: "0.02em" }}
              lang="ja"
            >
              {RECEPTION_COPY.generalHeadline}
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-ink-muted">
              {RECEPTION_COPY.receptionPeriod}
              <br />
              {RECEPTION_COPY.capacityNote}
            </p>
            <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-ink-muted">
              {RECEPTION_COPY.foundingCouple}
            </p>
            <div className="mt-8">
              <Link
                href="/founding-couple"
                className="font-display inline-flex min-h-[52px] min-w-[200px] items-center justify-center rounded-full border border-ink px-8 text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                詳しくはこちら
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeWhatIsSection />

      <HomeDoINeedSection />

      <HomePricingSection
        sectionH2ClassName={SECTION_H2_CLASS}
        sectionH2Style={SECTION_H2_STYLE}
        compact
      />
    </>
  );
}
