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
    "結婚式当日の縦動画パッケージ。標準 165,000 円（税込）から。追加オプション・オーダーメイドプランもご用意。6時間撮影・24時間納品・9:16 縦動画 2 本。",
};

const EXTRAS = [
  {
    name: "撮影時間延長",
    price: "+33,000 円 / 1 時間",
    note: "標準 6 時間に追加",
  },
  {
    name: "追加編集動画（9:16 縦動画）",
    price: "+33,000 円 / 1 本",
    note: "標準 2 本以上の編集",
  },
  {
    name: "遠方出張費",
    price: "実費 + 11,000 円",
    note: "関東圏外への出張対応（交通費・宿泊費別）",
  },
] as const;

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

      {/* Extras セクション */}
      <section className="w-full border-t border-hairline bg-canvas">
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
          <div className="mx-auto max-w-5xl py-32 md:py-48">
            <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
              <div>
                <p className="font-display text-sm uppercase tracking-[0.15em] text-ink-muted">
                  Extras
                </p>
                <h2
                  className="mt-4 font-heading font-normal text-[clamp(2rem,4vw,3.5rem)] leading-[1.12] text-ink"
                  style={{ letterSpacing: "0.02em" }}
                  lang="ja"
                >
                  追加オプション
                </h2>
              </div>
              <div>
                <ul>
                  {EXTRAS.map((item) => (
                    <li
                      key={item.name}
                      className="border-t border-hairline py-5 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-body text-base text-ink">
                          {item.name}
                        </span>
                        <span className="shrink-0 font-body text-base tabular-nums text-ink">
                          {item.price}
                        </span>
                      </div>
                      <p className="mt-1 font-body text-sm leading-relaxed text-ink-muted">
                        {item.note}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 font-body text-xs leading-relaxed text-ink-muted">
                  ※ 価格はすべて税込です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bespoke セクション */}
      <section className="w-full border-t border-hairline bg-canvas">
        <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
          <div className="mx-auto max-w-5xl py-32 md:py-48">
            <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
              <div>
                <p className="font-display text-sm uppercase tracking-[0.15em] text-ink-muted">
                  Bespoke
                </p>
                <h2
                  className="mt-4 font-heading font-normal text-[clamp(2rem,4vw,3.5rem)] leading-[1.12] text-ink"
                  style={{ letterSpacing: "0.02em" }}
                  lang="ja"
                >
                  オーダーメイド
                  <br />
                  プラン
                </h2>
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-display text-3xl font-semibold tabular-nums text-ink">
                  220,000 円
                  <span className="ml-1 align-baseline text-sm font-medium text-ink-muted">
                    （税込）〜
                  </span>
                </p>
                <p className="font-body text-base leading-relaxed text-ink-muted">
                  定型プランに収まらないご要望にも対応いたします。
                </p>
                <p className="font-body text-base leading-relaxed text-ink-muted">
                  2 日間にわたる撮影、海外挙式、企業イベント、その他特殊なご要件があれば、まずはご相談ください。お話を伺い、お二人専用のプランをお見積もりします。
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/book"
                    className="font-display inline-flex min-h-[52px] min-w-[200px] items-center justify-center self-start rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-opacity hover:opacity-80"
                  >
                    まず相談する
                  </Link>
                  <p className="font-body text-xs leading-relaxed text-ink-muted">
                    日程が未定でもご相談いただけます
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
