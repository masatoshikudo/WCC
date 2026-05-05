import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { HomeHeroSection } from "@/components/marketing/HomeHeroSection";
import { HomeHighlightsSection } from "@/components/marketing/HomeHighlightsSection";
import { HomeWhatIsSection } from "@/components/marketing/HomeWhatIsSection";
import { HomeDoINeedSection } from "@/components/marketing/HomeDoINeedSection";
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

      <HomeHighlightsSection />

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
