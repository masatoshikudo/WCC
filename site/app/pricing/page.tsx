import type { CSSProperties } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { HomePricingSection } from "@/components/home/HomePricingSection";
import { HomeServiceFlowSection } from "@/components/home/HomeServiceFlowSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { getHomeFaqJsonLd } from "@/lib/home-faq";
import {
  HOME_CONTENT_INNER_COLUMN_CLASS,
  HOME_FAQ_SECTION_OUTER_CLASS,
} from "@/lib/layout/home-sections";

export const metadata: Metadata = {
  title: "料金プラン | For Your Wedding Day",
  description:
    "For Your Wedding Day の料金プラン。6時間撮影・24時間納品・9:16 縦動画 2 本のパッケージ詳細、サービスの流れ、よくある質問をまとめています。",
};

const SECTION_H2_CLASS =
  "mx-auto max-w-4xl text-center font-display text-[clamp(2rem,4.2vw,4rem)] leading-[1.12] text-ink";
const SECTION_H2_STYLE: CSSProperties = { letterSpacing: "-0.03em" };

const FAQ_JSON_LD = getHomeFaqJsonLd();

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      {/* ページヘッダー帯 */}
      <section className="w-full border-b border-hairline bg-canvas px-4 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-sm uppercase tracking-[0.15em] text-ink-muted">
              Pricing
            </p>
            <h1
              className="mt-4 font-heading font-light text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] text-ink"
              style={{ letterSpacing: "0.02em" }}
              lang="ja"
            >
              料金プラン
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-ink-muted">
              6時間の同行撮影、当日中〜翌日納品。
              <br />
              ご相談は無料・日程未定でも受け付けています。
            </p>
            <div className="mt-8">
              <Link
                href="/book"
                className="font-display inline-flex min-h-[52px] min-w-[200px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-opacity hover:opacity-80"
              >
                まず相談する
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomePricingSection
        sectionH2ClassName={SECTION_H2_CLASS}
        sectionH2Style={SECTION_H2_STYLE}
      />

      <HomeServiceFlowSection
        sectionH2ClassName={SECTION_H2_CLASS}
        sectionH2Style={SECTION_H2_STYLE}
      />

      <div className={HOME_FAQ_SECTION_OUTER_CLASS}>
        <HomeFaqSection
          sectionH2ClassName={SECTION_H2_CLASS}
          sectionH2Style={SECTION_H2_STYLE}
        />
      </div>
    </>
  );
}
