import type { CSSProperties } from "react";
import Link from "next/link";

import {
  HOME_CONTENT_INNER_COLUMN_CLASS,
  HOME_WHAT_IS_WCC_VERT_PAD_CLASS,
} from "@/lib/layout/home-sections";
import { WCC_PACKAGE_PLANS, WCC_STANDARD_PACKAGE_DISCLAIMER } from "@/lib/plans";
import { cn } from "@/lib/utils/cn";

const PRICING_SECTION_ROOT_CLASS = cn(
  "w-full scroll-mt-48 mt-24 border-t border-hairline pt-40 pb-0 md:mt-28 md:pt-48 md:pb-48",
  "bg-canvas",
);

type HomePricingSectionProps = {
  sectionH2ClassName: string;
  sectionH2Style: CSSProperties;
  /** LP トップでコンパクト表示する場合 true。/pricing ページではデフォルトの false を使う */
  compact?: boolean;
};

export function HomePricingSection({
  sectionH2ClassName,
  sectionH2Style,
  compact = false,
}: HomePricingSectionProps) {
  const plan = WCC_PACKAGE_PLANS[0];

  return (
    <section id="pricing" className={PRICING_SECTION_ROOT_CLASS}>
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <h2 className={sectionH2ClassName} style={sectionH2Style}>
          翌日までに
          <br />
          手元に届くパッケージ
        </h2>

        {compact ? (
          <div className={cn("mx-auto max-w-5xl", HOME_WHAT_IS_WCC_VERT_PAD_CLASS)}>
            <div className="grid gap-20 md:grid-cols-2 md:items-center md:gap-24 lg:gap-32">
              <div className="min-w-0">
                <h3
                  className="max-w-xl text-left font-body text-[clamp(2rem,4.2vw,4rem)] leading-[1.12] text-ink"
                  style={sectionH2Style}
                  lang="ja"
                >
                  {plan.name}
                </h3>
                <p className="mt-6 font-display text-3xl font-semibold tabular-nums text-ink md:mt-8">
                  {plan.priceInTaxYen.toLocaleString("ja-JP")}
                  <span className="text-2xl font-semibold">円</span>
                  <span className="ml-1 align-baseline text-sm font-medium tabular-nums text-ink-muted sm:text-base">
                    （税込）
                  </span>
                </p>
                <p className="mt-4 font-body text-sm leading-relaxed text-ink-muted">
                  6時間撮影 / 24時間納品 / 9:16 縦動画 2 本
                </p>
                <Link
                  href="/pricing"
                  className="mt-6 inline-flex items-center gap-1 font-body text-sm text-ink underline underline-offset-4 hover:opacity-70"
                >
                  料金の詳細・オプションを見る
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="flex min-w-0 flex-col items-center gap-4 md:items-start">
                <Link
                  href="/book"
                  className="font-display inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-opacity hover:opacity-80 md:w-auto md:min-w-[200px]"
                >
                  まず相談する
                </Link>
                <p className="text-center font-body text-xs leading-relaxed text-ink-muted md:text-left">
                  日程が未定でもご相談いただけます
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="mx-auto mt-6 max-w-prose text-center font-body text-sm leading-relaxed text-ink-muted md:mt-8 md:text-base">
              一本は9:16の縦動画で、SNSにそのまま載せられる形でお渡しします。ハイライトは当日中から翌日を目安に届くため、あの日の高まりを、すぐに誰かと分け合えます。
              内訳の条件は下のパッケージ内容で確認でき、FAQと食い違うときはこちらを優先してください。
            </p>

            <div className={cn("mx-auto max-w-5xl", HOME_WHAT_IS_WCC_VERT_PAD_CLASS)}>
              <div className="grid gap-20 md:grid-cols-2 md:items-center md:gap-24 lg:gap-32">
                <div className="min-w-0">
                  <h3
                    className="max-w-xl text-left font-body text-[clamp(2rem,4.2vw,4rem)] leading-[1.12] text-ink"
                    style={sectionH2Style}
                    lang="ja"
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-6 font-display text-3xl font-semibold tabular-nums text-ink md:mt-8">
                    {plan.priceInTaxYen.toLocaleString("ja-JP")}
                    <span className="text-2xl font-semibold">円</span>
                    <span className="ml-1 align-baseline text-sm font-medium tabular-nums text-ink-muted sm:text-base">
                      （税込）
                    </span>
                  </p>
                </div>
                <div className="flex min-w-0 flex-col gap-12">
                  <ul className="space-y-2 font-body text-base leading-relaxed text-ink-muted md:space-y-3">
                    {plan.items.map((item) => (
                      <li key={item}>・{item}</li>
                    ))}
                  </ul>
                  <p className="border-t border-hairline pt-8 font-body text-xs leading-relaxed text-ink-muted md:pt-12">
                    {WCC_STANDARD_PACKAGE_DISCLAIMER}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
