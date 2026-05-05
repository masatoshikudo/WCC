import {
  HOME_CONTENT_INNER_COLUMN_CLASS,
  HOME_SECTION_ANCHOR_STACK_CLASS,
} from "@/lib/layout/home-sections";
import { cn } from "@/lib/utils/cn";

const PRICING_SECTION_ROOT_CLASS = cn(
  "w-full scroll-mt-48 mt-24 border-t border-hairline pt-40 pb-0 md:mt-28 md:pt-48 md:pb-48",
  "bg-canvas",
);

/** `#pricing` チャンク読み込み中（アンカー維持） */
export function HomePricingSectionSkeleton() {
  return (
    <section id="pricing" className={PRICING_SECTION_ROOT_CLASS} aria-busy="true">
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto min-h-[12rem] max-w-5xl animate-pulse rounded-lg bg-ink/5 md:min-h-[16rem]" aria-hidden />
      </div>
    </section>
  );
}

const SERVICE_FLOW_SECTION_ROOT_CLASS =
  "w-full scroll-mt-48 border-t border-hairline bg-canvas pt-40 pb-40 md:pt-48 md:pb-48";

/** `#service-flow` チャンク読み込み中 */
export function HomeServiceFlowSectionSkeleton() {
  return (
    <section
      id="service-flow"
      className={SERVICE_FLOW_SECTION_ROOT_CLASS}
      aria-busy="true"
      aria-label="読み込み中"
    >
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto min-h-[24rem] max-w-3xl animate-pulse rounded-lg bg-ink/5 md:min-h-[28rem]" aria-hidden />
      </div>
    </section>
  );
}

/** `#faq` チャンク読み込み中 */
export function HomeFaqSectionSkeleton() {
  return (
    <section id="faq" className={HOME_SECTION_ANCHOR_STACK_CLASS} aria-busy="true" aria-label="読み込み中">
      <div className="mx-auto min-h-[18rem] max-w-4xl animate-pulse rounded-lg bg-ink/5 md:min-h-[22rem]" aria-hidden />
    </section>
  );
}
