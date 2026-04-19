import type { CSSProperties } from "react";

import {
  HOME_CONTENT_INNER_COLUMN_CLASS,
  HOME_WHAT_IS_WCC_VERT_PAD_CLASS,
} from "@/lib/layout/home-sections";
import { WCC_PACKAGE_PLANS, WCC_STANDARD_PACKAGE_DISCLAIMER } from "@/lib/plans";
import { cn } from "@/lib/utils/cn";

const PRICING_SECTION_ROOT_CLASS = cn(
  // `#what-is-wcc` と同じ縦パディング・scroll-mt（`page.tsx` の該当 section と揃える）
  "w-full scroll-mt-48 mt-24 border-t border-hairline pt-40 pb-0 md:mt-28 md:pt-48 md:pb-48",
  "bg-canvas-subtle",
);

type HomePricingSectionProps = {
  sectionH2ClassName: string;
  sectionH2Style: CSSProperties;
};

export function HomePricingSection({
  sectionH2ClassName,
  sectionH2Style,
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
        <p className="mx-auto mt-6 max-w-prose text-center font-body text-sm leading-relaxed text-ink-muted md:mt-8 md:text-base">
        一本は9:16の縦動画で、SNSにそのまま載せられる形でお渡しします。ハイライトは当日中から翌日を目安に届くため、あの日の高まりを、すぐに誰かと分け合えます。
        表示は税抜です。内訳の条件は下のパッケージ内容で確認でき、FAQと食い違うときはこちらを優先してください。
        </p>

        {/* `#what-is-wcc` と同じワイヤー: `max-w-5xl` + 2カラムグリッド */}
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
                {plan.priceExTaxYen.toLocaleString("ja-JP")}
                <span className="text-2xl font-semibold">円</span>
                <span className="ml-1 align-baseline text-sm font-medium tabular-nums text-ink-muted sm:text-base">
                  （税抜）
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
      </div>
    </section>
  );
}
